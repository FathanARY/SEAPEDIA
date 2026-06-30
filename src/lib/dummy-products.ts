export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  storeName: string;
  storeId: string;
  image: string;
  category: string;
}

export const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Kemeja Linen Premium',
    description: 'Kemeja linen berkualitas tinggi dengan jahitan rapi. Cocok untuk acara formal maupun santai. Bahan adem dan nyaman dipakai sepanjang hari.',
    price: 289000,
    stock: 50,
    storeName: 'Toko Gaya Modern',
    storeId: 'store-1',
    image: '/products/kemeja.jpg',
    category: 'Pakaian',
  },
  {
    id: '2',
    name: 'Tas Ransel Kanvas',
    description: 'Tas ransel kanvas dengan desain minimalis. Dilengkapi kompartemen laptop 15 inci dan kantong organizer. Tahan air dan ringan.',
    price: 175000,
    stock: 30,
    storeName: 'Serba Ada Store',
    storeId: 'store-2',
    image: '/products/tas.jpg',
    category: 'Aksesoris',
  },
  {
    id: '3',
    name: 'Sepatu Sneakers Klasik',
    description: 'Sepatu sneakers dengan desain klasik yang tidak pernah ketinggalan zaman. Sol karet anti selip dan bantalan empuk untuk kenyamanan maksimal.',
    price: 450000,
    stock: 25,
    storeName: 'Toko Gaya Modern',
    storeId: 'store-1',
    image: '/products/sepatu.jpg',
    category: 'Sepatu',
  },
  {
    id: '4',
    name: 'Headphone Wireless',
    description: 'Headphone wireless dengan noise cancelling aktif. Baterai tahan hingga 30 jam dan kualitas suara Hi-Fi. Nyaman digunakan seharian.',
    price: 650000,
    stock: 15,
    storeName: 'Elektronik Jaya',
    storeId: 'store-3',
    image: '/products/headphone.jpg',
    category: 'Elektronik',
  },
  {
    id: '5',
    name: 'Tumbler Stainless 750ml',
    description: 'Tumbler stainless steel dengan insulasi ganda. Menjaga suhu minuman panas hingga 12 jam dan dingin hingga 24 jam.',
    price: 125000,
    stock: 100,
    storeName: 'Serba Ada Store',
    storeId: 'store-2',
    image: '/products/tumbler.jpg',
    category: 'Peralatan',
  },
  {
    id: '6',
    name: 'Buku Catatan A5 Premium',
    description: 'Buku catatan A5 dengan kertas 100gsm berkualitas tinggi. Cover hardbound dan bookmark satin. 240 halaman ruled.',
    price: 85000,
    stock: 200,
    storeName: 'Serba Ada Store',
    storeId: 'store-2',
    image: '/products/buku.jpg',
    category: 'Alat Tulis',
  },
  {
    id: '7',
    name: 'Jam Tangan Minimalis',
    description: 'Jam tangan dengan desain minimalis dan elegan. Tali kulit asli, mesin quartz Jepang, dan water resistant 30m.',
    price: 520000,
    stock: 20,
    storeName: 'Toko Gaya Modern',
    storeId: 'store-1',
    image: '/products/jam.jpg',
    category: 'Aksesoris',
  },
  {
    id: '8',
    name: 'Keyboard Mechanical',
    description: 'Keyboard mechanical 75% layout dengan switch tactile. RGB backlight, hot-swappable, dan keycaps PBT double-shot.',
    price: 890000,
    stock: 10,
    storeName: 'Elektronik Jaya',
    storeId: 'store-3',
    image: '/products/keyboard.jpg',
    category: 'Elektronik',
  },
];
