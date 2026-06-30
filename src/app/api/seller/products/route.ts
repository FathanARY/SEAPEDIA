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
      include: {
        products: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!store) {
      return NextResponse.json({ products: [] });
    }

    return NextResponse.json({ products: store.products });
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
    const { name, description, price, stock, category, imageUrl } = await request.json();

    if (!name || !description || price === undefined || stock === undefined || !category) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

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

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price, 10),
        stock: parseInt(stock, 10),
        category,
        imageUrl: imageUrl || null,
        storeId: store.id,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
