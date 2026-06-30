'use client';

import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  storeName: string;
  category: string;
  stock: number;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductCard({
  id,
  name,
  price,
  storeName,
  category,
  stock,
}: ProductCardProps) {
  return (
    <Link href={`/produk/${id}`}>
      <Card hoverable className="h-full flex flex-col">
        {/* Product image placeholder */}
        <div className="w-full aspect-square bg-neutral-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-xs text-neutral-400 mt-1 block">{category}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-medium text-neutral-900 text-sm leading-snug mb-1 line-clamp-2">
            {name}
          </h3>
          <p className="text-lg font-bold text-neutral-900 mb-2">
            {formatRupiah(price)}
          </p>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-xs text-neutral-500">{storeName}</span>
            <span className="text-xs text-neutral-400">Stok: {stock}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export { formatRupiah };
