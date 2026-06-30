import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'DRIVER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const completedJobs = await prisma.deliveryJob.findMany({
      where: {
        driverId: user.userId,
        status: 'COMPLETED'
      },
      orderBy: { updatedAt: 'desc' }
    });

    const totalEarnings = completedJobs.reduce((acc, job) => acc + job.earning, 0);

    return NextResponse.json({
      report: {
        totalEarnings,
        totalCompletedJobs: completedJobs.length,
        jobs: completedJobs
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
