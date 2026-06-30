import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
const DELIVERY_FEES = {
  INSTANT: 20000,
  NEXT_DAY: 15000,
  REGULAR: 10000,
};

export async function POST(request: NextRequest) {
  const user = await getUser(request);
  if (!user || user.activeRole !== 'BUYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { deliveryMethod, addressId, discountCode } = await request.json();
    
    if (!deliveryMethod || !DELIVERY_FEES[deliveryMethod as keyof typeof DELIVERY_FEES]) {
      return NextResponse.json({ error: 'Metode pengiriman tidak valid' }, { status: 400 });
    }

    if (!addressId) {
      return NextResponse.json({ error: 'Alamat pengiriman harus dipilih' }, { status: 400 });
    }

    // Ambil cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.userId },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Keranjang belanja kosong' }, { status: 400 });
    }

    const storeId = cartItems[0].product.storeId;
    
    let subtotal = 0;
    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        return NextResponse.json({ error: `Stok ${item.product.name} tidak mencukupi` }, { status: 400 });
      }
      subtotal += item.product.price * item.quantity;
    }

    let discountAmount = 0;
    let appliedVoucherId: string | null = null;
    let validDiscountCode: string | null = null;

    if (discountCode) {
      const now = new Date();
      // Check Promo
      const promo = await prisma.promo.findUnique({ where: { code: discountCode } });
      if (promo && promo.expiryDate >= now) {
        discountAmount = promo.discountAmount;
        validDiscountCode = promo.code;
      } else {
        // Check Voucher
        const voucher = await prisma.voucher.findUnique({ where: { code: discountCode } });
        if (voucher && voucher.expiryDate >= now && voucher.remainingUsage > 0) {
          discountAmount = voucher.discountAmount;
          validDiscountCode = voucher.code;
          appliedVoucherId = voucher.id;
        } else {
          return NextResponse.json({ error: 'Kode diskon tidak valid atau kedaluwarsa' }, { status: 400 });
        }
      }
    }

    const deliveryFee = DELIVERY_FEES[deliveryMethod as keyof typeof DELIVERY_FEES];
    // PPN is calculated on (subtotal - discount) or 0 if discount > subtotal
    const baseAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.floor(baseAmount * 0.12);
    const totalAmount = baseAmount + deliveryFee + taxAmount;

    // Cek saldo
    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.userId }
    });

    if (!wallet || wallet.balance < totalAmount) {
      return NextResponse.json({ error: 'Saldo wallet tidak mencukupi' }, { status: 400 });
    }

    // Transaksi database
    const order = await prisma.$transaction(async (tx) => {
      // 1. Kurangi saldo
      const updatedWallet = await tx.wallet.update({
        where: { userId: user.userId },
        data: { balance: { decrement: totalAmount } }
      });

      // 2. Catat transaksi wallet
      await tx.walletTransaction.create({
        data: {
          walletId: updatedWallet.id,
          amount: totalAmount,
          type: 'PAYMENT'
        }
      });

      // 3. Buat order
      const newOrder = await tx.order.create({
        data: {
          buyerId: user.userId,
          storeId: storeId,
          subtotal,
          deliveryFee,
          taxAmount,
          discountAmount,
          discountCode: validDiscountCode,
          totalAmount,
          deliveryMethod,
          status: 'SEDANG_DIKEMAS',
          items: {
            create: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price
            }))
          },
          statusHistory: {
            create: [{ status: 'SEDANG_DIKEMAS' }]
          }
        }
      });

      // 4. Update usage voucher jika ada
      if (appliedVoucherId) {
        await tx.voucher.update({
          where: { id: appliedVoucherId },
          data: { remainingUsage: { decrement: 1 } }
        });
      }

      // 5. Kurangi stok produk & kosongkan keranjang
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      await tx.cartItem.deleteMany({
        where: { userId: user.userId }
      });

      return newOrder;
    });

    return NextResponse.json({ message: 'Checkout berhasil', orderId: order.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
