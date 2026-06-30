'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  if (pathname === '/masuk' || pathname === '/daftar') {
    return null;
  }

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-neutral-900 font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-lg text-white tracking-tight">SEAPEDIA</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Platform marketplace yang menghubungkan penjual, pembeli, dan pengirim dalam satu ekosistem perdagangan digital.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-2 flex md:justify-end items-end">
            <ul className="flex flex-row gap-4 md:gap-8 flex-wrap">
              <li>
                <Link href="/" className="text-sm hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/produk" className="text-sm hover:text-white transition-colors">
                  Produk
                </Link>
              </li>
              <li>
                <Link href="/masuk" className="text-sm hover:text-white transition-colors">
                  Masuk
                </Link>
              </li>
              <li>
                <Link href="/daftar" className="text-sm hover:text-white transition-colors">
                  Daftar
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
