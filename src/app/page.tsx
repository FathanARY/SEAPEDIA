'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchReviews();
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchReviews() {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Gagal mengambil ulasan:', err);
    } finally {
      setLoadingReviews(false);
    }
  }

  async function handleReviewSubmit(review: { name: string; rating: number; comment: string }) {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });

    if (!res.ok) {
      throw new Error('Gagal mengirim ulasan');
    }

    await fetchReviews();
  }

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
      title: 'Marketplace Terpercaya',
      description: 'Bergabung dengan ribuan penjual dan pembeli dalam ekosistem perdagangan yang aman dan transparan.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      title: 'Multi-Peran',
      description: 'Satu akun untuk berbagai peran. Pilih peran sesuai kebutuhan Anda.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      title: 'Pengiriman Terintegrasi',
      description: 'Sistem pengiriman dengan berbagai metode langsung dari platform.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: 'Transaksi Aman',
      description: 'Sistem dompet digital, perhitungan PPN transparan, dan status pesanan yang dapat dilacak secara real-time.',
    },
  ];

  return (
    <div className="bg-background">
      {/* Hero — Bento Grid Style */}
      <section className="px-margin-mobile sm:px-6 lg:px-margin-desktop mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[500px] animate-fade-in">
          {/* Main Banner */}
          <div className="col-span-1 md:col-span-3 md:row-span-2 rounded-xl overflow-hidden relative shadow-sm group bg-inverse-surface">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-inverse-surface to-[#1a1d1f]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
            <div className="relative h-full flex flex-col justify-center p-8 md:p-12 lg:p-16">
              <span className="inline-flex items-center gap-2 px-3 py-1 text-inverse-primary text-label-md font-semibold rounded-md w-max mb-5">
                Platform Marketplace Masa Depan
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-display-lg font-extrabold text-white tracking-tight mb-5 leading-[1.1] max-w-lg">
                Jual, Beli, dan Kirim
                <br />
                <span className="text-inverse-primary">dalam Satu Platform.</span>
              </h1>
              <p className="text-body-lg text-outline-variant mb-8 max-w-md leading-relaxed">
                SEAPEDIA menghubungkan penjual, pembeli, dan pengirim dalam satu ekosistem perdagangan digital yang terintegrasi.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/daftar">
                  <button className="px-7 py-3 text-base font-semibold rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-colors shadow-sm">
                    Mulai Sekarang
                  </button>
                </Link>
                <Link href="/produk">
                  <button className="px-7 py-3 text-base font-medium rounded-lg border border-outline text-inverse-on-surface hover:border-inverse-primary hover:text-inverse-primary bg-transparent transition-all duration-200">
                    Jelajahi Produk
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Promo Card 1 — Multi-Peran */}
          <div className="col-span-1 rounded-xl bg-surface-container-lowest border border-surface-container-highest p-md flex flex-col justify-between shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <span className="inline-block px-2.5 py-1 rounded-md bg-red-600 text-on-primary text-label-sm font-semibold tracking-wide mb-3">
                PROMO !
              </span>
              <h3 className="text-headline-md font-semibold text-on-surface mb-1">DISKON HINGGA 10%</h3>
              <p className="text-body-md text-on-surface-variant">Gunakan Kode Voucher "<span className='font-semibold'>COMPFEST</span>"</p>
            </div>
            <div className="flex justify-between items-end relative z-10 mt-4">
              <div className="flex -space-x-2">
                
              </div>
              <Link href="/masuk">
                 <svg className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              </Link>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
          </div>

          {/* Promo Card 2 — Pengiriman */}
          <div className="col-span-1 rounded-xl bg-tertiary/10 border border-tertiary/20 p-md flex flex-col justify-between shadow-sm relative overflow-hidden ">
            <div>
              <h3 className="text-headline-md font-semibold text-tertiary mb-1">Pengiriman Cepat</h3>
              <p className="text-body-md text-tertiary/80">Instant, Next Day, dan Regular langsung dari platform.</p>
            </div>
            <Link href="/produk">
              <button className="mt-4 w-full bg-surface-container-lowest text-tertiary py-2.5 rounded-lg border border-tertiary/30 hover:bg-tertiary/5 transition-colors text-label-md font-semibold">
                Jelajahi Produk
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-margin-mobile sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-headline-lg text-on-surface mb-3">
            Mengapa SEAPEDIA?
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Platform marketplace lengkap untuk semua kebutuhan perdagangan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger">
          {features.map((feature, i) => (
            <Card key={i} className="text-center group" hoverable>
              <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center mx-auto mb-4 text-on-surface-variant group-hover:bg-primary-container group-hover:text-on-primary transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-on-surface mb-2">{feature.title}</h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-inverse-surface text-inverse-on-surface py-20">
        <div className="max-w-7xl mx-auto px-margin-mobile sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-headline-lg mb-3">
              Bagaimana SEAPEDIA Bekerja?
            </h2>
            <p className="text-outline max-w-xl mx-auto">
              Tiga langkah sederhana untuk memulai perjalanan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Daftar & Pilih Peran', desc: 'Buat akun dan pilih peran Anda — sebagai pembeli, penjual, atau pengirim.' },
              { step: '02', title: 'Mulai Bertransaksi', desc: 'Jelajahi produk, kelola toko, atau ambil pekerjaan pengiriman sesuai peran Anda.' },
              { step: '03', title: 'Nikmati Kemudahan', desc: 'Sistem yang terintegrasi memastikan setiap transaksi berjalan aman dan transparan.' },
            ].map((item, i) => (
              <div key={i} className="text-center md:text-left group">
                <span className="text-5xl font-extrabold text-inverse-primary/30 mb-4 block group-hover:text-inverse-primary/60 transition-colors duration-300">{item.step}</span>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-body-md text-outline leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-margin-mobile sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-headline-lg text-on-surface mb-3">
            Ulasan Pengguna
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Pendapat pengguna tentang pengalaman menggunakan SEAPEDIA.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {/* Review List */}
          <div>
            {loadingReviews ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-surface-container-high border-t-primary rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              <ReviewList reviews={reviews} />
            )}
          </div>

          {/* Review Form */}
          {isLoggedIn && (
            <div>
              <Card>
                <h3 className="font-semibold text-on-surface mb-4">Tulis Ulasan</h3>
                <ReviewForm onSubmit={handleReviewSubmit} />
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-margin-mobile sm:px-6 pb-20">
        <div className="bg-inverse-surface rounded-xl p-8 md:p-12 text-center text-inverse-on-surface relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          <div className="relative z-10">
            <h2 className="text-headline-lg mb-3">
              Siap Bergabung dengan SEAPEDIA?
            </h2>
            <p className="text-outline mb-6 max-w-lg mx-auto">
              Daftar sekarang dan mulai perjalanan Anda sebagai pembeli, penjual, atau pengirim.
            </p>
            <Link href="/daftar">
              <button className="px-7 py-3 text-base font-semibold rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-colors shadow-sm">
                Daftar Gratis
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
