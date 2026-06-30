'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/ToastProvider';

interface OrderHistory {
  id: string;
  buyer: string;
  store: string;
  totalAmount: number;
  deliveryMethod: string;
  timestamp: string;
}

interface ProcessedOrder {
  id: string;
  buyer: string;
  totalAmount: number;
  previousStatus: string;
  reason: string;
}

export default function SLAMonitoringPage() {
  const { showToast } = useToast();
  const [simulateDays, setSimulateDays] = useState(1);
  const [triggering, setTriggering] = useState(false);
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [recentProcessed, setRecentProcessed] = useState<ProcessedOrder[] | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/admin/overdue/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleTriggerOverdue = async () => {
    if (!confirm(`Simulasi ${simulateDays} hari ke depan dan batalkan pesanan yang lewat batas SLA?`)) return;
    
    setTriggering(true);
    setRecentProcessed(null);
    try {
      const res = await fetch('/api/admin/overdue/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulateDays })
      });
      
      const data = await res.json();
      if (res.ok) {
        showToast(`Berhasil memproses! ${data.refundedCount} pesanan telah dibatalkan/direfund.`, 'success');
        setRecentProcessed(data.processedOrders || []);
        fetchHistory(); // Refresh history
      } else {
        showToast(data.error || 'Terjadi kesalahan', 'error');
      }
    } catch (err) {
      showToast('Gagal menghubungi server', 'error');
    } finally {
      setTriggering(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-surface-variant gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-2">
            <Link href="/dashboard/admin" className="hover:text-primary transition-colors">Admin Dashboard</Link>
            <span>/</span>
            <span className="font-medium text-on-surface">SLA Monitoring</span>
          </div>
          <h1 className="text-3xl font-bold text-on-surface">Monitoring Overdue & Simulasi</h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            Pantau pesanan yang melanggar SLA dan simulasikan auto-refund / auto-return.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Rules & Simulation */}
        <div className="lg:col-span-1 space-y-6">
          {/* SLA Rules Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tertiary"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 
              Aturan SLA Sistem
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Batas Waktu Pengemasan</span>
                <span className="font-bold text-on-surface">1 Hari</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Pengiriman Instant</span>
                <span className="font-bold text-on-surface">1 Hari</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Pengiriman Next Day</span>
                <span className="font-bold text-on-surface">2 Hari</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Pengiriman Reguler</span>
                <span className="font-bold text-on-surface">5 Hari</span>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mt-4 leading-relaxed bg-surface-container p-3 rounded-lg">
              Jika pesanan melewati batas SLA, sistem akan otomatis mengubah status menjadi <strong>DIKEMBALIKAN</strong>, mengembalikan dana (refund) ke wallet pembeli, dan mengembalikan stok produk.
            </p>
          </div>

          {/* Simulation Tool */}
          <div className="bg-error-container/20 border border-error-container rounded-xl shadow-sm p-5 flex flex-col gap-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-error">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 19 22 12 13 5 13 19"/><polygon points="2 19 11 12 2 5 2 19"/></svg> 
              Simulasi Auto-Refund
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Maju ke depan (time travel) untuk memicu pembatalan otomatis pesanan yang melewati batas SLA.
            </p>
            
            <div className="flex flex-col gap-4 mt-2">
              <div>
                <label className="block text-xs font-bold text-error mb-2 uppercase tracking-wider">Simulasi Hari Berlalu</label>
                <input 
                  type="number" 
                  min={1} 
                  value={simulateDays}
                  onChange={(e) => setSimulateDays(parseInt(e.target.value) || 1)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-error/20 focus:border-error transition-all"
                />
              </div>
              <button 
                onClick={handleTriggerOverdue} 
                disabled={triggering}
                className="w-full border border-error text-error py-3 rounded-lg font-bold hover:bg-error hover:text-on-error transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {triggering ? 'Memproses...' : 'Jalankan SLA Check'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Results & History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Execution Results (Shows only after triggering) */}
          {recentProcessed !== null && (
            <div className="bg-surface-container-lowest border border-primary/30 rounded-xl shadow-sm overflow-hidden animate-fade-in">
              <div className="p-4 bg-primary-fixed/30 border-b border-primary/20 flex justify-between items-center">
                <h2 className="font-bold text-on-surface flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Hasil Eksekusi Simulasi
                </h2>
                <span className="text-sm font-bold text-primary">{recentProcessed.length} Pesanan Diproses</span>
              </div>
              <div className="p-4">
                {recentProcessed.length === 0 ? (
                  <p className="text-sm text-on-surface-variant italic text-center py-4">Tidak ada pesanan yang melanggar SLA dalam rentang waktu yang disimulasikan.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-surface-container text-on-surface-variant">
                        <tr>
                          <th className="px-4 py-3 rounded-tl-lg">ID Pesanan</th>
                          <th className="px-4 py-3">Pembeli</th>
                          <th className="px-4 py-3">Status Awal</th>
                          <th className="px-4 py-3">Alasan (SLA)</th>
                          <th className="px-4 py-3 rounded-tr-lg">Refund</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentProcessed.map((order) => (
                          <tr key={order.id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest">
                            <td className="px-4 py-3 font-mono text-xs">{order.id.slice(-8)}</td>
                            <td className="px-4 py-3 font-medium">{order.buyer}</td>
                            <td className="px-4 py-3"><span className="px-2 py-1 bg-surface-container rounded-md text-xs">{order.previousStatus}</span></td>
                            <td className="px-4 py-3 text-error text-xs font-medium">{order.reason}</td>
                            <td className="px-4 py-3 font-bold text-primary">{formatCurrency(order.totalAmount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History Data Table */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center bg-surface-bright">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg> 
                Riwayat Auto-Refund & Overdue
              </h2>
              <button onClick={fetchHistory} disabled={loadingHistory} className="text-primary hover:bg-primary-fixed p-2 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loadingHistory ? "animate-spin" : ""}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-0">
              {loadingHistory ? (
                <div className="flex justify-center items-center h-full text-on-surface-variant">Memuat data riwayat...</div>
              ) : history.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-on-surface-variant p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
                  <p>Belum ada riwayat pesanan yang dibatalkan otomatis.</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-surface-container sticky top-0 text-on-surface-variant z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-4">ID Pesanan</th>
                      <th className="px-6 py-4">Pembeli / Toko</th>
                      <th className="px-6 py-4">Waktu Batal</th>
                      <th className="px-6 py-4">Layanan</th>
                      <th className="px-6 py-4">Total Refund</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-medium text-on-surface-variant">
                          {item.id.slice(-8)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-on-surface">{item.buyer}</div>
                          <div className="text-xs text-on-surface-variant mt-1">{item.store}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium">{new Date(item.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                          <div className="text-xs text-on-surface-variant">{new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-surface-container rounded-md text-xs font-medium text-on-surface-variant">{item.deliveryMethod}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-error">
                          {formatCurrency(item.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
