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
      where: { id }
    });

    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    if (order.storeId !== store.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (order.status !== 'SEDANG_DIKEMAS') {
      return NextResponse.json({ error: 'Status pesanan tidak valid untuk diproses' }, { status: 400 });
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id },
        data: { status: 'MENUNGGU_PENGIRIM' }
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          status: 'MENUNGGU_PENGIRIM'
        }
      });

      await tx.deliveryJob.create({
        data: {
          orderId: id,
          status: 'PENDING',
          earning: order.deliveryFee
        }
      });

      return updated;
    });

    return NextResponse.json({ message: 'Pesanan diproses', order: updatedOrder });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
