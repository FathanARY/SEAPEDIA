import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
// SLA configuration in days
const SLA_DAYS: Record<string, number> = {
  'INSTANT': 1,
  'NEXT_DAY': 2,
  'REGULAR': 5,
};

// Seller processing SLA is 1 day regardless of delivery method
const SELLER_PROCESSING_SLA_DAYS = 1;

export async function POST(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const simulateDays = parseInt(body.simulateDays) || 0;
    
    // Convert simulated days to milliseconds
    const simulateMs = simulateDays * 24 * 60 * 60 * 1000;
    const nowSimulated = new Date(Date.now() + simulateMs);

    // Get all active orders
    const activeOrders = await prisma.order.findMany({
      where: {
        status: {
          in: ['SEDANG_DIKEMAS', 'MENUNGGU_PENGIRIM', 'SEDANG_DIKIRIM']
        }
      },
      include: {
        items: true,
        buyer: { include: { wallet: true } }
      }
    });

    let refundedCount = 0;
    const processedOrders: any[] = [];

    for (const order of activeOrders) {
      let isOverdue = false;
      let overdueReason = '';
      const orderUpdatedAt = new Date(order.updatedAt).getTime();
      const timeElapsedMs = nowSimulated.getTime() - orderUpdatedAt;
      const daysElapsed = timeElapsedMs / (1000 * 60 * 60 * 24);

      if (order.status === 'SEDANG_DIKEMAS') {
        if (daysElapsed >= SELLER_PROCESSING_SLA_DAYS) {
          isOverdue = true;
          overdueReason = 'Batas Waktu Pengemasan Terlampaui';
        }
      } else if (order.status === 'MENUNGGU_PENGIRIM' || order.status === 'SEDANG_DIKIRIM') {
        const deliverySLA = SLA_DAYS[order.deliveryMethod] || 5;
        if (daysElapsed >= deliverySLA) {
          isOverdue = true;
          overdueReason = 'Batas Waktu Pengiriman Terlampaui';
        }
      }

      if (isOverdue) {
        await prisma.$transaction(async (tx) => {
          // 1. Update order status to DIKEMBALIKAN
          await tx.order.update({
            where: { id: order.id },
            data: { status: 'DIKEMBALIKAN' }
          });

          // 2. Add history
          await tx.orderStatusHistory.create({
            data: {
              orderId: order.id,
              status: 'DIKEMBALIKAN'
            }
          });

          // 3. Refund Buyer Wallet
          if (order.buyer.wallet) {
            await tx.wallet.update({
              where: { id: order.buyer.wallet.id },
              data: { balance: { increment: order.totalAmount } }
            });

            await tx.walletTransaction.create({
              data: {
                walletId: order.buyer.wallet.id,
                amount: order.totalAmount,
                type: 'REFUND'
              }
            });
          }

          // 4. Restore Product Stock
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } }
            });
          }

          // 5. Update DeliveryJob if any
          const job = await tx.deliveryJob.findUnique({ where: { orderId: order.id } });
          if (job) {
            await tx.deliveryJob.update({
              where: { orderId: order.id },
              data: { status: 'COMPLETED', earning: 0 }
            });
          }
        });

        processedOrders.push({
          id: order.id,
          buyer: order.buyer.username,
          totalAmount: order.totalAmount,
          previousStatus: order.status,
          reason: overdueReason
        });
        refundedCount++;
      }
    }

    return NextResponse.json({ message: 'Overdue check completed', refundedCount, processedOrders });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
