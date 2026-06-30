import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const store = await prisma.store.findUnique({
      where: { userId: user.userId },
    });
    return NextResponse.json({ store });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Nama toko harus diisi' }, { status: 400 });
    }

    // Check if user already has a store
    const existingStore = await prisma.store.findUnique({
      where: { userId: user.userId },
    });

    if (existingStore) {
      return NextResponse.json({ error: 'Anda sudah memiliki toko' }, { status: 400 });
    }

    // Check uniqueness
    const nameExists = await prisma.store.findUnique({
      where: { name },
    });

    if (nameExists) {
      return NextResponse.json({ error: 'Nama toko sudah digunakan' }, { status: 400 });
    }

    const store = await prisma.store.create({
      data: {
        name,
        description: description || '',
        userId: user.userId,
      },
    });

    return NextResponse.json({ store });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Nama toko harus diisi' }, { status: 400 });
    }

    // Ensure store exists
    const existingStore = await prisma.store.findUnique({
      where: { userId: user.userId },
    });

    if (!existingStore) {
      return NextResponse.json({ error: 'Toko tidak ditemukan' }, { status: 404 });
    }

    // Check name uniqueness if changed
    if (name !== existingStore.name) {
      const nameExists = await prisma.store.findUnique({
        where: { name },
      });
      if (nameExists) {
        return NextResponse.json({ error: 'Nama toko sudah digunakan' }, { status: 400 });
      }
    }

    const store = await prisma.store.update({
      where: { userId: user.userId },
      data: { name, description },
    });

    return NextResponse.json({ store });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
