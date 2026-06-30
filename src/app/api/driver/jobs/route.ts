import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'DRIVER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const availableJobs = await prisma.deliveryJob.findMany({
      where: { status: 'PENDING' },
      include: {
        order: {
          include: {
            store: true,
            buyer: {
              include: { addresses: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const activeJobs = await prisma.deliveryJob.findMany({
      where: { 
        driverId: user.userId,
        status: 'TAKEN' 
      },
      include: {
        order: {
          include: {
            store: true,
            buyer: {
              include: { addresses: true }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ availableJobs, activeJobs });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
