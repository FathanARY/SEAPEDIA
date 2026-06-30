'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/buyer/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PESANAN_SELESAI': return 'bg-tertiary/10 text-tertiary border-tertiary/20';
      case 'DIKEMBALIKAN': return 'bg-error/10 text-error border-error/20';
      case 'SEDANG_DIKIRIM': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-surface-container-highest text-on-surface border-outline-variant';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-lg animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface">Daftar Pesanan</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant mt-xs">Lacak dan kelola semua pesanan Anda.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-md rounded-full bg-surface-container-high flex items-center justify-center">
            <svg className="w-8 h-8 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
          </div>
          <p className="text-on-surface-variant mb-md">Belum ada pesanan.</p>
          <Link href="/produk">
            <button className="bg-primary text-on-primary px-lg py-sm rounded-full text-label-md font-label-md hover:bg-surface-tint transition-colors shadow-sm">
              Mulai Belanja
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-md">
          {orders.map((order) => (
            <div key={order.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08)] transition-shadow">
              {/* Header */}
              <div className="flex items-center justify-between p-md bg-surface-bright border-b border-surface-variant">
                <div className="flex flex-wrap gap-lg text-sm">
                  <div>
                    <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Tanggal</span>
                    <p className="font-semibold text-on-surface mt-xs">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Total</span>
                    <p className="font-semibold text-on-surface mt-xs">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Toko</span>
                    <p className="font-semibold text-on-surface mt-xs">{order.store.name}</p>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center px-sm py-xs rounded-full text-label-sm font-label-sm border ${getStatusColor(order.status)}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="p-md flex flex-col gap-md">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-md">
                    <div className="w-16 h-16 bg-surface-container rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-6 h-6 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-body-md text-on-surface">{item.product.name}</h3>
                      <p className="text-label-md text-on-surface-variant mt-xs">{item.quantity} barang x Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="p-md border-t border-surface-variant flex justify-end gap-sm">
                <Link href={`/dashboard/buyer/orders/${order.id}`}>
                  <button className="bg-primary text-on-primary px-md py-sm rounded-lg text-label-md font-label-md hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-xs">
                    Detail Pesanan
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
