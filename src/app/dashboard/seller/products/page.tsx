'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';

export default function SellerProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/seller/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal memuat produk');
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    
    try {
      const res = await fetch(`/api/seller/products/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        showToast('Produk berhasil dihapus', 'success');
      } else {
        showToast('Gagal menghapus produk', 'error');
      }
    } catch (error) {
      showToast('Terjadi kesalahan', 'error');
    }
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse-soft">Memuat produk...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Produk Saya</h1>
          <p className="text-color-text-secondary">Kelola daftar produk yang dijual di toko Anda.</p>
        </div>
        <Link href="/dashboard/seller/products/add">
          <Button>+ Tambah Produk</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error} (Pastikan Anda sudah membuat profil toko terlebih dahulu).
        </div>
      )}

      {!error && products.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-color-text-muted mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Belum ada produk</h3>
          <p className="text-color-text-secondary mb-6">Mulai berjualan dengan menambahkan produk pertama Anda.</p>
          <Link href="/dashboard/seller/products/add">
            <Button variant="outline">Tambah Produk Pertama</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full font-medium">
                    {product.category}
                  </span>
                  <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Stok: {product.stock}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-xl font-bold mb-3">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-color-text-secondary line-clamp-2 mb-4">
                  {product.description}
                </p>
              </div>
              
              <div className="flex gap-2 mt-4 pt-4 border-t border-color-border-light">
                <Link href={`/dashboard/seller/products/${product.id}/edit`} className="flex-1">
                  <Button variant="outline" className="w-full text-sm">Edit</Button>
                </Link>
                <Button 
                  className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4"
                  onClick={() => deleteProduct(product.id)}
                >
                  Hapus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
