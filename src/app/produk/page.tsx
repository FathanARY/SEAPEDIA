'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProdukPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Semua', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.store?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'Semua' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex-1 pt-6 pb-12 px-4 md:px-12 flex gap-6 max-w-7xl mx-auto w-full animate-fade-in">
      {/* Filter Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-6">
        <div>
          <h3 className="text-xl font-bold text-on-surface mb-4">Filter</h3>

          {/* Category Filter */}
          <div className="mb-6 border-b border-surface-variant pb-6">
            <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Kategori</h4>
            <ul className="flex flex-col gap-2">
              {categories.map(cat => (
                <li key={cat as string}>
                  <button
                    onClick={() => setCategoryFilter(cat as string)}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                      categoryFilter === cat 
                        ? 'bg-primary/10 text-primary font-semibold' 
                        : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Katalog Produk</h1>
            <p className="text-sm text-on-surface-variant mt-1">Temukan berbagai produk menarik dari berbagai toko.</p>
          </div>
          {/* Mobile Category Select */}
          <div className="lg:hidden">
            <select
              className="rounded-lg border border-outline-variant px-3 py-2 text-sm bg-surface-container-lowest focus:ring-1 focus:ring-primary focus:border-primary"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat as string} value={cat as string}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-lg border-none text-sm focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-colors"
            placeholder="Cari produk, toko, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-surface-container-high border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-stagger">
            {filteredProducts.map((product) => (
              <Link href={`/produk/${product.id}`} key={product.id} className="group">
                <div className="bg-surface-container-lowest border border-surface-variant rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-outline-variant transition-all duration-200 flex flex-col h-full">
                  <div className="aspect-square bg-surface-container flex items-center justify-center text-outline-variant overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <span className="text-xs text-on-surface-variant flex items-center gap-1 mb-1">
                      {product.store?.name || 'Toko'}
                    </span>
                    <h3 className="font-semibold text-on-surface line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="mt-auto pt-3 border-t border-surface-variant flex items-center justify-between">
                      <p className="font-bold text-lg text-primary">Rp {product.price.toLocaleString('id-ID')}</p>
                      <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">Stok: {product.stock}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant">
            <svg className="w-12 h-12 mx-auto text-outline mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-on-surface-variant">Tidak ada produk yang ditemukan.</p>
          </div>
        )}
      </div>
    </main>
  );
}
