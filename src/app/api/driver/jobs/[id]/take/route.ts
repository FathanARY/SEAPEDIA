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
      where: { id }
    });

    if (!job) {
      return NextResponse.json({ error: 'Pekerjaan tidak ditemukan' }, { status: 404 });
    }

    if (job.status !== 'PENDING') {
      return NextResponse.json({ error: 'Pekerjaan sudah diambil oleh pengemudi lain' }, { status: 400 });
    }

    const updatedJob = await prisma.$transaction(async (tx) => {
      // 1. Update Job Status
      const updated = await tx.deliveryJob.update({
        where: { id, status: 'PENDING' }, // concurrency check
        data: {
          status: 'TAKEN',
          driverId: user.userId
        }
      });

      // 2. Update Order Status
      await tx.order.update({
        where: { id: job.orderId },
        data: { status: 'SEDANG_DIKIRIM' }
      });

      // 3. Add to OrderStatusHistory
      await tx.orderStatusHistory.create({
        data: {
          orderId: job.orderId,
          status: 'SEDANG_DIKIRIM'
        }
      });

      return updated;
    });

    return NextResponse.json({ message: 'Pekerjaan berhasil diambil', job: updatedJob });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil pekerjaan. Mungkin sudah diambil orang lain.' }, { status: 500 });
  }
}
