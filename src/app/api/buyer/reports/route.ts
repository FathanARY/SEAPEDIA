import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'BUYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { buyerId: user.userId }
    });

    const totalSpending = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;

    return NextResponse.json({
      report: {
        totalSpending,
        totalOrders
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
