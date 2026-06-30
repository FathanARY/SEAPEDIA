import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const store = await prisma.store.findUnique({
      where: { userId: user.userId }
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    if (order.storeId !== store.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (order.status !== 'SEDANG_DIKEMAS') {
      return NextResponse.json({ error: 'Status pesanan tidak valid untuk dibatalkan' }, { status: 400 });
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1. Update order status
      const updated = await tx.order.update({
        where: { id },
        data: { status: 'DIBATALKAN' }
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          status: 'DIBATALKAN'
        }
      });

      // 2. Refund stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        });
      }

      // 3. Refund buyer's wallet
      const buyerWallet = await tx.wallet.findUnique({
        where: { userId: order.buyerId }
      });

      if (buyerWallet) {
        await tx.wallet.update({
          where: { id: buyerWallet.id },
          data: { balance: { increment: order.totalAmount } }
        });

        await tx.walletTransaction.create({
          data: {
            walletId: buyerWallet.id,
            amount: order.totalAmount,
            type: 'REFUND'
          }
        });
      }

      return updated;
    });

    return NextResponse.json({ message: 'Pesanan dibatalkan', order: updatedOrder });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
