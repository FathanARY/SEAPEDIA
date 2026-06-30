import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const vouchers = await prisma.voucher.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ vouchers });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { code, discountAmount, expiryDate, remainingUsage } = await request.json();

    if (!code || !discountAmount || !expiryDate || !remainingUsage) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const parsedDiscount = parseInt(discountAmount);
    const parsedUsage = parseInt(remainingUsage);

    if (parsedDiscount < 0 || parsedUsage < 0) {
      return NextResponse.json({ error: 'Nilai diskon dan kuota tidak boleh negatif' }, { status: 400 });
    }

    const exists = await prisma.voucher.findUnique({ where: { code } });
    if (exists) {
      return NextResponse.json({ error: 'Kode voucher sudah ada' }, { status: 400 });
    }

    const voucher = await prisma.voucher.create({
      data: {
        code,
        discountAmount: parseInt(discountAmount),
        expiryDate: new Date(expiryDate),
        remainingUsage: parseInt(remainingUsage)
      }
    });

    return NextResponse.json({ voucher });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
