import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'BUYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: user.userId },
      orderBy: { isDefault: 'desc' }
    });
    return NextResponse.json({ addresses });
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
    const { label, fullAddress, isDefault } = await request.json();
    if (!label || !fullAddress) {
      return NextResponse.json({ error: 'Label dan alamat lengkap harus diisi' }, { status: 400 });
    }

    if (isDefault) {
      // Remove other default flags
      await prisma.address.updateMany({
        where: { userId: user.userId, isDefault: true },
        data: { isDefault: false }
      });
    }

    const checkExisting = await prisma.address.count({
      where: { userId: user.userId }
    });

    const address = await prisma.address.create({
      data: {
        userId: user.userId,
        label,
        fullAddress,
        isDefault: isDefault || checkExisting === 0 // Make default if it's the first one
      }
    });

    return NextResponse.json({ address });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
