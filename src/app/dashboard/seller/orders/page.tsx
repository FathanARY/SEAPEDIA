'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';

export default function SellerOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOrder, setCancelModalOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/seller/orders');
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

  const handleProcessOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/seller/orders/${orderId}/process`, {
        method: 'POST'
      });
      if (res.ok) {
        showToast('Pesanan berhasil diproses!', 'success');
        fetchOrders();
      } else {
        const data = await res.json();
        showToast(data.error || 'Gagal memproses pesanan', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan', 'error');
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelModalOrder) return;
    try {
      const res = await fetch(`/api/seller/orders/${cancelModalOrder}/cancel`, {
        method: 'POST'
      });
      if (res.ok) {
        showToast('Pesanan berhasil dibatalkan!', 'success');
        fetchOrders();
      } else {
        const data = await res.json();
        showToast(data.error || 'Gagal membatalkan pesanan', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan', 'error');
    } finally {
      setCancelModalOrder(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full animate-fade-in pb-xl">
      {/* Header */}
      <div className="mb-lg flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-xs">Pesanan Masuk</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Kelola dan proses pesanan baru dari pembeli Anda.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-outline-variant mb-lg flex overflow-x-auto no-scrollbar">
        <button className="px-md py-3 text-label-md font-label-md text-primary border-b-2 border-primary whitespace-nowrap">
          Semua Pesanan ({orders.length})
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-xl bg-surface-container-lowest rounded-xl border border-surface-variant shadow-[0_4px_4px_rgba(0,0,0,0.04)] mt-lg text-center h-64">
          <svg className="w-12 h-12 text-outline-variant mb-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-headline-md font-headline-md text-on-surface mb-xs">Belum ada pesanan</h3>
          <p className="text-body-md font-body-md text-on-surface-variant mb-md max-w-md">Saat ini belum ada pesanan masuk untuk toko Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-md">
          {orders.map((order) => {
            const isSedangDikemas = order.status === 'SEDANG_DIKEMAS';
            const isExpress = order.deliveryMethod === 'EXPRESS';
            return (
              <div 
                key={order.id} 
                className={`bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow relative overflow-hidden group ${
                  isExpress ? 'border-2 border-secondary/20' : 'border border-outline-variant'
                }`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform ${isExpress ? 'bg-secondary' : 'bg-primary-container'}`}></div>
                
                {isExpress && (
                  <div className="absolute top-0 right-0 bg-secondary text-on-secondary px-3 py-1 rounded-bl-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <svg className="w-[12px] h-[12px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Express
                  </div>
                )}
                
                <div className={`flex justify-between items-start mb-md ${isExpress ? 'mt-2' : ''}`}>
                  <div>
                    <div className="flex items-center gap-sm mb-xs">
                      <span className="text-label-md font-label-md text-on-surface font-bold font-mono text-sm">#{order.id.slice(0,8).toUpperCase()}</span>
                      <span className={`px-2 py-0.5 font-label-md text-[10px] rounded-full uppercase tracking-wider ${
                        isSedangDikemas ? 'bg-tertiary-container/10 text-tertiary' : 'bg-surface-variant text-on-surface-variant'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className={`text-body-md font-body-md text-sm ${isExpress ? 'text-error font-medium' : 'text-on-surface-variant'}`}>
                      {new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      {isExpress && ' (Priority)'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-headline-md font-headline-md text-primary font-bold">Rp {order.subtotal.toLocaleString('id-ID')}</p>
                    <p className="text-body-md font-body-md text-on-surface-variant text-sm capitalize">{order.deliveryMethod.replace(/_/g, ' ').toLowerCase()}</p>
                  </div>
                </div>

                <div className="border-t border-b border-surface-variant py-md mb-md flex flex-col gap-sm">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-md items-center">
                      <div className="w-16 h-16 rounded-lg bg-surface-container-high border border-outline-variant flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {item.product?.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-8 h-8 text-outline-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-body-md font-body-md font-semibold text-on-surface">{item.product.name}</h3>
                        <p className="text-body-md font-body-md text-on-surface-variant text-sm">Qty: {item.quantity} • Rp {item.price.toLocaleString('id-ID')}/item</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
                  <div className="flex items-center gap-sm">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold text-label-md">
                      {order.buyer.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-label-md font-label-md text-on-surface">{order.buyer.username}</p>
                      <p className="text-body-md font-body-md text-on-surface-variant text-[12px] flex items-center gap-1">
                        Pembeli
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-sm w-full sm:w-auto">
                    {isSedangDikemas ? (
                      <>
                        <button 
                          onClick={() => setCancelModalOrder(order.id)}
                          className="flex-1 sm:flex-none px-6 py-2 text-label-md font-label-md text-error border border-error rounded hover:bg-error/10 transition-colors text-center flex items-center justify-center gap-1"
                        >
                          Batalkan
                        </button>
                        <button 
                          onClick={() => handleProcessOrder(order.id)}
                          className={`flex-1 sm:flex-none px-6 py-2 text-label-md font-label-md text-on-primary rounded shadow-sm transition-colors text-center flex items-center justify-center gap-1 ${
                            isExpress ? 'bg-secondary hover:bg-secondary/90' : 'bg-primary hover:bg-primary/90'
                          }`}
                        >
                          Proses Pesanan
                        </button>
                      </>
                    ) : (
                      <span className="px-4 py-2 text-label-md font-label-md text-on-surface-variant border border-outline-variant bg-surface rounded text-center">
                        Sudah Diproses
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6">
            <div className="flex items-center gap-3 mb-4 text-error">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface">Batalkan Pesanan</h3>
            </div>
            <p className="text-body-md font-body-md text-on-surface-variant mb-6 leading-relaxed">
              Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat diurungkan. Stok produk akan dikembalikan dan saldo pembeli akan direfund otomatis.
            </p>
            <div className="flex gap-sm justify-end">
              <button 
                onClick={() => setCancelModalOrder(null)}
                className="px-6 py-2 text-label-md font-label-md text-on-surface-variant border border-outline-variant rounded hover:bg-surface-container-high transition-colors"
              >
                Kembali
              </button>
              <button 
                onClick={handleCancelOrder}
                className="px-6 py-2 text-label-md font-label-md text-on-error bg-error rounded hover:bg-error/90 transition-colors"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
