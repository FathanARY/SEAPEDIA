import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
export async function GET(
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
      where: { id },
      include: {
        order: {
          include: {
            store: true,
            buyer: {
              include: { addresses: true }
            },
            items: {
              include: { product: true }
            }
          }
        }
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Pekerjaan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
