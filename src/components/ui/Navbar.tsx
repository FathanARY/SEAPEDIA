'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface UserData {
  username: string;
  roles: string[];
  activeRole: string | null;
}

const roleLabels: Record<string, string> = {
  BUYER: 'Pembeli',
  SELLER: 'Penjual',
  DRIVER: 'Pengirim',
  ADMIN: 'Admin',
};

const roleDashboardPaths: Record<string, string> = {
  BUYER: '/dashboard/buyer',
  SELLER: '/dashboard/seller',
  DRIVER: '/dashboard/driver',
  ADMIN: '/dashboard/admin',
};

export default function Navbar() {
  const [user, setUser] = useState<UserData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  async function fetchUser() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  }

  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center group-hover:bg-neutral-700 transition-colors">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-lg text-neutral-900 tracking-tight">SEAPEDIA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                pathname === '/' ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/produk"
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                pathname.startsWith('/produk') ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Produk
            </Link>

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3 ml-4">
                    {user.activeRole && (
                      <Link
                        href={roleDashboardPaths[user.activeRole] || '/dashboard'}
                        className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                          isDashboard ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                        }`}
                      >
                        Dashboard
                      </Link>
                    )}

                    <div className="h-5 w-px bg-neutral-200" />

                    {/* Role badge */}
                    {user.activeRole && (
                      <span className="px-3 py-1 text-xs font-medium bg-neutral-900 text-white rounded-full">
                        {roleLabels[user.activeRole]}
                      </span>
                    )}

                    <div className="relative group">
                      <button className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors">
                        <div className="w-7 h-7 bg-neutral-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-neutral-600">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{user.username}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <div className="absolute right-0 mt-1 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
                        {user.roles.length > 1 && (
                          <Link
                            href="/pilih-peran"
                            className="block px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                          >
                            Ganti Peran
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                        >
                          Keluar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href="/masuk"
                      className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      Masuk
                    </Link>
                    <Link
                      href="/daftar"
                      className="px-5 py-2 text-sm font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      Daftar
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link href="/" className="block px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg" onClick={() => setMenuOpen(false)}>
              Beranda
            </Link>
            <Link href="/produk" className="block px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg" onClick={() => setMenuOpen(false)}>
              Produk
            </Link>

            {user ? (
              <>
                {user.activeRole && (
                  <>
                    <div className="px-4 py-2">
                      <span className="px-3 py-1 text-xs font-medium bg-neutral-900 text-white rounded-full">
                        {roleLabels[user.activeRole]}
                      </span>
                    </div>
                    <Link
                      href={roleDashboardPaths[user.activeRole] || '/dashboard'}
                      className="block px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </>
                )}
                {user.roles.length > 1 && (
                  <Link href="/pilih-peran" className="block px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                    Ganti Peran
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link href="/masuk" className="block px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                  Masuk
                </Link>
                <Link href="/daftar" className="block px-4 py-2.5 text-sm font-medium bg-neutral-900 text-white rounded-lg text-center" onClick={() => setMenuOpen(false)}>
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
