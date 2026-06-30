'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/ToastProvider';

export default function SellerDashboard() {
  const { showToast } = useToast();
  const [stats, setStats] = useState({ totalIncome: 0, totalProducts: 0, totalOrders: 0 });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productError, setProductError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsRes, productsRes] = await Promise.all([
        fetch('/api/seller/reports', { cache: 'no-store' }),
        fetch('/api/seller/products', { cache: 'no-store' })
      ]);

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        if (reportsData.report) {
          setStats(reportsData.report);
        }
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
      } else {
        const productsData = await productsRes.json();
        setProductError(productsData.error || 'Gagal memuat produk');
      }
    } catch (error) {
      console.error(error);
      setProductError('Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    
    try {
      const res = await fetch(`/api/seller/products/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        showToast('Produk berhasil dihapus', 'success');
      } else {
        showToast('Gagal menghapus produk', 'error');
      }
    } catch (error) {
      showToast('Terjadi kesalahan', 'error');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="flex-1 max-w-[1200px] mx-auto animate-fade-in pb-xl">
      <header className="mb-lg">
        <h1 className="text-headline-lg font-headline-lg text-on-surface">Dashboard Penjual</h1>
        <p className="text-body-md font-body-md text-on-surface-variant mt-sm">Ringkasan toko dan aktivitas penjualan Anda.</p>
      </header>

      {/* Summary Cards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
        {/* Total Products */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
          <div className="flex justify-between items-start mb-lg relative z-10">
            <div>
              <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Total Produk</p>
              <h3 className="text-headline-lg font-headline-lg text-on-surface mt-xs">{stats.totalProducts}</h3>
            </div>
            <div className="p-2 bg-primary-container rounded-lg text-on-primary-container">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-container/20 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
          <div className="flex justify-between items-start mb-lg relative z-10">
            <div>
              <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Total Pesanan</p>
              <h3 className="text-headline-lg font-headline-lg text-on-surface mt-xs">{stats.totalOrders}</h3>
            </div>
            <div className="p-2 bg-secondary-container rounded-lg text-on-secondary-container">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-primary text-on-primary rounded-xl p-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08)] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-lg relative z-10">
            <div>
              <p className="text-label-md font-label-md text-on-primary/80 uppercase tracking-wider">Total Pendapatan</p>
              <h3 className="text-headline-lg font-headline-lg text-on-primary mt-xs">Rp {stats.totalIncome.toLocaleString('id-ID')}</h3>
            </div>
            <div className="p-2 bg-white/20 rounded-lg text-on-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-outline-variant my-xl"></div>

      {/* Kelola Produk Section */}
      <header className="flex justify-between items-center mb-md">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface">Kelola Toko Anda</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-sm">Atur produk, stok, dan harga penjualan Anda.</p>
        </div>
        <Link href="/dashboard/seller/products/add">
          <button className="bg-primary text-on-primary px-lg py-sm rounded-full flex items-center gap-sm hover:bg-surface-tint transition-colors shadow-sm hover:shadow">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-label-md font-label-md font-bold">Tambah Produk</span>
          </button>
        </Link>
      </header>

      {productError && (
        <div className="bg-error-container text-on-error-container p-md rounded-xl mb-md border border-error/20">
          {productError} (Pastikan Anda sudah membuat profil toko terlebih dahulu).
        </div>
      )}

      {!productError && products.length === 0 ? (
        <section className="flex flex-col items-center justify-center p-xl bg-surface-container-lowest rounded-xl border border-surface-variant shadow-[0_4px_4px_rgba(0,0,0,0.04)] mt-lg text-center h-64">
          <svg className="w-12 h-12 text-outline-variant mb-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-headline-md font-headline-md text-on-surface mb-xs">Belum ada produk</h3>
          <p className="text-body-md font-body-md text-on-surface-variant mb-md max-w-md">Anda belum menambahkan produk ke toko Anda. Mulai bangun inventaris Anda untuk mendapatkan pesanan.</p>
          <Link href="/dashboard/seller/products/add">
            <button className="bg-primary text-on-primary px-lg py-sm rounded-full flex items-center gap-sm hover:bg-surface-tint transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="text-label-md font-label-md font-bold">Tambah Produk Pertama</span>
            </button>
          </Link>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {products.map((product) => (
            <article key={product.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="h-48 w-full bg-surface-container relative flex items-center justify-center">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-12 h-12 text-outline-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                <div className={`absolute top-sm right-sm px-2 py-1 rounded text-label-sm font-label-sm font-bold opacity-90 ${product.stock > 0 ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
                  {product.stock > 0 ? 'Aktif' : 'Habis'}
                </div>
              </div>
              <div className="p-md flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-sm gap-sm">
                  <div>
                    <h3 className="text-headline-md font-headline-md text-on-surface line-clamp-1">{product.name}</h3>
                    <p className="text-label-sm font-label-sm text-outline mt-xs font-bold uppercase tracking-wider">{product.category}</p>
                  </div>
                  <span className="text-headline-md font-headline-md text-primary font-bold whitespace-nowrap">Rp {product.price.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex gap-md mb-md mt-auto pt-md border-t border-outline-variant">
                  <div className="flex flex-col">
                    <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Stok</span>
                    <span className="text-body-md font-body-md text-on-surface font-bold">{product.stock}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Terjual</span>
                    <span className="text-body-md font-body-md text-on-surface font-bold">-</span>
                  </div>
                </div>
                <div className="flex gap-sm">
                  <Link href={`/dashboard/seller/products/${product.id}/edit`} className="flex-1">
                    <button className="w-full py-2 border border-outline-variant rounded-lg text-primary hover:bg-surface-container-low transition-colors text-label-md font-label-md font-bold flex justify-center items-center gap-xs">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  </Link>
                  <button 
                    onClick={() => deleteProduct(product.id)}
                    className="flex-1 py-2 border border-error/50 text-error rounded-lg hover:bg-error-container hover:text-error hover:border-error transition-colors text-label-md font-label-md font-bold flex justify-center items-center gap-xs"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Hapus
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
