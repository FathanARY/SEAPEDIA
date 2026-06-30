import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
export async function POST(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'BUYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ error: 'Kode diskon harus diisi' }, { status: 400 });
    }

    const now = new Date();

    // Check Promo first
    const promo = await prisma.promo.findUnique({ where: { code } });
    if (promo) {
      if (promo.expiryDate < now) {
        return NextResponse.json({ error: 'Kode promo sudah kedaluwarsa' }, { status: 400 });
      }
      return NextResponse.json({
        type: 'PROMO',
        code: promo.code,
        discountAmount: promo.discountAmount
      });
    }

    // Check Voucher
    const voucher = await prisma.voucher.findUnique({ where: { code } });
    if (voucher) {
      if (voucher.expiryDate < now) {
        return NextResponse.json({ error: 'Voucher sudah kedaluwarsa' }, { status: 400 });
      }
      if (voucher.remainingUsage <= 0) {
        return NextResponse.json({ error: 'Voucher sudah habis digunakan' }, { status: 400 });
      }
      return NextResponse.json({
        type: 'VOUCHER',
        code: voucher.code,
        discountAmount: voucher.discountAmount
      });
    }

    return NextResponse.json({ error: 'Kode diskon tidak ditemukan' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
