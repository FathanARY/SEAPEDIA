'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/ToastProvider';

export default function BuyerCartPage() {
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/buyer/cart');
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.cartItems);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await fetch('/api/buyer/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity })
      });
      fetchCart();
    } catch (err) {
      showToast('Terjadi kesalahan', 'error');
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await fetch(`/api/buyer/cart?productId=${productId}`, {
        method: 'DELETE'
      });
      fetchCart();
    } catch (err) {
      showToast('Terjadi kesalahan', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-surface-container-high border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const storeName = cartItems.length > 0 ? cartItems[0].product.store.name : '';

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/produk" className="text-on-surface-variant hover:text-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Keranjang Belanja</h1>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-12 text-center shadow-sm">
          <svg className="w-16 h-16 mx-auto text-outline mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-on-surface-variant mb-6 text-lg">Keranjang belanja Anda kosong.</p>
          <Link href="/produk">
            <button className="bg-primary text-on-primary font-semibold py-2.5 px-6 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">
              Mulai Belanja
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Cart Items grouped by Store */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm overflow-hidden">
              {/* Store Header */}
              <div className="bg-surface p-4 border-b border-surface-variant flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-on-surface text-lg">{storeName}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 flex flex-col gap-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 border-b border-surface-variant last:border-0 last:pb-0">
                    <div className="w-24 h-24 rounded-lg bg-surface-container overflow-hidden shrink-0 flex items-center justify-center">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-on-surface-variant">Foto Produk</span>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-semibold text-on-surface line-clamp-2">{item.product.name}</h4>
                          {/* <p className="text-sm text-on-surface-variant mt-1">Varian: Default</p> */}
                        </div>
                        <button 
                          onClick={() => removeItem(item.productId)}
                          className="text-outline hover:text-error transition-colors p-1" 
                          title="Hapus"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="px-3 py-1 text-on-surface hover:bg-surface-container transition-colors font-medium"
                          >-</button>
                          <input 
                            className="w-12 text-center text-sm font-medium border-x border-outline-variant border-y-0 py-1 focus:ring-0 p-0 m-0 bg-transparent" 
                            type="number" 
                            value={item.quantity}
                            readOnly
                          />
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="px-3 py-1 text-on-surface hover:bg-surface-container transition-colors font-medium disabled:opacity-50"
                          >+</button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                          </p>
                          <p className="text-xs text-on-surface-variant">Rp {item.product.price.toLocaleString('id-ID')} / satuan</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Checkout Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-on-surface mb-4">Ringkasan Belanja</h2>
              
              <div className="flex items-center gap-2 mb-6 bg-surface-container-low p-3 rounded-lg border border-surface-dim">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" />
                </svg>
                <span className="text-sm font-medium text-on-surface truncate">{storeName}</span>
              </div>

              

              {/* Calculation Lines */}
              <div className="space-y-3 border-b border-surface-variant pb-4 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Subtotal ({cartItems.length} barang)</span>
                  <span className="font-medium text-on-surface">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-on-surface-variant">
                  <span>Ongkos Kirim</span>
                  <span>Dihitung di checkout</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-bold text-on-surface">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Link href="/dashboard/buyer/checkout" className="w-full">
                  <button className="w-full bg-secondary text-on-secondary text-lg font-semibold py-3 rounded-lg shadow-sm hover:bg-secondary-container hover:text-on-secondary-container hover:shadow-md transition-all flex justify-center items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Beli Sekarang ({cartItems.length})
                  </button>
                </Link>
                <div className="flex gap-3">
                  <Link href="/produk" className="flex-1">
                    <button className="w-full bg-surface-container text-on-surface text-sm font-semibold py-2.5 rounded-lg hover:bg-surface-container-high transition-colors border border-transparent">
                      Lanjut Belanja
                    </button>
                  </Link>
                </div>
              </div>

              <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-on-surface-variant">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs">Transaksi Aman Terenkripsi</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
