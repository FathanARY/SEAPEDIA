import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const promos = await prisma.promo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ promos });
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
    const { code, discountAmount, expiryDate } = await request.json();

    if (!code || !discountAmount || !expiryDate) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const parsedDiscount = parseInt(discountAmount);
    if (parsedDiscount < 0) {
      return NextResponse.json({ error: 'Nilai diskon tidak boleh negatif' }, { status: 400 });
    }

    const exists = await prisma.promo.findUnique({ where: { code } });
    if (exists) {
      return NextResponse.json({ error: 'Kode promo sudah ada' }, { status: 400 });
    }

    const promo = await prisma.promo.create({
      data: {
        code,
        discountAmount: parseInt(discountAmount),
        expiryDate: new Date(expiryDate)
      }
    });

    return NextResponse.json({ promo });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
