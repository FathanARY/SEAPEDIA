import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'BUYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.userId },
      include: {
        product: {
          include: { store: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ cartItems });
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
    const { productId, quantity } = await request.json();
    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: 'Stok tidak mencukupi' }, { status: 400 });
    }

    // CHECK SINGLE STORE RULE
    const existingItems = await prisma.cartItem.findMany({
      where: { userId: user.userId },
      include: { product: true }
    });

    if (existingItems.length > 0) {
      const currentStoreId = existingItems[0].product.storeId;
      if (currentStoreId !== product.storeId) {
        return NextResponse.json({ 
          error: 'Cart_Conflict', 
          message: 'Keranjang hanya boleh berisi produk dari satu toko yang sama. Kosongkan keranjang terlebih dahulu?' 
        }, { status: 400 });
      }
    }

    // Add or Update
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: user.userId,
          productId
        }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        userId: user.userId,
        productId,
        quantity
      }
    });

    return NextResponse.json({ cartItem });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'BUYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, quantity } = await request.json();
    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: user.userId,
            productId
          }
        }
      });
      return NextResponse.json({ message: 'Item dihapus' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product || product.stock < quantity) {
      return NextResponse.json({ error: 'Stok tidak mencukupi' }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: user.userId,
          productId
        }
      },
      data: { quantity }
    });

    return NextResponse.json({ cartItem });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'BUYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const clearAll = searchParams.get('clearAll') === 'true';

    if (clearAll) {
      await prisma.cartItem.deleteMany({
        where: { userId: user.userId }
      });
      return NextResponse.json({ message: 'Keranjang dikosongkan' });
    }

    if (productId) {
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: user.userId,
            productId
          }
        }
      });
      return NextResponse.json({ message: 'Item dihapus' });
    }

    return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
