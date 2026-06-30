'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/ToastProvider';
import Link from 'next/link';

export default function DriverActiveJobsPage() {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmModalData, setConfirmModalData] = useState<{ isOpen: boolean, jobId: string | null }>({ isOpen: false, jobId: null });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/driver/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data.activeJobs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const executeCompleteJob = async (jobId: string) => {
    setConfirmModalData({ isOpen: false, jobId: null });
    
    setProcessingId(jobId);
    try {
      const res = await fetch(`/api/driver/jobs/${jobId}/complete`, { method: 'POST' });
      if (res.ok) {
        showToast('Pengiriman selesai! Pendapatan telah ditambahkan.', 'success');
        fetchJobs();
      } else {
        const data = await res.json();
        showToast(data.error || 'Gagal menyelesaikan pengiriman', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-lg animate-fade-in max-w-[1200px] mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface">Pekerjaan Aktif</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-sm">Daftar pesanan yang sedang Anda kirim saat ini.</p>
        </div>
      </header>

      {jobs.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-md rounded-full bg-surface-container-high flex items-center justify-center">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8 text-outline">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.079-.481 1.09-1.102a48.47 48.47 0 00-.885-10.316A3.32 3.32 0 0017.598 5h-1.52a.75.75 0 00-.363.106l-1.217.73a3.37 3.37 0 01-1.737.482H7.5a3.375 3.375 0 00-3.375 3.375v4.932M8.25 18.75h-.002z" />
            </svg>
          </div>
          <p className="text-on-surface-variant mb-md">Anda tidak memiliki pekerjaan aktif saat ini.</p>
          <Link href="/dashboard/driver/jobs">
            <button className="bg-primary text-on-primary px-lg py-sm rounded-full text-label-md font-label-md hover:bg-surface-tint transition-colors shadow-sm">
              Cari Pekerjaan
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-xl">
          {jobs.map((job) => {
            const address = job.order.buyer.addresses?.find((a: any) => a.isDefault) || job.order.buyer.addresses?.[0];
            return (
              <div key={job.id} className="grid grid-cols-1 lg:grid-cols-3 gap-lg border-b border-outline-variant pb-xl last:border-b-0 last:pb-0">
                
                {/* Left Column: Tracking & Timeline */}
                <div className="lg:col-span-2 flex flex-col gap-lg">
                  {/* Job Header Info */}
                  <div className="flex justify-between items-center bg-surface-bright p-md rounded-xl border border-outline-variant">
                    <div>
                      <p className="text-label-md font-label-md text-on-surface-variant">Order #{job.order.id.substring(0, 8).toUpperCase()}</p>
                      <p className="text-body-md font-body-md font-bold mt-1 text-on-surface">Metode: {job.order.deliveryMethod}</p>
                    </div>
                    <div className="bg-secondary-container bg-opacity-20 text-secondary-container px-md py-sm rounded-full flex items-center gap-sm">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 animate-pulse">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.079-.481 1.09-1.102a48.47 48.47 0 00-.885-10.316A3.32 3.32 0 0017.598 5h-1.52a.75.75 0 00-.363.106l-1.217.73a3.37 3.37 0 01-1.737.482H7.5a3.375 3.375 0 00-3.375 3.375v4.932M8.25 18.75h-.002z" />
                      </svg>
                      <span className="font-label-md text-label-md font-bold">Sedang Dikirim</span>
                    </div>
                  </div>

                  {/* Timeline Card */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] border border-outline-variant p-lg">
                    <h2 className="text-headline-md font-headline-md mb-lg text-on-surface">Progres Pengiriman</h2>
                    <div className="relative pl-md border-l-2 border-outline-variant ml-sm space-y-lg">
                      {/* Step 1: Pickup Complete */}
                      <div className="relative">
                        <div className="absolute -left-[25px] bg-tertiary-container rounded-full p-xs">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-on-tertiary">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                        <div className="ml-md">
                          <p className="font-label-md text-label-md text-tertiary-container">Pesanan Diambil</p>
                          <p className="text-body-sm text-on-surface-variant">Dari {job.order.store.name}</p>
                        </div>
                      </div>
                      
                      {/* Step 2: In Transit (Active) */}
                      <div className="relative">
                        <div className="absolute -left-[25px] bg-primary rounded-full p-xs ring-4 ring-primary-fixed">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-on-primary animate-[spin_3s_linear_infinite]">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.079-.481 1.09-1.102a48.47 48.47 0 00-.885-10.316A3.32 3.32 0 0017.598 5h-1.52a.75.75 0 00-.363.106l-1.217.73a3.37 3.37 0 01-1.737.482H7.5a3.375 3.375 0 00-3.375 3.375v4.932M8.25 18.75h-.002z" />
                          </svg>
                        </div>
                        <div className="ml-md">
                          <p className="font-label-md text-label-md text-primary font-bold">Sedang Dikirim</p>
                          <p className="text-body-sm text-on-surface-variant">Menuju lokasi tujuan pembeli</p>
                        </div>
                      </div>

                      {/* Step 3: Pending */}
                      <div className="relative">
                        <div className="absolute -left-[25px] bg-surface-variant rounded-full p-xs border-2 border-outline">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-outline">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                        </div>
                        <div className="ml-md">
                          <p className="font-label-md text-label-md text-outline">Pesanan Selesai</p>
                          <p className="text-body-sm text-on-surface-variant">Menunggu konfirmasi kedatangan.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Details & Actions */}
                <div className="flex flex-col gap-lg">
                  {/* Details Card */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] border border-outline-variant p-lg flex flex-col gap-lg">
                    
                    {/* Pickup Details */}
                    <div>
                      <div className="flex items-center gap-sm mb-sm text-on-surface-variant">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.999 2.999 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.999 2.999 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5-.615a3.001 3.001 0 013.75-.615A2.999 2.999 0 019.75 8.75c.896 0 1.7-.393 2.25-1.016a2.999 2.999 0 012.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 013.75.614m-16.5-.615V5.25a2.25 2.25 0 012.25-2.25h9a2.25 2.25 0 012.25 2.25v4.101m-13.5 0h13.5" />
                        </svg>
                        <h3 className="font-label-md text-label-md font-bold uppercase">Detail Penjemputan</h3>
                      </div>
                      <div className="bg-surface rounded-lg p-md border border-outline-variant">
                        <p className="font-body-md text-body-md font-bold text-on-surface">{job.order.store.name}</p>
                        {/* Jika ada alamat toko, tampilkan di sini. Saat ini kita pakai dummy tulisan alamat dari DB */}
                        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Hubungi toko untuk panduan arah.</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-outline-variant"></div>
                    
                    {/* Delivery Details */}
                    <div>
                      <div className="flex items-center gap-sm mb-sm text-on-surface-variant">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <h3 className="font-label-md text-label-md font-bold uppercase">Detail Pengiriman</h3>
                      </div>
                      <div className="bg-surface rounded-lg p-md border border-outline-variant">
                        <p className="font-body-md text-body-md font-bold text-on-surface">{job.order.buyer.username}</p>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                          {address?.label ? `[${address.label}] ` : ''}
                          {address?.fullAddress || 'Alamat tidak tersedia'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Card */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] border border-outline-variant p-lg flex flex-col gap-md">
                    <div className="text-center mb-xs">
                      <p className="text-label-md text-on-surface-variant">Pendapatan:</p>
                      <h3 className="text-headline-md font-headline-md text-primary font-bold">Rp {job.earning.toLocaleString('id-ID')}</h3>
                    </div>
                    <p className="text-body-md text-on-surface-variant text-center mb-md">Pastikan barang telah diterima oleh pembeli sebelum menyelesaikan pesanan.</p>
                    
                    <button 
                      onClick={() => setConfirmModalData({ isOpen: true, jobId: job.id })}
                      disabled={processingId === job.id}
                      className="w-full bg-primary hover:bg-surface-tint text-on-primary font-label-md text-label-md py-lg rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-sm group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 group-hover:scale-110 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {processingId === job.id ? 'Memproses...' : 'Konfirmasi Selesai'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Confirm Modal */}
      {confirmModalData.isOpen && confirmModalData.jobId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg max-w-sm w-full p-lg border border-outline-variant animate-scale-in">
            <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Konfirmasi Pengiriman</h3>
            <p className="text-body-md text-on-surface-variant mb-6">
              Pastikan paket telah sampai di tangan pembeli. Apakah Anda yakin ingin menyelesaikan pengiriman ini?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmModalData({ isOpen: false, jobId: null })}
                className="px-4 py-2 rounded-lg text-label-md font-label-md font-bold hover:bg-surface-container-high transition-colors text-on-surface-variant border border-outline-variant"
              >
                Batal
              </button>
              <button 
                onClick={() => executeCompleteJob(confirmModalData.jobId!)}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-label-md font-label-md font-bold hover:bg-surface-tint transition-colors"
              >
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
