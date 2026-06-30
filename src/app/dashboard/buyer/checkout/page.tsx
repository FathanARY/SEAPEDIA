'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/ToastProvider';

export default function BuyerCheckoutPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string, amount: number, type: string } | null>(null);
  const [validatingDiscount, setValidatingDiscount] = useState(false);

  const DELIVERY_FEES = {
    INSTANT: 20000,
    NEXT_DAY: 15000,
    REGULAR: 10000,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cartRes, addrRes, walletRes] = await Promise.all([
        fetch('/api/buyer/cart'),
        fetch('/api/buyer/addresses'),
        fetch('/api/buyer/wallet')
      ]);
      
      const cartData = await cartRes.json();
      if (cartData.cartItems?.length === 0) {
        router.push('/dashboard/buyer/cart');
        return;
      }
      setCartItems(cartData.cartItems);

      const addrData = await addrRes.json();
      setAddresses(addrData.addresses);
      const defaultAddr = addrData.addresses?.find((a: any) => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      else if (addrData.addresses?.length > 0) setSelectedAddressId(addrData.addresses[0].id);

      const walletData = await walletRes.json();
      setWallet(walletData.wallet);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId || !deliveryMethod) {
      showToast('Pilih alamat dan metode pengiriman', 'info');
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch('/api/buyer/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          addressId: selectedAddressId, 
          deliveryMethod,
          discountCode: appliedDiscount?.code 
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Checkout berhasil!', 'success');
        router.push('/dashboard/buyer/orders');
      } else {
        showToast(data.error || 'Gagal checkout', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCodeInput) return;
    setValidatingDiscount(true);
    try {
      const res = await fetch('/api/buyer/checkout/validate-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCodeInput })
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedDiscount({
          code: data.code,
          amount: data.discountAmount,
          type: data.type
        });
        showToast(`Diskon ${data.type} berhasil digunakan!`, 'success');
      } else {
        showToast(data.error || 'Kode diskon tidak valid', 'error');
        setAppliedDiscount(null);
      }
    } catch (err) {
      showToast('Terjadi kesalahan saat validasi diskon', 'error');
    } finally {
      setValidatingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCodeInput('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-surface-container-high border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = deliveryMethod ? DELIVERY_FEES[deliveryMethod as keyof typeof DELIVERY_FEES] : 0;
  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const baseAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.floor(baseAmount * 0.12);
  const totalAmount = baseAmount + deliveryFee + taxAmount;

  const hasEnoughBalance = wallet?.balance >= totalAmount;
  const storeName = cartItems.length > 0 ? cartItems[0].product.store.name : '';

  return (
    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
      {/* Left Column */}
      <div className="md:col-span-8 flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">Checkout</h1>

        {/* Shipping Address */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Alamat Pengiriman
            </h2>
            <Link href="/dashboard/buyer" className="text-primary text-xs font-semibold hover:underline">Edit</Link>
          </div>
          {addresses.length === 0 ? (
            <p className="text-sm text-error">Anda belum memiliki alamat. Tambahkan di halaman Dashboard.</p>
          ) : (
            <div className="space-y-2">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                    selectedAddressId === addr.id
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant hover:bg-surface-container-low'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="sr-only"
                  />
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors" style={{ borderColor: selectedAddressId === addr.id ? '#0050cb' : '#c2c6d8' }}>
                    {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-sm text-on-surface">{addr.label}</span>
                      {addr.isDefault && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">Utama</span>}
                    </div>
                    <p className="text-sm text-on-surface-variant">{addr.fullAddress}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </section>

          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
            Metode Pengiriman
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: 'REGULAR', label: 'Regular', time: '2-4 Hari', price: 10000 },
              { id: 'NEXT_DAY', label: 'Next Day', time: '1 Hari', price: 15000 },
              { id: 'INSTANT', label: 'Instant', time: '1-3 Jam', price: 20000 },
            ].map((method) => (
              <label key={method.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="delivery"
                  value={method.id}
                  checked={deliveryMethod === method.id}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="sr-only peer"
                />
                <div className="p-4 rounded-lg border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-surface-container-low transition-colors">
                  <span className="text-xs font-semibold text-on-surface block mb-1">{method.label}</span>
                  <p className="font-bold text-on-surface">Rp {method.price.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-on-surface-variant mt-1">Est. {method.time}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Order Items Summary */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            Ringkasan Pesanan
          </h2>
          {storeName && (
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-outline-variant">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" />
              </svg>
              <span className="text-xs font-semibold text-on-surface">{storeName}</span>
            </div>
          )}
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 bg-surface-container-highest rounded-lg shrink-0 flex items-center justify-center text-outline-variant overflow-hidden">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  )}
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-on-surface">{item.product.name}</h3>
                  </div>
                  <div className="flex justify-between items-end mt-1">
                    <span className="text-sm text-on-surface-variant">Qty: {item.quantity}</span>
                    <span className="font-bold text-on-surface">Rp {(item.quantity * item.product.price).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Method */}
        
      </div>

      {/* Right Column: Payment Summary */}
      <div className="md:col-span-4 flex flex-col gap-4">
        {/* Promo Code */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            Promo / Voucher
          </h2>
          {appliedDiscount ? (
            <div className="flex items-center justify-between p-3 border border-tertiary/30 bg-tertiary/5 rounded-lg text-sm">
              <span className="font-bold text-tertiary">{appliedDiscount.code}</span>
              <button onClick={handleRemoveDiscount} className="text-xs text-on-surface-variant hover:text-error">Hapus</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={discountCodeInput}
                onChange={(e) => setDiscountCodeInput(e.target.value)}
                placeholder="Masukkan kode promo"
                className="flex-grow bg-surface-container-highest border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
              <button
                onClick={handleApplyDiscount}
                disabled={!discountCodeInput || validatingDiscount}
                className="bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-semibold hover:bg-primary-container transition-colors disabled:opacity-50"
              >
                {validatingDiscount ? '...' : 'Pakai'}
              </button>
            </div>
          )}
        </section>

        {/* Payment Breakdown */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm sticky top-6">
          <h2 className="text-lg font-bold text-on-surface mb-4">Ringkasan Pembayaran</h2>
          <div className="flex flex-col gap-2 text-sm text-on-surface-variant mb-4 pb-4 border-b border-outline-variant">
            <div className="flex justify-between">
              <span>Subtotal ({cartItems.length} barang)</span>
              <span className="text-on-surface font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            {appliedDiscount && (
              <div className="flex justify-between text-tertiary">
                <span>Diskon ({appliedDiscount.code})</span>
                <span>-Rp {appliedDiscount.amount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Ongkos Kirim</span>
              <span className="text-on-surface font-medium">Rp {deliveryFee.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>PPN (12%)</span>
              <span className="text-on-surface font-medium">Rp {taxAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-on-surface">Total Pembayaran</span>
            <span className="text-xl font-bold text-primary">Rp {totalAmount.toLocaleString('id-ID')}</span>
          </div>

          {/* Wallet */}
          <div className={`p-3 rounded-lg border mb-4 ${hasEnoughBalance ? 'border-outline-variant bg-surface-container-low' : 'border-error/30 bg-error-container/20'}`}>
            <p className="text-xs text-on-surface-variant mb-1">Saldo SEAPAY</p>
            <p className={`font-bold ${hasEnoughBalance ? 'text-on-surface' : 'text-error'}`}>
              Rp {wallet?.balance?.toLocaleString('id-ID') || 0}
            </p>
            {!hasEnoughBalance && (
              <p className="text-xs text-error mt-1">Saldo tidak mencukupi. Silakan Top-up terlebih dahulu.</p>
            )}
          </div>

          <button
            onClick={handleCheckout}
            disabled={!selectedAddressId || !deliveryMethod || !hasEnoughBalance || isProcessing}
            className="w-full bg-secondary text-on-secondary py-3 rounded-lg text-sm font-bold hover:bg-secondary-container hover:text-on-secondary-container transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            {isProcessing ? 'Memproses...' : 'Konfirmasi & Bayar'}
          </button>
          <p className="text-center text-xs text-on-surface-variant mt-3 flex justify-center items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            Checkout Aman Terenkripsi SSL
          </p>
        </section>
      </div>
    </div>
  );
}
