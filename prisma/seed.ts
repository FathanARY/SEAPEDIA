import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Truncating database...');
  // Delete in reverse order of dependencies
  await prisma.deliveryJob.deleteMany();
  await prisma.promo.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.address.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding database with demo data...');

  const password = await bcrypt.hash('password123', 12);

  // 1. Promo "compfest"
  await prisma.promo.create({
    data: {
      code: 'COMPFEST',
      discountAmount: 50000,
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
    }
  });

  // 2. Super User (Admin, Seller, Buyer)
  const superuser = await prisma.user.create({
    data: {
      username: 'superuser',
      email: 'super@seapedia.com',
      password,
      roles: {
        create: [{ role: 'ADMIN' }, { role: 'SELLER' }, { role: 'BUYER' }, { role: 'DRIVER' }]
      },
      wallet: {
        create: {
          balance: 5000000
        }
      },
      addresses: {
        create: [{
          label: 'Rumah Utama',
          fullAddress: 'Jl. Sudirman No. 1, Jakarta',
          isDefault: true
        }]
      },
      store: {
        create: {
          name: 'Super Store ID',
          description: 'Toko serba ada terlengkap'
        }
      }
    }
  });

  const superStore = await prisma.store.findUnique({ where: { userId: superuser.id } });

  // Add Products to Super Store
  const product1 = await prisma.product.create({
    data: {
      name: 'Laptop Gaming RTX 4090',
      description: 'Laptop gaming super kencang',
      price: 35000000,
      stock: 10,
      category: 'Elektronik',
      storeId: superStore!.id
    }
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Mechanical Keyboard',
      description: 'Keyboard mechanical blue switch',
      price: 750000,
      stock: 50,
      category: 'Aksesoris',
      storeId: superStore!.id
    }
  });

  // 3. Driver User
  const driver = await prisma.user.create({
    data: {
      username: 'kurir_kilat',
      email: 'driver@seapedia.com',
      password,
      roles: {
        create: [{ role: 'DRIVER' }]
      },
      wallet: {
        create: {
          balance: 100000
        }
      }
    }
  });

  // 4. Regular Buyer
  const buyer = await prisma.user.create({
    data: {
      username: 'pembeli_biasa',
      email: 'buyer@seapedia.com',
      password,
      roles: {
        create: [{ role: 'BUYER' }]
      },
      wallet: {
        create: {
          balance: 2000000
        }
      },
      addresses: {
        create: [{
          label: 'Kantor',
          fullAddress: 'Gedung Menara 1, SCBD',
          isDefault: true
        }]
      }
    }
  });

  // 5. Orders and Statuses
  // Order 1: Sedang Dikemas
  const order1 = await prisma.order.create({
    data: {
      buyerId: buyer.id,
      storeId: superStore!.id,
      subtotal: 750000,
      deliveryFee: 20000,
      taxAmount: 75000,
      discountAmount: 0,
      totalAmount: 845000,
      deliveryMethod: 'REGULAR',
      status: 'SEDANG_DIKEMAS',
      items: {
        create: [
          { productId: product2.id, quantity: 1, price: 750000 }
        ]
      },
      statusHistory: {
        create: [
          { status: 'SEDANG_DIKEMAS' }
        ]
      }
    }
  });

  // Order 2: Menunggu Pengirim
  const order2 = await prisma.order.create({
    data: {
      buyerId: superuser.id,
      storeId: superStore!.id,
      subtotal: 35000000,
      deliveryFee: 50000,
      taxAmount: 3500000,
      discountAmount: 50000,
      discountCode: 'compfest',
      totalAmount: 38500000,
      deliveryMethod: 'INSTANT',
      status: 'MENUNGGU_PENGIRIM',
      items: {
        create: [
          { productId: product1.id, quantity: 1, price: 35000000 }
        ]
      },
      statusHistory: {
        create: [
          { status: 'SEDANG_DIKEMAS' },
          { status: 'MENUNGGU_PENGIRIM' }
        ]
      }
    }
  });

  // Add Delivery Job for Order 2 (Pending)
  await prisma.deliveryJob.create({
    data: {
      orderId: order2.id,
      status: 'PENDING',
      earning: 40000
    }
  });

  // Order 3: Sedang Dikirim
  const order3 = await prisma.order.create({
    data: {
      buyerId: buyer.id,
      storeId: superStore!.id,
      subtotal: 1500000,
      deliveryFee: 15000,
      taxAmount: 150000,
      discountAmount: 0,
      totalAmount: 1665000,
      deliveryMethod: 'NEXT_DAY',
      status: 'SEDANG_DIKIRIM',
      items: {
        create: [
          { productId: product2.id, quantity: 2, price: 750000 }
        ]
      },
      statusHistory: {
        create: [
          { status: 'SEDANG_DIKEMAS' },
          { status: 'MENUNGGU_PENGIRIM' },
          { status: 'SEDANG_DIKIRIM' }
        ]
      }
    }
  });

  // Add Delivery Job for Order 3 (Taken by driver)
  await prisma.deliveryJob.create({
    data: {
      orderId: order3.id,
      driverId: driver.id,
      status: 'TAKEN',
      earning: 12000
    }
  });

  // Cart Items
  await prisma.cartItem.create({
    data: {
      userId: buyer.id,
      productId: product1.id,
      quantity: 1
    }
  });

  // 6. Reviews (Ulasan)
  await prisma.review.createMany({
    data: [
      {
        name: 'Budi Santoso',
        rating: 5,
        comment: 'Produk sangat berkualitas, pengiriman super cepat! Sangat puas belanja di sini.',
      },
      {
        name: 'Siti Rahmawati',
        rating: 5,
        comment: 'Packing rapi dan aman, seller ramah. Recommended banget!',
      },
      {
        name: 'Andi Wijaya',
        rating: 4,
        comment: 'Barang sesuai deskripsi dan berfungsi dengan baik. Terima kasih SEAPEDIA.',
      },
      {
        name: 'Dewi Lestari',
        rating: 5,
        comment: 'Wah, luar biasa! Dapat harga promo dan kualitas barang top markotop.',
      },
      {
        name: 'Rizki Aditya',
        rating: 5,
        comment: 'Pelayanan kurir cepat dan memuaskan. Barang sampai tanpa cacat.',
      },
      {
        name: 'Nisa Ayu',
        rating: 4,
        comment: 'Bagus banget produknya, mantap! Bakal order lagi nih pastinya.',
      }
    ]
  });

  console.log('✅ Demo accounts and data seeded successfully!');
  console.log('Superuser: super@seapedia.com | password123 (Roles: ADMIN, SELLER, BUYER)');
  console.log('Driver: driver@seapedia.com | password123');
  console.log('Buyer: buyer@seapedia.com | password123');
  console.log('Promo Code: COMPFEST (Discount Rp 50.000)');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
