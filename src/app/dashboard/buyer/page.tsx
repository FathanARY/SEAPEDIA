'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastProvider';

export default function BuyerDashboardPage() {
  const { showToast } = useToast();
  const [wallet, setWallet] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [topupAmount, setTopupAmount] = useState('');
  
  const [newAddressLabel, setNewAddressLabel] = useState('');
  const [newAddressFull, setNewAddressFull] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [walletRes, addressRes] = await Promise.all([
        fetch('/api/buyer/wallet'),
        fetch('/api/buyer/addresses')
      ]);
      if (walletRes.ok) {
        const data = await walletRes.json();
        setWallet(data.wallet);
      }
      if (addressRes.ok) {
        const data = await addressRes.json();
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topupAmount) return;
    try {
      const res = await fetch('/api/buyer/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseInt(topupAmount) })
      });
      if (res.ok) {
        setTopupAmount('');
        showToast('Top-up berhasil!', 'success');
        fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || 'Gagal top-up', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan', 'error');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressLabel || !newAddressFull) return;
    try {
      const res = await fetch('/api/buyer/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newAddressLabel, fullAddress: newAddressFull, isDefault: addresses.length === 0 })
      });
      if (res.ok) {
        setNewAddressLabel('');
        setNewAddressFull('');
        showToast('Alamat berhasil ditambahkan!', 'success');
        fetchData();
      } else {
        showToast('Gagal menambahkan alamat', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan', 'error');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-lg animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface">Dashboard</h1>
        </div>
      </div>

      {/* Bento Grid Layout for Wallet & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md md:gap-lg">
        
        {/* Left Column: Balance & Top Up */}
        <div className="lg:col-span-5 flex flex-col gap-md md:gap-lg">
          
          {/* Current Balance Card */}
          <div className="bg-primary text-on-primary rounded-xl p-lg shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% -20%, #ffffff 0%, transparent 60%)' }}></div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-label-md font-label-md text-primary-fixed-dim uppercase tracking-wider">Saldo SEAPAY</p>
                <h2 className="text-headline-lg md:text-display-sm font-headline-lg md:font-display-sm mt-sm font-bold tracking-tight">
                  Rp {(wallet?.balance || 0).toLocaleString('id-ID')}
                </h2>
              </div>
              <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
            </div>
          </div>

          {/* Top-up Section */}
          <form onSubmit={handleTopup} className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-[0_4px_4px_rgba(0,0,0,0.04)]">
            <h3 className="text-headline-md font-headline-md text-on-surface mb-md">Top-Up Dummy</h3>
            <div className="grid grid-cols-3 gap-sm mb-md">
              <button type="button" onClick={() => setTopupAmount('50000')} className="border border-outline-variant text-on-surface rounded-lg py-sm text-label-md font-label-md hover:border-primary hover:text-primary transition-colors">Rp 50rb</button>
              <button type="button" onClick={() => setTopupAmount('100000')} className="border border-outline-variant text-on-surface rounded-lg py-sm text-label-md font-label-md hover:border-primary hover:text-primary transition-colors">Rp 100rb</button>
              <button type="button" onClick={() => setTopupAmount('250000')} className="border border-outline-variant text-on-surface rounded-lg py-sm text-label-md font-label-md hover:border-primary hover:text-primary transition-colors">Rp 250rb</button>
            </div>
            <div className="relative mb-md">
              <span className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant font-bold px-2 text-label-md">Rp</span>
              <input 
                className="w-full pl-12 pr-sm py-sm border border-outline-variant rounded-lg text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-bright" 
                placeholder="Nominal Top-up" 
                type="number"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                required
                min="10000"
                max="100000000"
              />
            </div>
            <button type="submit" className="w-full bg-secondary text-on-secondary py-sm rounded-lg text-label-md font-label-md hover:bg-secondary-container hover:text-on-secondary-container transition-colors font-bold shadow-sm">
              Lanjutkan Top-Up
            </button>
          </form>

        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-[0_4px_4px_rgba(0,0,0,0.04)] flex flex-col">
          <div className="flex justify-between items-center mb-md">
            <h3 className="text-headline-md font-headline-md text-on-surface">Riwayat Transaksi Terakhir</h3>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-label-md font-label-md text-on-surface-variant border-b border-surface-variant">
                  <th className="py-sm font-medium">Tanggal</th>
                  <th className="py-sm font-medium">Deskripsi</th>
                  <th className="py-sm font-medium text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="text-body-md font-body-md">
                {wallet?.transactions?.slice(0, 6).map((t: any) => (
                  <tr key={t.id} className="border-b border-surface-variant/50 hover:bg-surface-bright transition-colors group">
                    <td className="py-sm text-on-surface-variant">{new Date(t.createdAt).toLocaleDateString('id-ID')}</td>
                    <td className="py-sm">
                      <div className="flex items-center gap-sm">
                        <span className="text-on-surface font-medium">
                          {t.type === 'TOPUP' ? 'Top-up' : t.type === 'REFUND' ? 'Pengembalian Dana' : t.type === 'INCOME' ? 'Pendapatan' : 'Pembayaran'}
                        </span>
                      </div>
                    </td>
                    <td className={`py-sm font-semibold text-right ${['TOPUP', 'REFUND', 'INCOME'].includes(t.type) ? 'text-tertiary' : 'text-error'}`}>
                      {['TOPUP', 'REFUND', 'INCOME'].includes(t.type) ? '+' : '-'}Rp {t.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
                {(!wallet?.transactions || wallet.transactions.length === 0) && (
                  <tr>
                    <td colSpan={3} className="py-lg text-center text-on-surface-variant">Belum ada transaksi</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Addresses Section (Below Dompet) */}
      <div className="mt-lg">
        <h2 className="text-headline-md font-headline-md text-on-surface mb-md">Alamat Pengiriman</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-[0_4px_4px_rgba(0,0,0,0.04)] h-fit">
            <h3 className="font-semibold text-sm mb-4">Daftar Alamat Tersimpan</h3>
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-4 border border-surface-variant rounded-lg bg-surface-bright">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-on-surface">{addr.label}</h3>
                    {addr.isDefault && (
                      <span className="text-xs bg-primary text-on-primary px-2 py-0.5 rounded-full">Utama</span>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant">{addr.fullAddress}</p>
                </div>
              ))}
              {addresses.length === 0 && (
                <p className="text-sm text-on-surface-variant">Belum ada alamat tersimpan.</p>
              )}
            </div>
          </div>

          <form onSubmit={handleAddAddress} className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-[0_4px_4px_rgba(0,0,0,0.04)] h-fit space-y-4">
            <h3 className="font-semibold text-sm">Tambah Alamat Baru</h3>
            <Input 
              placeholder="Label (Contoh: Rumah, Kantor)"
              value={newAddressLabel}
              onChange={(e) => setNewAddressLabel(e.target.value)}
              required
            />
            <textarea 
              className="w-full min-h-[100px] p-3 rounded-lg border border-outline-variant bg-surface-bright focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-body-md"
              placeholder="Alamat Lengkap"
              value={newAddressFull}
              onChange={(e) => setNewAddressFull(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-surface-container-high text-on-surface py-sm rounded-lg text-label-md font-label-md hover:bg-surface-variant transition-colors font-bold shadow-sm border border-outline-variant">
              Simpan Alamat Baru
            </button>
          </form>
          
        </div>
      </div>
      
    </div>
  );
}
