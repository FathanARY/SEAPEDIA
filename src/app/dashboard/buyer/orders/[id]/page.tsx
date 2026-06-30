'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BuyerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(p => fetchOrder(p.id));
  }, [params]);

  const fetchOrder = async (id: string) => {
    try {
      const res = await fetch('/api/buyer/orders');
      if (res.ok) {
        const data = await res.json();
        const found = data.orders.find((o: any) => o.id === id);
        setOrder(found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Define tracking steps in order
  const trackingSteps = [
    { status: 'SEDANG_DIKEMAS', label: 'Sedang Dikemas', desc: 'Penjual sedang mempersiapkan pesanan Anda.', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { status: 'MENUNGGU_PENGIRIM', label: 'Menunggu Pengirim', desc: 'Paket siap diambil oleh kurir.', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.079-.481 1.09-1.102a48.47 48.47 0 00-.885-10.316A3.32 3.32 0 0017.598 5h-1.52a.75.75 0 00-.363.106l-1.217.73a3.37 3.37 0 01-1.737.482H7.5a3.375 3.375 0 00-3.375 3.375v4.932M8.25 18.75h-.002z' },
    { status: 'SEDANG_DIKIRIM', label: 'Sedang Dikirim', desc: 'Paket sedang dalam perjalanan ke tujuan.', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.079-.481 1.09-1.102a48.47 48.47 0 00-.885-10.316A3.32 3.32 0 0017.598 5h-1.52a.75.75 0 00-.363.106l-1.217.73a3.37 3.37 0 01-1.737.482H7.5a3.375 3.375 0 00-3.375 3.375v4.932M8.25 18.75h-.002z' },
    { status: 'PESANAN_SELESAI', label: 'Pesanan Selesai', desc: 'Paket telah berhasil diterima.', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const getStepState = (stepStatus: string) => {
    if (!order) return 'pending';
    const historyStatuses = order.statusHistory.map((h: any) => h.status);
    
    if (historyStatuses.includes(stepStatus)) return 'completed';
    if (order.status === 'DIKEMBALIKAN') return 'pending';
    
    // Current active step
    const currentStepIndex = trackingSteps.findIndex(s => s.status === order.status);
    const thisStepIndex = trackingSteps.findIndex(s => s.status === stepStatus);
    if (thisStepIndex === currentStepIndex) return 'active';
    
    return 'pending';
  };

  const getStepTimestamp = (stepStatus: string) => {
    if (!order) return null;
    const entry = order.statusHistory.find((h: any) => h.status === stepStatus);
    return entry ? new Date(entry.createdAt).toLocaleString('id-ID') : null;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!order) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-md">
      <p className="text-on-surface-variant">Pesanan tidak ditemukan</p>
      <Link href="/dashboard/buyer/orders" className="text-primary hover:underline text-label-md">← Kembali ke Daftar Pesanan</Link>
    </div>
  );

  const totalItems = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);

  return (
    <div className="w-full flex flex-col gap-lg animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-sm">
        <Link href="/dashboard/buyer/orders" className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-sm rounded-full hover:bg-surface-container-low">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <h1 className="text-headline-md font-headline-md text-on-surface">Detail Pesanan</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Main Content: Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-lg">

          {/* Order Header Info Card */}
          <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04),0_2px_4px_-1px_rgba(0,0,0,0.02)] p-lg border border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-md">
            <div>
              <div className="text-label-md font-label-md text-on-surface-variant mb-base uppercase tracking-wider">Nomor Pesanan</div>
              <div className="text-headline-md font-headline-md text-primary break-all">#{order.id.slice(-12).toUpperCase()}</div>
              <div className="text-body-md font-body-md text-on-surface-variant mt-xs flex items-center gap-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                {new Date(order.createdAt).toLocaleString('id-ID')}
              </div>
            </div>
            <div className={`flex items-center gap-sm px-md py-sm rounded-full border ${
              order.status === 'PESANAN_SELESAI' ? 'bg-tertiary/10 border-tertiary/20 text-tertiary' :
              order.status === 'DIKEMBALIKAN' ? 'bg-error/10 border-error/20 text-error' :
              'bg-primary/10 border-primary/20 text-primary'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {order.status === 'PESANAN_SELESAI' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : order.status === 'DIKEMBALIKAN' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.079-.481 1.09-1.102a48.47 48.47 0 00-.885-10.316A3.32 3.32 0 0017.598 5h-1.52a.75.75 0 00-.363.106l-1.217.73a3.37 3.37 0 01-1.737.482H7.5a3.375 3.375 0 00-3.375 3.375v4.932" />
                )}
              </svg>
              <span className="text-label-md font-label-md">{order.status.replace(/_/g, ' ')}</span>
            </div>
          </section>

          {/* Status Timeline Tracker */}
          {order.status !== 'DIKEMBALIKAN' ? (
            <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04),0_2px_4px_-1px_rgba(0,0,0,0.02)] p-lg border border-outline-variant">
              <h2 className="text-headline-md font-headline-md text-on-surface mb-lg">Status Tracking</h2>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-outline-variant rounded-full"></div>
                <div className="flex flex-col gap-xl">
                  {trackingSteps.map((step) => {
                    const state = getStepState(step.status);
                    const timestamp = getStepTimestamp(step.status);
                    return (
                      <div key={step.status} className={`relative flex gap-md items-start group ${state === 'pending' ? 'opacity-50' : ''}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shrink-0 ${
                          state === 'completed' ? 'bg-primary shadow-sm' :
                          state === 'active' ? 'bg-surface-container-lowest border-2 border-primary shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08)] animate-pulse' :
                          'bg-surface-container-high border-2 border-outline-variant'
                        }`}>
                          {state === 'active' ? (
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                              </svg>
                            </div>
                          ) : (
                            <svg className={`w-5 h-5 ${state === 'completed' ? 'text-on-primary' : 'text-outline'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                            </svg>
                          )}
                        </div>
                        <div className="pt-2">
                          <h3 className={`text-body-lg font-body-lg font-bold ${state === 'active' ? 'text-primary' : 'text-on-surface'}`}>{step.label}</h3>
                          <p className="text-body-md font-body-md text-on-surface-variant mt-xs">{step.desc}</p>
                          {timestamp && (
                            <span className="text-label-sm font-label-sm text-outline mt-sm block">{timestamp}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : (
            <section className="bg-error/5 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] p-lg border border-error/20">
              <div className="flex items-center gap-sm mb-md">
                <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                <h2 className="text-headline-md font-headline-md text-error">Pesanan Dikembalikan</h2>
              </div>
              <p className="text-body-md text-on-surface-variant">Pesanan ini telah dibatalkan dan dana telah dikembalikan ke dompet Anda.</p>
              <div className="mt-md flex flex-col gap-sm">
                {order.statusHistory.map((h: any) => (
                  <div key={h.id} className="flex items-center gap-sm text-body-md">
                    <span className="text-on-surface-variant">{new Date(h.createdAt).toLocaleString('id-ID')}</span>
                    <span className="text-on-surface font-medium">— {h.status.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Item List Card */}
          <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04),0_2px_4px_-1px_rgba(0,0,0,0.02)] p-lg border border-outline-variant">
            <h2 className="text-headline-md font-headline-md text-on-surface mb-lg pb-md border-b border-surface-variant flex items-center gap-sm">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72" />
              </svg>
              {order.store.name}
            </h2>
            <div className="flex flex-col gap-md">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-md p-sm rounded-lg hover:bg-surface-container-low transition-colors group border border-transparent hover:border-outline-variant">
                  <div className="w-full sm:w-24 h-24 rounded-lg bg-surface-container shrink-0 overflow-hidden relative flex items-center justify-center">
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-on-surface-variant">Foto Produk</span>
                    )}
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-body-lg font-body-lg font-semibold text-on-surface group-hover:text-primary transition-colors">{item.product.name}</h3>
                    </div>
                    <div className="flex items-center justify-between mt-sm">
                      <div className="text-body-md font-body-md text-on-surface-variant">Qty: {item.quantity} x Rp {item.price.toLocaleString('id-ID')}</div>
                      <div className="text-body-lg font-body-lg font-bold text-on-surface">Rp {(item.quantity * item.price).toLocaleString('id-ID')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Subtotal row */}
            <div className="mt-md pt-md border-t border-surface-variant flex justify-end items-center gap-lg">
              <span className="text-body-md font-body-md text-on-surface-variant">Total Barang ({totalItems})</span>
              <span className="text-headline-md font-headline-md font-bold text-primary">Rp {order.subtotal.toLocaleString('id-ID')}</span>
            </div>
          </section>
        </div>

        {/* Sidebar: Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          {/* Shipping Info Card */}
          <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04),0_2px_4px_-1px_rgba(0,0,0,0.02)] p-lg border border-outline-variant">
            <h2 className="text-headline-md font-headline-md text-on-surface mb-md">Detail Pengiriman</h2>
            <div className="flex flex-col gap-md">
              {/* Delivery Method */}
              <div className="p-sm bg-surface-bright rounded-lg border border-surface-variant">
                <div className="text-label-sm font-label-sm text-outline uppercase tracking-wider mb-xs">Metode Pengiriman</div>
                <div className="flex items-center gap-sm">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.079-.481 1.09-1.102a48.47 48.47 0 00-.885-10.316A3.32 3.32 0 0017.598 5h-1.52" />
                  </svg>
                  <span className="text-body-md font-body-md font-semibold text-on-surface">{order.deliveryMethod}</span>
                </div>
              </div>
              {/* Store */}
              <div className="p-sm bg-surface-bright rounded-lg border border-surface-variant">
                <div className="text-label-sm font-label-sm text-outline uppercase tracking-wider mb-xs">Toko</div>
                <div className="flex items-center gap-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" />
                    </svg>
                  <span className="text-body-md font-body-md font-semibold text-on-surface">{order.store.name}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Cost Breakdown Card */}
          <section className="bg-surface-container-lowest/80 backdrop-blur-md rounded-xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08),0_4px_6px_-2px_rgba(0,0,0,0.04)] p-lg border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-md">Rincian Pembayaran</h2>
            <div className="flex flex-col gap-sm text-body-md font-body-md text-on-surface-variant">
              <div className="flex justify-between items-center">
                <span>Subtotal Produk</span>
                <span className="text-on-surface font-medium">Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Ongkos Kirim</span>
                <span className="text-on-surface font-medium">Rp {order.deliveryFee.toLocaleString('id-ID')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between items-center text-primary">
                  <span>Diskon {order.discountCode ? `(${order.discountCode})` : ''}</span>
                  <span>- Rp {order.discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>PPN (12%)</span>
                <span className="text-on-surface font-medium">Rp {order.taxAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className="mt-md pt-md border-t border-outline-variant flex justify-between items-end">
              <span className="text-body-lg font-body-lg text-on-surface font-semibold">Total Tagihan</span>
              <span className="text-headline-lg-mobile font-headline-lg-mobile text-primary">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="mt-lg pt-lg border-t border-outline-variant flex justify-between items-center">
              <span className="text-label-md font-label-md text-outline">Metode Bayar</span>
              <span className="bg-surface-container-highest px-sm py-xs rounded text-label-md font-label-md text-on-surface font-bold">SEAPAY</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
