import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'DRIVER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const job = await prisma.deliveryJob.findUnique({
      where: { id },
      include: {
        order: {
          include: { store: true }
        }
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Pekerjaan tidak ditemukan' }, { status: 404 });
    }

    if (job.driverId !== user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (job.status !== 'TAKEN') {
      return NextResponse.json({ error: 'Status pekerjaan tidak valid' }, { status: 400 });
    }

    const updatedJob = await prisma.$transaction(async (tx) => {
      // 1. Update Job Status
      const updated = await tx.deliveryJob.update({
        where: { id },
        data: {
          status: 'COMPLETED'
        }
      });

      // 2. Update Order Status
      await tx.order.update({
        where: { id: job.orderId },
        data: { status: 'PESANAN_SELESAI' }
      });

      // 3. Add to OrderStatusHistory
      await tx.orderStatusHistory.create({
        data: {
          orderId: job.orderId,
          status: 'PESANAN_SELESAI'
        }
      });

      // 4. Add Earning to Driver Wallet
      const driverWallet = await tx.wallet.upsert({
        where: { userId: user.userId },
        update: { balance: { increment: job.earning } },
        create: { userId: user.userId, balance: job.earning }
      });

      await tx.walletTransaction.create({
        data: {
          walletId: driverWallet.id,
          amount: job.earning,
          type: 'INCOME'
        }
      });

      // 5. Add Subtotal to Seller Wallet
      const sellerWallet = await tx.wallet.upsert({
        where: { userId: job.order.store.userId },
        update: { balance: { increment: job.order.subtotal } },
        create: { userId: job.order.store.userId, balance: job.order.subtotal }
      });

      await tx.walletTransaction.create({
        data: {
          walletId: sellerWallet.id,
          amount: job.order.subtotal,
          type: 'INCOME'
        }
      });

      return updated;
    });

    return NextResponse.json({ message: 'Pengiriman selesai', job: updatedJob });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
