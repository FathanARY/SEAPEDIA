import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'BUYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let wallet = await prisma.wallet.findUnique({
      where: { userId: user.userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        }
      }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: user.userId,
          balance: 0,
        },
        include: {
          transactions: true
        }
      });
    }

    return NextResponse.json({ wallet });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'BUYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { amount } = await request.json();
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Jumlah top-up tidak valid' }, { status: 400 });
    }
    if (amount > 100000000) {
      return NextResponse.json({ error: 'Maksimal top-up adalah Rp 100.000.000' }, { status: 400 });
    }

    const wallet = await prisma.wallet.upsert({
      where: { userId: user.userId },
      update: {
        balance: { increment: amount }
      },
      create: {
        userId: user.userId,
        balance: amount
      }
    });

    // Catat transaksi
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: amount,
        type: 'TOPUP'
      }
    });

    return NextResponse.json({ message: 'Top-up berhasil', balance: wallet.balance });
  } catch (error: any) {
    console.error('Wallet POST Error:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
