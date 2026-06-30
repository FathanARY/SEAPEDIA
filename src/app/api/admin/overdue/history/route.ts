import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch order history where status was set to DIKEMBALIKAN
    const history = await prisma.orderStatusHistory.findMany({
      where: {
        status: 'DIKEMBALIKAN'
      },
      include: {
        order: {
          include: {
            buyer: true,
            store: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to recent 50 for monitoring
    });

    const formattedHistory = history.map(item => ({
      id: item.order.id,
      buyer: item.order.buyer.username,
      store: item.order.store.name,
      totalAmount: item.order.totalAmount,
      deliveryMethod: item.order.deliveryMethod,
      timestamp: item.createdAt
    }));

    return NextResponse.json({ history: formattedHistory });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
