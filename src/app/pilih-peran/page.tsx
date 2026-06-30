'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const roleConfig: Record<string, { label: string; description: string; path: string; icon: string; theme: string }> = {
  BUYER: {
    label: 'Pembeli',
    description: 'Jelajahi produk, kelola keranjang, dan lakukan checkout.',
    path: '/dashboard/buyer',
    icon: 'shopping_bag',
    theme: 'tertiary',
  },
  SELLER: {
    label: 'Penjual',
    description: 'Kelola toko, produk, dan pesanan masuk.',
    path: '/dashboard/seller',
    icon: 'storefront',
    theme: 'primary',
  },
  DRIVER: {
    label: 'Pengirim',
    description: 'Temukan pekerjaan pengiriman dan selesaikan pesanan.',
    path: '/dashboard/driver',
    icon: 'local_shipping',
    theme: 'secondary',
  },
  ADMIN: {
    label: 'Admin',
    description: 'Pantau marketplace dan kelola sumber daya.',
    path: '/dashboard/admin',
    icon: 'admin_panel_settings',
    theme: 'error',
  },
};

export default function PilihPeranPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/masuk');
          return;
        }
        const data = await res.json();
        setRoles(data.user.roles);
        setUserName(data.user.username || 'Pengguna');
      } catch {
        router.push('/masuk');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  async function handleSelectRole(role: string) {
    setSelecting(role);
    try {
      const res = await fetch('/api/auth/select-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        const config = roleConfig[role];
        router.push(config?.path || '/');
        router.refresh();
      }
    } catch {
      setSelecting('');
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-surface-container-high border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 md:p-12 relative z-10 overflow-hidden bg-background">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-tertiary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-80 h-80 bg-secondary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-5xl w-full text-center space-y-8 md:space-y-12 animate-fade-in">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-extrabold text-on-background tracking-tight">
            Selamat Datang, {userName}!
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Anda memiliki beberapa peran yang terhubung dengan akun SEAPEDIA Anda. Silakan pilih peran aktif Anda untuk sesi ini.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
          {roles.map((role) => {
            const config = roleConfig[role];
            if (!config) return null;
            
            const isSelecting = selecting === role;
            const themeColorsMap: Record<string, { hoverText: string; iconBgHover: string; button: string }> = {
              tertiary: {
                hoverText: 'group-hover:text-tertiary',
                iconBgHover: 'group-hover:bg-tertiary-container group-hover:text-on-tertiary-container',
                button: 'bg-surface-container text-primary hover:bg-tertiary-container hover:text-on-tertiary-container group-hover:bg-tertiary group-hover:text-on-tertiary',
              },
              primary: {
                hoverText: 'group-hover:text-primary',
                iconBgHover: 'group-hover:bg-primary-container group-hover:text-on-primary-container',
                button: 'bg-surface-container text-primary hover:bg-primary-container hover:text-on-primary-container group-hover:bg-primary group-hover:text-on-primary',
              },
              secondary: {
                hoverText: 'group-hover:text-secondary',
                iconBgHover: 'group-hover:bg-secondary-container group-hover:text-on-secondary-container',
                button: 'bg-surface-container text-primary hover:bg-secondary-container hover:text-on-secondary-container group-hover:bg-secondary group-hover:text-on-secondary',
              },
              error: {
                hoverText: 'group-hover:text-error',
                iconBgHover: 'group-hover:bg-error-container group-hover:text-on-error-container',
                button: 'bg-surface-container text-primary hover:bg-error-container hover:text-on-error-container group-hover:bg-error group-hover:text-on-error',
              },
            };
            const themeColors = themeColorsMap[config.theme] || themeColorsMap.primary;

            return (
              <div 
                key={role}
                onClick={() => !selecting && handleSelectRole(role)}
                className={`
                  bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 flex flex-col h-full 
                  shadow-sm relative overflow-hidden group cursor-pointer focus:outline-none transition-all duration-300
                  ${selecting ? 'opacity-50 pointer-events-none' : 'hover:-translate-y-1 hover:shadow-lg hover:border-primary'}
                `}
                role="button"
                tabIndex={0}
              >
                {/* Popular Badge Indicator for specific roles if needed (omitted for now) */}
                <div className="flex-grow flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors duration-300 ${themeColors.iconBgHover}`}>
                    {/* Material Symbols Outlined Icon (using spans assuming global import is there) */}
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {role === 'BUYER' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />}
                      {role === 'SELLER' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" />}
                      {role === 'DRIVER' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />}
                      {role === 'ADMIN' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />}
                      {role === 'ADMIN' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
                    </svg>
                  </div>
                  <h2 className={`text-xl font-bold text-on-background transition-colors ${themeColors.hoverText}`}>{config.label}</h2>
                  <p className="text-sm text-on-surface-variant leading-relaxed px-2">{config.description}</p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-surface-variant flex justify-center">
                  <button 
                    disabled={isSelecting}
                    className={`
                      py-2.5 px-6 rounded-full transition-colors w-full uppercase tracking-wider font-bold text-xs flex items-center justify-center gap-2
                      ${themeColors.button}
                    `}
                  >
                    {isSelecting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Memuat...
                      </>
                    ) : (
                      `Pilih ${config.label}`
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
