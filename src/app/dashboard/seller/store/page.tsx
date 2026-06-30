'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';

export default function SellerStorePage() {
  const { showToast } = useToast();
  const [store, setStore] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const res = await fetch('/api/seller/store');
      if (res.ok) {
        const data = await res.json();
        if (data.store) {
          setStore(data.store);
          setName(data.store.name);
          setDescription(data.store.description || '');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const method = store ? 'PUT' : 'POST';
      const res = await fetch('/api/seller/store', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal menyimpan profil toko');
      } else {
        setStore(data.store);
        showToast('Profil toko berhasil disimpan!', 'success');
        setIsEditing(false);
        router.refresh();
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse-soft">Memuat profil toko...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <header className="mb-lg">
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-background">Profil Toko</h1>
        <p className="text-body-md font-body-md text-on-surface-variant mt-xs">Kelola identitas publik toko Anda di SEAPEDIA.</p>
      </header>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden p-lg">
        <div className="flex justify-between items-center mb-lg border-b border-outline-variant pb-sm">
          <h2 className="text-headline-md font-headline-md text-on-surface">Identitas Toko</h2>
          {store && !isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-xs text-primary hover:bg-surface-container-low px-md py-sm rounded-lg transition-colors text-label-md font-label-md"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profil
            </button>
          )}
        </div>

        {(!store || isEditing) ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
            {error && (
              <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}
            
            <div className="flex flex-col gap-sm">
              <label className="text-label-md font-label-md text-on-surface" htmlFor="storeName">Nama Toko</label>
              <input 
                id="storeName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Toko Baju Budi"
                required
                className="px-md py-sm border border-outline-variant rounded-lg text-body-md font-body-md bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface"
              />
            </div>

            <div className="flex flex-col gap-sm">
              <label className="text-label-md font-label-md text-on-surface" htmlFor="storeDescription">Deskripsi Toko</label>
              <textarea 
                id="storeDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsikan produk apa saja yang Anda jual..."
                rows={5}
                className="px-md py-sm border border-outline-variant rounded-lg text-body-md font-body-md bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface resize-y"
              />
              <p className="text-label-sm font-label-sm text-outline">Jaga agar tetap profesional dan ringkas.</p>
            </div>

            <div className="mt-md flex justify-end gap-md">
              {store && (
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="px-xl py-sm rounded-lg text-label-md font-label-md text-primary hover:bg-surface-container-low transition-colors"
                >
                  Batal
                </button>
              )}
              <button 
                type="submit" 
                disabled={saving} 
                className="bg-primary hover:bg-on-primary-fixed-variant text-on-primary px-xl py-sm rounded-lg text-label-md font-label-md transition-colors flex items-center gap-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {saving ? 'Menyimpan...' : (store ? 'Simpan Perubahan' : 'Buat Toko')}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-lg">
            <div className="flex flex-col gap-sm">
              <span className="text-label-md font-label-md text-on-surface-variant">Nama Toko</span>
              <p className="text-body-lg font-body-lg text-on-surface">{store.name}</p>
            </div>
            <div className="flex flex-col gap-sm">
              <span className="text-label-md font-label-md text-on-surface-variant">Deskripsi Toko</span>
              {store.description ? (
                <p className="text-body-md font-body-md text-on-surface leading-relaxed whitespace-pre-line">{store.description}</p>
              ) : (
                <p className="text-body-md font-body-md text-outline italic">Belum ada deskripsi toko.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
