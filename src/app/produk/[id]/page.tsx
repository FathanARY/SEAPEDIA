'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/ToastProvider';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    params.then(p => {
      fetchProduct(p.id);
    });
  }, [params]);

  const fetchProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data.product);
      } else {
        setError('Produk tidak ditemukan');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const { showToast } = useToast();
  const router = useRouter();
  const [showConflictModal, setShowConflictModal] = useState(false);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      const res = await fetch('/api/buyer/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });
      
      if (res.status === 401) {
        router.push('/masuk');
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'Cart_Conflict') {
          setShowConflictModal(true);
        } else {
          showToast(data.error || 'Gagal menambahkan ke keranjang', 'error');
        }
      } else {
        showToast('Produk berhasil ditambahkan ke keranjang!', 'success');
      }
    } catch (err) {
      showToast('Terjadi kesalahan sistem', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleConfirmReplaceCart = async () => {
    setShowConflictModal(false);
    setAddingToCart(true);
    try {
      await fetch('/api/buyer/cart?clearAll=true', { method: 'DELETE' });
      await fetch('/api/buyer/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product!.id, quantity: 1 })
      });
      showToast('Keranjang direset dan produk ditambahkan!', 'success');
    } catch(err) {
      showToast('Gagal memproses keranjang', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-surface-container-high border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-on-surface mb-4">{error || 'Produk Tidak Ditemukan'}</h1>
        <Link href="/produk">
          <button className="px-6 py-2.5 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold text-sm">
            Kembali ke Katalog
          </button>
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-12 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex text-xs font-semibold text-on-surface-variant mb-6">
        <ol className="inline-flex items-center space-x-1">
          <li><Link href="/" className="hover:text-primary">Beranda</Link></li>
          <li className="flex items-center">
            <svg className="w-4 h-4 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <Link href="/produk" className="hover:text-primary">Katalog</Link>
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-on-surface">{product.category}</span>
          </li>
        </ol>
      </nav>

      {/* Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="w-full aspect-square bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden relative shadow-sm flex items-center justify-center text-outline-variant">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            {product.stock <= 0 && (
              <div className="absolute top-4 left-4 bg-error text-on-error text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Stok Habis</div>
            )}
          </div>
        </div>

        {/* Right: Details & Buy Box */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Title & Category */}
          <div className="flex flex-col gap-2 border-b border-outline-variant pb-4">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{product.category}</span>
            <h1 className="text-2xl lg:text-3xl font-bold text-on-surface">{product.name}</h1>
          </div>

          {/* Price & Stock */}
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-bold text-primary">Rp {product.price.toLocaleString('id-ID')}</span>
            <p className="text-xs text-tertiary-container flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {product.stock > 0 ? `Stok tersedia (${product.stock} unit)` : 'Stok habis'}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-on-surface-variant leading-relaxed">
            {product.description}
          </p>

          {/* Buy Box */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="w-full bg-secondary text-on-secondary py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-secondary-container hover:text-on-secondary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {addingToCart ? 'Menambahkan...' : (product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis')}
              </button>
              <Link href="/dashboard/buyer/cart" className="w-full">
                <button className="w-full border-2 border-primary text-primary py-3 rounded-lg text-sm font-bold hover:bg-primary/5 transition-colors">
                  Lihat Keranjang
                </button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                Pengiriman Seluruh Indonesia
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                Transaksi Aman
              </span>
            </div>
          </div>

          {/* Seller Block */}
          <div className="bg-surface-container p-4 rounded-xl border border-outline-variant flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">
                {product.store?.name?.charAt(0).toUpperCase() || 'T'}
              </div>
              <div>
                <h3 className="font-semibold text-on-surface">{product.store?.name || 'Toko'}</h3>
                <p className="text-xs text-on-surface-variant">{product.store?.description || 'Toko Resmi SEAPEDIA'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Conflict Modal */}
      {showConflictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg max-w-sm w-full p-6 border border-outline-variant animate-scale-in">
            <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Ganti Toko?</h3>
            <p className="text-body-md text-on-surface-variant mb-6">
              Produk yang ingin Anda tambahkan berasal dari toko yang berbeda. Apakah Anda ingin mengosongkan keranjang saat ini dan menambahkan produk ini?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConflictModal(false)}
                className="px-4 py-2 rounded-lg text-label-md font-label-md font-bold hover:bg-surface-container-high transition-colors text-on-surface-variant border border-outline-variant"
              >
                Batal
              </button>
              <button 
                onClick={handleConfirmReplaceCart}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-label-md font-label-md font-bold hover:bg-surface-tint transition-colors"
              >
                Ya, Ganti
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
