import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getUser(request);
  if (!user || user.activeRole !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const store = await prisma.store.findUnique({
      where: { userId: user.userId },
    });

    if (!store) {
      return NextResponse.json({ error: 'Toko belum dibuat' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product || product.storeId !== store.id) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getUser(request);
  if (!user || user.activeRole !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description, price, stock, category, imageUrl } = await request.json();

    const parsedPrice = parseInt(price, 10);
    const parsedStock = parseInt(stock, 10);

    if (parsedPrice < 0 || parsedStock < 0) {
      return NextResponse.json({ error: 'Harga dan stok tidak boleh negatif' }, { status: 400 });
    }

    const store = await prisma.store.findUnique({
      where: { userId: user.userId },
    });

    if (!store) {
      return NextResponse.json({ error: 'Toko belum dibuat' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product || product.storeId !== store.id) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseInt(price, 10),
        stock: parseInt(stock, 10),
        category,
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
      },
    });


    return NextResponse.json({ product: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getUser(request);
  if (!user || user.activeRole !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const store = await prisma.store.findUnique({
      where: { userId: user.userId },
    });

    if (!store) {
      return NextResponse.json({ error: 'Toko belum dibuat' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product || product.storeId !== store.id) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
