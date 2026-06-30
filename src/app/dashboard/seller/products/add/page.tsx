'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError('');

    if (!file.type.startsWith('image/')) {
      setImageError('File harus berupa gambar (PNG, JPG, dll).');
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      setImageError('Ukuran gambar maksimal 5MB.');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const fakeEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleImageChange(fakeEvent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.category) {
      setError('Kategori produk harus dipilih.');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/seller/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrl: imagePreview || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal menambahkan produk');
      } else {
        router.push('/dashboard/seller');
        router.refresh();
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full animate-fade-in pb-xl">
      {/* Header */}
      <div className="flex items-center gap-md mb-xl">
        <Link href="/dashboard/seller">
          <button className="p-sm rounded-full hover:bg-surface-container-highest transition-colors text-on-surface-variant flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </Link>
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface">Tambah Produk Baru</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-xs">Lengkapi detail untuk mendaftarkan produk ke toko Anda.</p>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-[12px] border border-white/50 rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">

          {/* Left Column: Image Upload */}
          <div className="md:col-span-1 p-lg bg-surface-container-lowest border-b md:border-b-0 md:border-r border-outline-variant flex flex-col items-center justify-start gap-md min-h-[300px] pt-lg">
            <p className="text-label-md font-label-md font-bold text-on-surface self-start">Gambar Produk</p>

            {/* Upload Zone */}
            <div
              className={`relative w-full max-w-[200px] aspect-square rounded-lg border-2 border-dashed transition-colors group cursor-pointer overflow-hidden ${
                imagePreview ? 'border-primary' : 'border-outline-variant hover:border-primary'
              }`}
              onDrop={handleImageDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('imageInput')?.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview produk" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-label-md font-label-md font-bold text-center px-sm">Ganti Gambar</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-surface-container-low flex flex-col items-center justify-center gap-sm">
                  <svg className="w-12 h-12 text-outline group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-label-md font-label-md text-on-surface-variant group-hover:text-primary transition-colors font-bold">Unggah Gambar</span>
                  <span className="text-label-sm font-label-sm text-outline text-center px-sm">Klik atau seret gambar ke sini</span>
                </div>
              )}
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <p className="text-label-sm font-label-sm text-outline text-center">PNG, JPG maks. 5MB. Rasio 1:1 direkomendasikan.</p>

            {imageError && (
              <p className="text-label-sm font-label-sm text-error text-center">{imageError}</p>
            )}

            {imagePreview && (
              <button
                type="button"
                onClick={() => { setImagePreview(null); setImageFile(null); }}
                className="text-label-md font-label-md text-error hover:underline"
              >
                Hapus Gambar
              </button>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="md:col-span-2 p-lg bg-surface-container-lowest flex flex-col gap-lg">
            {error && (
              <div className="bg-error-container text-on-error-container p-sm rounded-lg flex items-center gap-2 border border-error/20">
                <svg className="w-5 h-5 text-error flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-label-md font-label-md font-bold text-on-surface mb-xs">Nama Produk *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Misal: Jaring Nelayan Komersial T200"
                className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-label-md font-label-md font-bold text-on-surface mb-xs">Kategori *</label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  required
                >
                  <option value="" disabled>Pilih kategori kelautan</option>
                  <option value="Peralatan Kapal">Peralatan Kapal</option>
                  <option value="Elektronik Maritim">Elektronik Maritim</option>
                  <option value="Perlengkapan Keselamatan">Perlengkapan Keselamatan</option>
                  <option value="Suku Cadang Mesin">Suku Cadang Mesin</option>
                  <option value="Pakaian">Pakaian</option>
                  <option value="Elektronik">Elektronik</option>
                  <option value="Makanan">Makanan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-md text-on-surface-variant">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Price and Stock Grid */}
            <div className="grid grid-cols-2 gap-md">
              <div>
                <label htmlFor="price" className="block text-label-md font-label-md font-bold text-on-surface mb-xs">Harga (Rp) *</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-md text-on-surface-variant text-body-md font-bold">Rp</div>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full pl-xl pr-md py-sm rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="stock" className="block text-label-md font-label-md font-bold text-on-surface mb-xs">Jumlah Stok *</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-label-md font-label-md font-bold text-on-surface mb-xs">Deskripsi Produk *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Berikan spesifikasi terperinci, kondisi, dan informasi kelayakan..."
                rows={5}
                className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-y"
                required
              />
            </div>
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="bg-surface-container-low p-md border-t border-outline-variant flex justify-end gap-md">
          <Link href="/dashboard/seller">
            <button type="button" className="px-lg py-sm rounded-lg border border-outline text-on-surface-variant text-label-md font-label-md hover:bg-surface-container-highest hover:text-on-surface transition-colors font-bold">
              Batal
            </button>
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-lg py-sm rounded-lg bg-primary text-on-primary text-label-md font-label-md font-bold hover:bg-surface-tint shadow-sm transition-all flex items-center gap-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            {saving ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
        </div>
      </form>
    </main>
  );
}
