import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      totalUsers,
      totalStores,
      totalProducts,
      totalOrders,
      totalVouchers,
      totalPromos,
      totalDeliveryJobs,
      ordersByStatus
    ] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.voucher.count(),
      prisma.promo.count(),
      prisma.deliveryJob.count(),
      prisma.order.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      })
    ]);

    // Format orders by status to an object
    const orderStatusCounts = ordersByStatus.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      metrics: {
        users: totalUsers,
        stores: totalStores,
        products: totalProducts,
        orders: totalOrders,
        vouchers: totalVouchers,
        promos: totalPromos,
        deliveryJobs: totalDeliveryJobs,
        orderStatusCounts
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
