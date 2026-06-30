'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/ToastProvider';

export default function AdminDiscountsPage() {
  const { showToast } = useToast();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI states
  const [activeTab, setActiveTab] = useState<'VOUCHER' | 'PROMO'>('VOUCHER');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [discountType, setDiscountType] = useState('VOUCHER');
  const [code, setCode] = useState('');
  const [amount, setAmount] = useState('');
  const [expiry, setExpiry] = useState('');
  const [usage, setUsage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const [resVouchers, resPromos] = await Promise.all([
        fetch('/api/admin/vouchers'),
        fetch('/api/admin/promos')
      ]);
      if (resVouchers.ok) {
        const data = await resVouchers.json();
        setVouchers(data.vouchers);
      }
      if (resPromos.ok) {
        const data = await resPromos.json();
        setPromos(data.promos);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const endpoint = discountType === 'VOUCHER' ? '/api/admin/vouchers' : '/api/admin/promos';
    const body: any = {
      code: code.toUpperCase(),
      discountAmount: parseInt(amount) || 0,
      expiryDate: expiry
    };
    if (discountType === 'VOUCHER') {
      body.remainingUsage = parseInt(usage) || 0;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Berhasil membuat diskon!', 'success');
        fetchDiscounts();
        setCode('');
        setAmount('');
        setExpiry('');
        setUsage('');
      } else {
        showToast(data.error || 'Gagal membuat diskon', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatus = (expiryDate: string, remainingUsage?: number) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    
    if (expiry < now) {
      return { label: 'Kedaluwarsa', styles: 'bg-surface-variant text-outline border border-outline/20' };
    }
    
    if (remainingUsage !== undefined && remainingUsage <= 0) {
      return { label: 'Habis', styles: 'bg-surface-variant text-outline border border-outline/20' };
    }
    
    if (remainingUsage !== undefined && remainingUsage <= 10) {
      return { label: 'Kuota Menipis', styles: 'bg-error-container/50 text-error border border-error/20' };
    }

    return { label: 'Aktif', styles: 'bg-tertiary-fixed/30 text-tertiary-fixed-variant border border-tertiary-container/20' };
  };

  const filteredData = (activeTab === 'VOUCHER' ? vouchers : promos).filter(item => 
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8 text-on-surface-variant">Memuat data diskon...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Manajemen Voucher & Promo</h1>
          <p className="text-sm text-on-surface-variant mt-1">Kelola diskon, kuota, dan program promosi marketplace.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-outline-variant">
        <button 
          onClick={() => setActiveTab('VOUCHER')}
          className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'VOUCHER' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}
        >
          Voucher (Berkuota)
        </button>
        <button 
          onClick={() => setActiveTab('PROMO')}
          className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'PROMO' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}
        >
          Promo (Tanpa Kuota)
        </button>
      </div>

      {/* Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Data Table & Filters */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Filters */}
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-sm flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Cari Kode</label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none transition-all uppercase placeholder:normal-case placeholder:font-normal font-bold" 
                  placeholder="Contoh: MERDEKA99" 
                />
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col flex-1 h-[600px]">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-surface-container sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Kode</th>
                    <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Potongan</th>
                    {activeTab === 'VOUCHER' && <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Sisa Kuota</th>}
                    <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Kedaluwarsa</th>
                    <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-outline-variant/20">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-on-surface-variant italic">
                        Tidak ada data {activeTab.toLowerCase()} yang ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => {
                      const status = getStatus(item.expiryDate, item.remainingUsage);
                      return (
                        <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                          <td className="p-4 font-bold text-on-surface uppercase tracking-wider">{item.code}</td>
                          <td className="p-4 text-secondary font-bold">{formatCurrency(item.discountAmount)}</td>
                          
                          {activeTab === 'VOUCHER' && (
                            <td className="p-4">
                              <span className={`text-xs font-bold ${item.remainingUsage <= 10 ? 'text-error' : 'text-on-surface-variant'}`}>
                                {item.remainingUsage} / ∞
                              </span>
                            </td>
                          )}

                          <td className="p-4 text-on-surface-variant text-xs">
                            <div className="font-medium text-sm text-on-surface">{new Date(item.expiryDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            <div>{new Date(item.expiryDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${status.styles}`}>
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-outline-variant/30 flex justify-between items-center text-xs font-medium text-on-surface-variant bg-surface-container-lowest">
              <span>Menampilkan {filteredData.length} data {activeTab.toLowerCase()}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 border-b border-outline-variant/30 pb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              <h2 className="text-xl font-bold text-on-surface">Buat Diskon Baru</h2>
            </div>
            
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Tipe Diskon</label>
                <select 
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none font-medium"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                >
                  <option value="VOUCHER">Voucher (Batas Kuota)</option>
                  <option value="PROMO">Promo (Tanpa Batas Kuota)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Kode {discountType === 'VOUCHER' ? 'Voucher' : 'Promo'}</label>
                <input 
                  type="text" required
                  value={code} 
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none uppercase font-bold placeholder:font-normal placeholder:normal-case" 
                  placeholder="Contoh: FLASH24" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Potongan Harga (Rp)</label>
                <input 
                  type="number" required min="1000"
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none" 
                  placeholder="Contoh: 15000" 
                />
              </div>

              {discountType === 'VOUCHER' && (
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Kuota Penggunaan</label>
                  <input 
                    type="number" required min="1"
                    value={usage} 
                    onChange={(e) => setUsage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none" 
                    placeholder="Contoh: 100" 
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Berlaku Hingga</label>
                <input 
                  type="datetime-local" required
                  value={expiry} 
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none text-on-surface-variant" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary py-3 rounded-lg text-sm font-bold hover:bg-primary-fixed-variant transition-colors mt-2 shadow-sm flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                    Simpan & Terbitkan
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
