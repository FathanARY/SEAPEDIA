'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/admin/monitoring');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Memuat data monitoring...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-surface-variant gap-4">
        <h1 className="text-3xl font-bold text-on-surface">Admin Control Center</h1>
      </header>

      {/* System Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 mb-8">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Pengguna</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary bg-primary-fixed p-1 rounded-md"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <span className="text-2xl font-bold text-on-surface mt-1">{metrics?.users || 0}</span>
        </div>
        
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Toko</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary bg-secondary-fixed p-1 rounded-md"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
          </div>
          <span className="text-2xl font-bold text-on-surface mt-1">{metrics?.stores || 0}</span>
        </div>
        
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Pesanan</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tertiary bg-tertiary-fixed p-1 rounded-md"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17V7"/></svg>
          </div>
          <span className="text-2xl font-bold text-on-surface mt-1">{metrics?.orders || 0}</span>
        </div>
        
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Tugas Kurir</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary bg-primary-fixed p-1 rounded-md"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
          </div>
          <span className="text-2xl font-bold text-on-surface mt-1">{metrics?.deliveryJobs || 0}</span>
        </div>

        {/* Secondary Stats */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Produk</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-outline bg-surface-container p-1 rounded-md"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </div>
          <span className="text-2xl font-bold text-on-surface mt-1">{metrics?.products || 0}</span>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Voucher Aktif</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-outline bg-surface-container p-1 rounded-md"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
          </div>
          <span className="text-2xl font-bold text-on-surface mt-1">{metrics?.vouchers || 0}</span>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Promo Aktif</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-outline bg-surface-container p-1 rounded-md"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
          </div>
          <span className="text-2xl font-bold text-on-surface mt-1">{metrics?.promos || 0}</span>
        </div>
      </section>

      <div className="space-y-6">
        {/* Global Order Monitoring */}
        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center bg-surface-bright">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg> Global Order Monitoring
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="text-on-surface font-medium text-sm">Sedang Dikemas (Seller)</span>
                </div>
                <span className="font-bold text-lg">{metrics?.orderStatusCounts?.['SEDANG_DIKEMAS'] || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                  <span className="text-on-surface font-medium text-sm">Menunggu Pengirim (Kurir)</span>
                </div>
                <span className="font-bold text-lg">{metrics?.orderStatusCounts?.['MENUNGGU_PENGIRIM'] || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="text-on-surface font-medium text-sm">Sedang Dikirim</span>
                </div>
                <span className="font-bold text-lg">{metrics?.orderStatusCounts?.['SEDANG_DIKIRIM'] || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <span className="text-on-surface font-medium text-sm">Pesanan Selesai</span>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-tertiary-fixed text-tertiary-fixed-variant">
                  {metrics?.orderStatusCounts?.['PESANAN_SELESAI'] || 0} Selesai
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 hover:bg-surface-container-lowest transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  <span className="text-on-surface font-medium text-sm">Dikembalikan (Refund/Batal)</span>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-error-container text-error">
                  {metrics?.orderStatusCounts?.['DIKEMBALIKAN'] || 0} Batal
                </span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
