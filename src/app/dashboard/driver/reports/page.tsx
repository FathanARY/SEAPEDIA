'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/ToastProvider';

export default function DriverReportsPage() {
  const { showToast } = useToast();
  const [report, setReport] = useState<{ totalEarnings: number, totalCompletedJobs: number, jobs: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await fetch('/api/driver/reports');
      if (res.ok) {
        const data = await res.json();
        setReport(data.report);
      } else {
        const errData = await res.json();
        showToast(errData.error || 'Gagal memuat laporan', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-lg animate-fade-in max-w-[1200px] mx-auto pb-xl">
      {/* Header Section */}
      <div className="mb-md md:mb-lg">
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-xs">
          Laporan Pendapatan
        </h1>
        <p className="text-body-md md:text-body-lg font-body-md md:font-body-lg text-on-surface-variant">
          Pantau riwayat pengiriman selesai dan total pendapatan Anda.
        </p>
      </div>

      {/* Metrics Summary Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-lg">
        <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] border border-outline-variant flex flex-col gap-sm">
          <div className="flex items-center gap-sm text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
            <h2 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Total Pendapatan</h2>
          </div>
          <p className="text-headline-md md:text-headline-lg font-headline-md md:font-headline-lg text-on-surface">
            Rp {report?.totalEarnings?.toLocaleString('id-ID') || 0}
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] border border-outline-variant flex flex-col gap-sm">
          <div className="flex items-center gap-sm text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Total Pekerjaan Selesai</h2>
          </div>
          <p className="text-headline-md md:text-headline-lg font-headline-md md:font-headline-lg text-on-surface">
            {report?.totalCompletedJobs || 0}
          </p>
        </div>
      </div>

      {/* Detailed List Section */}
      <div>
        <h3 className="text-headline-md font-headline-md text-on-surface mb-md">Riwayat Pekerjaan Selesai</h3>
        
        {(!report?.jobs || report.jobs.length === 0) ? (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-md rounded-full bg-surface-container-high flex items-center justify-center text-outline">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-on-surface-variant">Belum ada riwayat pekerjaan selesai.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-md">
            {report.jobs.map((job) => (
              <div key={job.id} className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] border border-outline-variant hover:shadow-md transition-shadow">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-md">
                  
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-body-lg font-body-lg font-semibold text-on-surface">Order #{job.orderId.substring(0, 8).toUpperCase()}</h4>
                      <div className="flex items-center gap-sm text-on-surface-variant text-label-sm font-label-sm mt-xs">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Selesai pada: {new Date(job.updatedAt).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })} WIB</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-xs w-full md:w-auto">
                    <span className="inline-flex items-center px-sm py-xs rounded-full bg-tertiary/10 text-tertiary text-label-sm font-label-sm font-bold">
                      Selesai
                    </span>
                    <span className="text-body-md font-body-md font-bold text-on-surface">Pendapatan: Rp {job.earning.toLocaleString('id-ID')}</span>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
