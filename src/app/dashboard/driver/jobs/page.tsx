'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';

export default function DriverAvailableJobsPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/driver/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data.availableJobs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeJob = async (jobId: string) => {
    setProcessingId(jobId);
    try {
      const res = await fetch(`/api/driver/jobs/${jobId}/take`, { method: 'POST' });
      if (res.ok) {
        showToast('Pekerjaan berhasil diambil!', 'success');
        router.push('/dashboard/driver/active');
      } else {
        const data = await res.json();
        showToast(data.error || 'Gagal mengambil pekerjaan', 'error');
        fetchJobs(); // Refresh in case it was taken by someone else
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-md">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface flex items-center gap-sm">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Bursa Kerja
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">Daftar pesanan yang siap untuk dikirimkan ke pembeli.</p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] p-12 text-center mt-md">
          <div className="w-16 h-16 mx-auto mb-md rounded-full bg-surface-container-high flex items-center justify-center">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8 text-outline">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607M10.5 7.5v6m3-3h-6" />
            </svg>
          </div>
          <p className="text-on-surface-variant mb-md">Belum ada pesanan yang siap dikirim saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md md:gap-lg mt-md">
          {jobs.map((job) => {
            const address = job.order.buyer.addresses?.find((a: any) => a.isDefault) || job.order.buyer.addresses?.[0];
            const isExpress = job.order.deliveryMethod?.toLowerCase().includes('express');
            const itemCount = job.order.items?.length || 0;
            
            return (
              <div key={job.id} className="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] border border-outline-variant overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
                <div className="p-md flex flex-col gap-md flex-1">
                  
                  {/* Card Header (Type & Price) */}
                  <div className="flex justify-between items-start">
                    {isExpress ? (
                      <div className="bg-secondary-container/20 text-secondary-container px-2 py-1 rounded text-label-sm font-label-sm font-bold flex items-center gap-1">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Express
                      </div>
                    ) : (
                      <div className="bg-surface-container text-on-surface-variant px-2 py-1 rounded text-label-sm font-label-sm font-bold flex items-center gap-1">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Standard
                      </div>
                    )}
                    <span className="text-headline-md font-headline-md text-primary font-bold">Rp {job.earning.toLocaleString('id-ID')}</span>
                  </div>

                  {/* Route Timeline */}
                  <div className="flex flex-col gap-sm relative mt-xs">
                    {/* Connecting Line */}
                    <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-outline-variant/50 border-l border-dashed border-outline-variant"></div>
                    
                    {/* Pickup Point */}
                    <div className="flex gap-sm items-start">
                      <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center z-10 border-2 border-surface-container-lowest">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5 text-tertiary">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.999 2.999 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.999 2.999 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5-.615a3.001 3.001 0 013.75-.615A2.999 2.999 0 019.75 8.75c.896 0 1.7-.393 2.25-1.016a2.999 2.999 0 012.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 013.75.614m-16.5-.615V5.25a2.25 2.25 0 012.25-2.25h9a2.25 2.25 0 012.25 2.25v4.101m-13.5 0h13.5" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Pickup</p>
                        <p className="text-body-md font-body-md font-semibold text-on-surface">{job.order.store.name}</p>
                      </div>
                    </div>

                    {/* Dropoff Point */}
                    <div className="flex gap-sm items-start">
                      <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center z-10 border-2 border-surface-container-lowest">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5 text-secondary">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Dropoff</p>
                        <p className="text-body-md font-body-md font-semibold text-on-surface">{job.order.buyer.username}</p>
                        <p className="text-label-sm font-label-sm text-outline">
                          {address?.label ? `[${address.label}] ` : ''}
                          {address?.fullAddress || 'Alamat tidak tersedia'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details Footer */}
                  <div className="flex justify-between items-center mt-auto pt-sm border-t border-outline-variant">
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span className="text-label-md font-label-md">{itemCount} items</span>
                    </div>
                  </div>
                </div>

                {/* Take Job Button */}
                <button 
                  onClick={() => handleTakeJob(job.id)}
                  disabled={processingId === job.id}
                  className="w-full py-3 bg-secondary text-on-secondary font-label-md text-label-md font-bold hover:bg-secondary-container transition-colors flex justify-center items-center gap-sm group-hover:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingId === job.id ? 'Memproses...' : 'Ambil Job'}
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
