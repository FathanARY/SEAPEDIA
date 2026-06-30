'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DriverDashboardPage() {
  const [stats, setStats] = useState({ availableJobs: 0, activeJobs: 0, totalEarnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resJobs, resReport] = await Promise.all([
        fetch('/api/driver/jobs', { cache: 'no-store' }),
        fetch('/api/driver/reports', { cache: 'no-store' })
      ]);

      let available = 0;
      let active = 0;
      let earnings = 0;

      if (resJobs.ok) {
        const data = await resJobs.json();
        available = data.availableJobs?.length || 0;
        active = data.activeJobs?.length || 0;
      }
      
      if (resReport.ok) {
        const data = await resReport.json();
        earnings = data.report?.totalEarnings || 0;
      }

      setStats({ availableJobs: available, activeJobs: active, totalEarnings: earnings });
    } catch (err) {
      console.error(err);
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
    <div className="w-full flex flex-col gap-lg animate-fade-in">
      {/* Header */}
      <div className="mb-lg">
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-xs">Dashboard Pengemudi</h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant">Ringkasan pekerjaan dan pendapatan Anda hari ini.</p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
        {/* Active Job Status */}
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.079-.481 1.09-1.102a48.47 48.47 0 00-.885-10.316A3.32 3.32 0 0017.598 5h-1.52a.75.75 0 00-.363.106l-1.217.73a3.37 3.37 0 01-1.737.482H7.5a3.375 3.375 0 00-3.375 3.375v4.932M8.25 18.75h-.002z" />
            </svg>
            <span className="px-3 py-1 bg-tertiary/10 text-tertiary text-label-sm font-label-sm rounded-full font-bold">Pekerjaan Aktif</span>
          </div>
          <div>
            <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Saat ini</p>
            <p className="text-headline-md font-headline-md text-on-surface">{stats.activeJobs} Pengiriman</p>
            <div className="h-6 mt-sm"></div>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
          <div className="flex justify-between items-start mb-sm relative z-10">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
          </div>
          <div className="relative z-10">
            <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Total Pendapatan</p>
            <p className="text-headline-md font-headline-md text-on-surface">Rp {stats.totalEarnings.toLocaleString('id-ID')}</p>
            <div className="h-6 mt-sm"></div>
          </div>
        </div>

        {/* Available Jobs */}
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <div>
            <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Pekerjaan Tersedia</p>
            <p className="text-headline-md font-headline-md text-on-surface">{stats.availableJobs} Pekerjaan</p>
            <div className="h-6 mt-sm"></div>
          </div>
        </div>
      </div>

      <div className="w-full mt-lg">
        <h2 className="text-headline-md font-headline-md text-on-surface mb-md">Tindakan Cepat</h2>
        <div className="flex flex-col md:flex-row gap-md">
          
          <Link href="/dashboard/driver/active" className="flex-1 bg-surface-container-highest text-on-surface py-4 rounded-xl text-headline-md flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors shadow-sm border border-outline-variant">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.079-.481 1.09-1.102a48.47 48.47 0 00-.885-10.316A3.32 3.32 0 0017.598 5h-1.52a.75.75 0 00-.363.106l-1.217.73a3.37 3.37 0 01-1.737.482H7.5a3.375 3.375 0 00-3.375 3.375v4.932M8.25 18.75h-.002z" />
            </svg>
            Pekerjaan Aktif
          </Link>

          <Link href="/dashboard/driver/reports" className="flex-1 bg-primary text-on-primary py-4 rounded-xl text-headline-md flex items-center justify-center gap-2 hover:bg-primary-fixed-variant transition-colors shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Lihat Laporan
          </Link>

          <Link href="/dashboard/driver/jobs" className="flex-1 bg-secondary text-on-secondary py-4 rounded-xl text-headline-md flex items-center justify-center gap-2 hover:bg-secondary-container transition-colors shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Cari Pekerjaan
          </Link>
        </div>
      </div>
    </div>
  );
}
