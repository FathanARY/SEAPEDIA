'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function MasukPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login gagal');
        return;
      }

      // Redirect based on role status
      if (data.user.activeRole) {
        const rolePaths: Record<string, string> = {
          BUYER: '/dashboard/buyer',
          SELLER: '/dashboard/seller',
          DRIVER: '/dashboard/driver',
          ADMIN: '/dashboard/admin',
        };
        router.push(rolePaths[data.user.activeRole] || '/');
      } else {
        // Multiple roles — needs selection
        router.push('/pilih-peran');
      }
      router.refresh();
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-background text-on-background antialiased overflow-hidden">
      {/* Left Split: Visual / Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-inverse-surface items-center justify-center p-12 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-inverse-surface to-[#1a1d1f]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">SEAPEDIA</h1>
          <p className="text-xl font-semibold text-outline-variant mb-8">Platform e-commerce yang menghubungkan penjual, pembeli, dan pengirim.</p>
          
          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest/10 backdrop-blur-md p-5 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-3 group hover:bg-surface-container-lowest/20 hover:border-primary/50 transition-all cursor-default">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-primary-fixed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wider text-white mb-1">KEMUDAHAN BERBELANJA</h3>
                <p className="text-sm text-outline-variant">Jelajahi berbagai produk dari penjual terpercaya.</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest/10 backdrop-blur-md p-5 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-3 group hover:bg-surface-container-lowest/20 hover:border-secondary/50 transition-all cursor-default">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-secondary-fixed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wider text-white mb-1">TRANSAKSI AMAN</h3>
                <p className="text-sm text-outline-variant">Sistem pembayaran yang aman dan transparan.</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest/10 backdrop-blur-md p-5 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-3 group hover:bg-surface-container-lowest/20 hover:border-tertiary/50 transition-all cursor-default">
              <div className="w-12 h-12 rounded-xl bg-tertiary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-tertiary-fixed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wider text-white mb-1">MULTI PERAN</h3>
                <p className="text-sm text-outline-variant">Satu platform untuk pembeli, penjual, dan pengirim.</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest/10 backdrop-blur-md p-5 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-3 group hover:bg-surface-container-lowest/20 hover:border-inverse-primary/50 transition-all cursor-default">
              <div className="w-12 h-12 rounded-xl bg-inverse-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-inverse-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wider text-white mb-1">PENGIRIMAN TERINTEGRASI</h3>
                <p className="text-sm text-outline-variant">Lacak status pesanan Anda secara real-time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Split: Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-surface-container-lowest relative overflow-y-auto">
        {/* Mobile Logo */}
        <div className="absolute top-6 left-6 lg:hidden">
          <h1 className="text-2xl font-bold text-primary">SEAPEDIA</h1>
        </div>
        
        <div className="w-full max-w-md relative">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-on-surface mb-2">Selamat Datang Kembali</h2>
            <p className="text-base text-on-surface-variant">Silakan masukkan detail Anda untuk masuk.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold tracking-wider text-on-surface mb-1 uppercase" htmlFor="login-username">Username</label>
              <input 
                id="login-username"
                className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm" 
                placeholder="Masukkan username" 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold tracking-wider text-on-surface uppercase" htmlFor="login-password">Password</label>
              </div>
              <div className="relative">
                <input 
                  id="login-password"
                  className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {error && (
              <p className="text-sm text-error bg-error-container/20 px-4 py-2 rounded-lg">{error}</p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold text-sm tracking-wider py-3 rounded-lg shadow-sm transition-colors mt-6 uppercase"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-on-surface-variant">
            Belum punya akun? 
            <Link href="/daftar" className="text-sm font-bold tracking-wider text-primary hover:underline ml-2">Daftar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
