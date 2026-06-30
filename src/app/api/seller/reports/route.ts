import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const store = await prisma.store.findUnique({
      where: { userId: user.userId }
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: { storeId: store.id }
    });

    const totalProducts = await prisma.product.count({
      where: { storeId: store.id }
    });

    // Income is just subtotal since seller gets the product price. Delivery fee & tax might go to driver/platform, but we'll say Seller income = subtotal.
    const totalIncome = orders.reduce((sum, order) => sum + order.subtotal, 0);
    const totalOrders = orders.length;

    return NextResponse.json({
      report: {
        totalIncome,
        totalOrders,
        totalProducts
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
