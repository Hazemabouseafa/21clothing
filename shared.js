// 21 — TWENTY ONE CLOTHING | UNIFIED COMMERCE DATA LAYER
const STORAGE_PREFIX = 'twentyone_';

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    sortOrder: 1,
    name: "Midnight Drop Hoodie",
    price: 1250,
    originalPrice: 1450,
    badge: "New Drop",
    fit: "Oversized Fit 450 GSM",
    colorTheme: "black",
    colors: ["#0a0a0a", "#1a1a2e", "#2d1b1b"],
    svgFill: "#1c1c1c",
    accent: "#3a3a3a",
    image: null,
    colorVariants: [
      { colorName: "Midnight Black", colorHex: "#0a0a0a", images: [] }
    ],
    sizes: { S: 8, M: 14, L: 20, XL: 12, XXL: 5 },
    desc: "100% Egyptian Cotton, ultra-dense 450 GSM French Terry, double-layered hood with brushed 21 insignia.",
    active: true
  },
  {
    id: 2,
    sortOrder: 2,
    name: "Ash Classic Hoodie",
    price: 1150,
    originalPrice: 1300,
    badge: "Bestseller",
    fit: "Relaxed Fit 420 GSM",
    colorTheme: "ash",
    colors: ["#666666", "#888888", "#444444"],
    svgFill: "#4a4a4a",
    accent: "#888888",
    image: null,
    colorVariants: [
      { colorName: "Ash Heather", colorHex: "#666666", images: [] }
    ],
    sizes: { S: 12, M: 18, L: 15, XL: 10, XXL: 4 },
    desc: "Custom washed ash fleece with dropped shoulders, kangaroo pocket, and hidden cuff embroidery.",
    active: true
  },
  {
    id: 3,
    sortOrder: 3,
    name: "Stone Desert Oversized",
    price: 1350,
    originalPrice: 1600,
    badge: "Limited",
    fit: "Boxy Heavyweight 480 GSM",
    colorTheme: "stone",
    colors: ["#c8b89a", "#d4c5ae", "#e0d5c0"],
    svgFill: "#3d3530",
    accent: "#5a4f46",
    image: null,
    colorVariants: [
      { colorName: "Stone Desert", colorHex: "#3d3530", images: [] }
    ],
    sizes: { S: 5, M: 9, L: 11, XL: 6, XXL: 2 },
    desc: "Earthy Egyptian desert hue, tailored boxy cut, ribbed hems with heavy raw cotton weight.",
    active: true
  },
  {
    id: 4,
    sortOrder: 4,
    name: "Chalk Essential Hoodie",
    price: 1100,
    originalPrice: 1250,
    badge: "",
    fit: "Regular Streetwear 400 GSM",
    colorTheme: "chalk",
    colors: ["#e8e3d8", "#f0ece2", "#d4cfc4"],
    svgFill: "#6a6a6a",
    accent: "#999999",
    image: null,
    colorVariants: [
      { colorName: "Chalk Bone", colorHex: "#e8e3d8", images: [] }
    ],
    sizes: { S: 10, M: 15, L: 12, XL: 8, XXL: 4 },
    desc: "Clean off-white minimalism. Subtle tonal 21 screen-print, buttery soft brushed inner lining.",
    active: true
  },
  {
    id: 5,
    sortOrder: 5,
    name: "Ink Heavyweight Zip-Up",
    price: 1450,
    originalPrice: 1700,
    badge: "New Drop",
    fit: "Heavy Zip 500 GSM",
    colorTheme: "ink",
    colors: ["#111111", "#1a1a1a", "#000000"],
    svgFill: "#2a2a2a",
    accent: "#555555",
    image: null,
    colorVariants: [
      { colorName: "Ink Charcoal", colorHex: "#181818", images: [] }
    ],
    sizes: { S: 6, M: 12, L: 16, XL: 10, XXL: 3 },
    desc: "Double-way matte silver metal zipper, premium heavyweight Egyptian yarn, engineered box hood.",
    active: true
  },
  {
    id: 6,
    sortOrder: 6,
    name: "Fog Relaxed Hoodie",
    price: 1200,
    originalPrice: 1350,
    badge: "",
    fit: "Oversized Fit 420 GSM",
    colorTheme: "ash",
    colors: ["#b0aaa0", "#c0bab0", "#a0a09a"],
    svgFill: "#3d3d3d",
    accent: "#666666",
    image: null,
    colorVariants: [
      { colorName: "Fog Grey", colorHex: "#555555", images: [] }
    ],
    sizes: { S: 9, M: 14, L: 17, XL: 7, XXL: 3 },
    desc: "Subtle muted fog tone, seamless shoulder drop, vintage garment dyed finish.",
    active: true
  },
  {
    id: 7,
    sortOrder: 7,
    name: "Onyx Acid Wash Hoodie",
    price: 1399,
    originalPrice: 1599,
    badge: "Limited",
    fit: "Boxy Fit 460 GSM",
    colorTheme: "black",
    colors: ["#1c1c1c", "#2d2d2d"],
    svgFill: "#222222",
    accent: "#444444",
    image: null,
    colorVariants: [
      { colorName: "Midnight Black", colorHex: "#1c1c1c", images: [] }
    ],
    sizes: { S: 5, M: 10, L: 15, XL: 8, XXL: 4 },
    desc: "Vintage acid wash finish, custom heavy ribbing, dropped shoulders.",
    active: true
  }
];

const DEFAULT_ORDERS = [
  {
    id: "21-1048",
    date: "2026-10-09 14:22",
    customer: "Karim El-Sayed",
    phone: "01012345678",
    governorate: "Cairo",
    address: "Zamalek, Brazil St, Bldg 14, Apt 6",
    items: [
      { id: 1, name: "Midnight Drop Hoodie", size: "L", color: "#0a0a0a", qty: 1, price: 1250 }
    ],
    subtotal: 1250,
    shipping: 50,
    discount: 0,
    total: 1300,
    payment: "Cash on Delivery",
    status: "pending"
  },
  {
    id: "21-1047",
    date: "2026-10-09 11:15",
    customer: "Nouran Mansour",
    phone: "01123456789",
    governorate: "Giza",
    address: "Sheikh Zayed, District 7, Villa 22",
    items: [
      { id: 3, name: "Stone Desert Oversized", size: "M", color: "#c8b89a", qty: 1, price: 1350 },
      { id: 4, name: "Chalk Essential Hoodie", size: "S", color: "#e8e3d8", qty: 1, price: 1100 }
    ],
    subtotal: 2450,
    shipping: 0,
    discount: 100,
    total: 2350,
    payment: "Instapay",
    status: "confirmed"
  },
  {
    id: "21-1046",
    date: "2026-10-08 19:40",
    customer: "Omar Tarek",
    phone: "01234567890",
    governorate: "Alexandria",
    address: "Smouha, Victor Emmanuel Square, Apt 4B",
    items: [
      { id: 5, name: "Ink Heavyweight Zip-Up", size: "XL", color: "#111111", qty: 1, price: 1450 }
    ],
    subtotal: 1450,
    shipping: 65,
    discount: 0,
    total: 1515,
    payment: "Vodafone Cash",
    status: "shipped"
  }
];

const DEFAULT_PROMOS = [
  { code: "TWENTY21", type: "percentage", value: 10, min: 1000, used: 24, active: true },
  { code: "CAIRODROP", type: "fixed", value: 150, min: 1500, used: 12, active: true },
  { code: "FREESHIP", type: "fixed", value: 50, min: 2000, used: 8, active: true }
];

const DEFAULT_SHIPPING = {
  cairo: 50,
  alex: 65,
  delta: 70,
  upperEgypt: 85,
  freeThreshold: 2500
};

const DEFAULT_SETTINGS = {
  waNumber: "201012345678",
  instagram: "https://instagram.com/twentyoneclothing",
  tiktok: "https://tiktok.com/@twentyoneclothing",
  facebook: "https://facebook.com/twentyoneclothing",
  whatsapp: "201012345678",
  announcement: "FREE SHIPPING ON ORDERS OVER 2,500 EGP | CASH ON DELIVERY ACROSS EGYPT",
  showAnnouncement: "true",
  storeStatus: "open",
  metaPixel: "",
  adminUser: "admin",
  adminPass: "twenty21"
};

const DEFAULT_SIZE_GUIDES = {
  top: {
    id: "top",
    name: "Hoodie & Shirt Size Guide",
    nameAr: "دليل مقاسات الهوديز والتيشرتات (Top)",
    type: "shirt",
    description: "Relaxed streetwear oversized fit. Measurements in Centimeters (cm).",
    unit: "cm",
    columns: ["Size", "Chest (العرض)", "Length (الطول)", "Shoulders (الأكتاف)", "Sleeve (الكم)"],
    rows: [
      { size: "S", chest: "58", length: "68", shoulders: "54", sleeve: "60" },
      { size: "M", chest: "61", length: "71", shoulders: "56", sleeve: "62" },
      { size: "L", chest: "64", length: "74", shoulders: "58", sleeve: "64" },
      { size: "XL", chest: "67", length: "76", shoulders: "60", sleeve: "65" },
      { size: "XXL", chest: "70", length: "78", shoulders: "62", sleeve: "66" }
    ],
    fitNotes: "Model is 182 cm (78 kg) wearing Large. For oversized streetwear drape choose your usual size, or size down for standard fit."
  },
  bottom: {
    id: "bottom",
    name: "Pantalon & Sweatpants Size Guide",
    nameAr: "دليل مقاسات البنطلون والسويت بانتس (Bottom)",
    type: "pantalon",
    description: "Straight-leg streetwear cut with elastic drawstring waistband. Measurements in Centimeters (cm).",
    unit: "cm",
    columns: ["Size", "Waist (الوسط)", "Length (الطول)", "Thigh (الفخذ)", "Leg Opening (فتحة الرجل)"],
    rows: [
      { size: "S", waist: "72 - 78", length: "100", thigh: "62", legOpening: "22" },
      { size: "M", waist: "78 - 84", length: "103", thigh: "65", legOpening: "23" },
      { size: "L", waist: "84 - 90", length: "105", thigh: "68", legOpening: "24" },
      { size: "XL", waist: "90 - 96", length: "107", thigh: "71", legOpening: "25" },
      { size: "XXL", waist: "96 - 104", length: "109", thigh: "74", legOpening: "26" }
    ],
    fitNotes: "Elastic waist band with drawstring ensures flexible comfort. Choose your usual waist size."
  }
};

const DEFAULT_CONTENT = {
  announcement: "FREE SHIPPING ON ORDERS OVER 2,500 EGP | CASH ON DELIVERY ACROSS EGYPT",
  heroTagline: "Cairo Streetwear Essentials — Drop 001",
  heroCta: "Shop The Collection",
  marqueeItems: "Twenty One Clothing ✦ 450 GSM French Terry ✦ Cairo, Egypt ✦ Drop 001 ✦ Heavyweight Hoodies ✦ Limited Quantities",
  collectionEyebrow: "Winter Essentials",
  collectionTitle: "Drop 001\nThe Hoodies",
  sweatpantsEyebrow: "Bottoms Collection",
  sweatpantsTitle: "Drop 001\nThe Sweatpants",
  storyEyebrow: "The Philosophy",
  storyTitle: "Built for the\nstreets of Cairo.",
  storyParagraph1: "Twenty One was born out of an obsession with the uncompromising hoodie. Engineered with ultra-heavyweight 450 GSM Egyptian combed cotton, bespoke garment dye, and an architectural drop-shoulder cut.",
  storyParagraph2: "No loud noise. No oversized slogans. Just silhouette and weight that speak.",
  footerDesc: "Cairo, Egypt\nIndependent Streetwear Label.\nDesigned and crafted locally.",
  footerCopyright: "© 2026 Twenty One Clothing. All Rights Reserved."
};

const StoreDB = {
  hasBackend: false,
  memoryCache: {},

  getNeonUrl() {
    try {
      return localStorage.getItem(STORAGE_PREFIX + 'neon_url') || '';
    } catch (e) {
      return '';
    }
  },

  setNeonUrl(url) {
    try {
      if (url && url.trim()) {
        localStorage.setItem(STORAGE_PREFIX + 'neon_url', url.trim());
      } else {
        localStorage.removeItem(STORAGE_PREFIX + 'neon_url');
      }
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('storedb_neon_change', { detail: { url } }));
      }
    } catch (e) {}
  },

  fetchApi(endpoint, options = {}) {
    const headers = { ...(options.headers || {}) };
    const neonUrl = this.getNeonUrl();
    if (neonUrl) {
      headers['x-database-url'] = neonUrl;
    }
    headers['Cache-Control'] = 'no-cache';
    headers['Pragma'] = 'no-cache';

    let targetUrl = endpoint;
    if (!options.method || options.method.toUpperCase() === 'GET') {
      const sep = targetUrl.includes('?') ? '&' : '?';
      targetUrl += sep + '_t=' + Date.now();
    }

    return fetch(targetUrl, { ...options, headers });
  },

  get(key, fallback) {
    if (Object.prototype.hasOwnProperty.call(this.memoryCache, key) && this.memoryCache[key] !== undefined) {
      return this.memoryCache[key];
    }
    try {
      const v = localStorage.getItem(STORAGE_PREFIX + key);
      if (v) {
        const parsed = JSON.parse(v);
        this.memoryCache[key] = parsed;
        return parsed;
      }
      return fallback;
    } catch(e) {
      return fallback;
    }
  },

  set(key, val) {
    this.memoryCache[key] = val;
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
    } catch(e) {
      // If product images exceed browser 5MB localStorage quota, keep authoritative data in memoryCache
      // and clear stale localStorage entry so subsequent reads never serve outdated cache.
      try { localStorage.removeItem(STORAGE_PREFIX + key); } catch (_) {}
    }
    try {
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('storedb_change', { detail: { key, val } }));
      }
    } catch (e) {}
  },

  isOnline() {
    return (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) || this.hasBackend;
  },

  async syncWithBackend() {
    if (typeof window === 'undefined' || !window.location.protocol.startsWith('http')) return;
    try {
      const [pRes, oRes, prRes, shRes, stRes, cRes, sgRes] = await Promise.allSettled([
        this.fetchApi('/api/products'),
        this.fetchApi('/api/orders'),
        this.fetchApi('/api/promos'),
        this.fetchApi('/api/shipping'),
        this.fetchApi('/api/settings'),
        this.fetchApi('/api/content'),
        this.fetchApi('/api/size-guides')
      ]);

      let anySuccess = false;

      // ── 1. Authoritative Products Sync from Cloud DB ──
      if (pRes.status === 'fulfilled' && pRes.value.ok) {
        anySuccess = true;
        const remoteProducts = await pRes.value.json();

        if (Array.isArray(remoteProducts)) {
          const sorted = [...remoteProducts].sort((a, b) => (Number(a.sortOrder) || 9999) - (Number(b.sortOrder) || 9999));
          this.set('products', sorted);
        }
      }

      // ── 2. Orders Sync ──
      if (oRes.status === 'fulfilled' && oRes.value.ok) {
        anySuccess = true;
        const remoteOrders = await oRes.value.json();
        if (Array.isArray(remoteOrders)) {
          this.set('orders', remoteOrders);
        }
      }

      // ── 3. Promos Sync ──
      if (prRes.status === 'fulfilled' && prRes.value.ok) {
        anySuccess = true;
        this.set('promos', await prRes.value.json());
      }

      // ── 4. Shipping Sync ──
      if (shRes.status === 'fulfilled' && shRes.value.ok) {
        anySuccess = true;
        this.set('shipping', await shRes.value.json());
      }

      // ── 5. Settings Sync ──
      if (stRes.status === 'fulfilled' && stRes.value.ok) {
        anySuccess = true;
        const remoteSettings = await stRes.value.json() || {};
        this.set('settings', remoteSettings);
      }

      // ── 6. Content Sync ──
      if (cRes.status === 'fulfilled' && cRes.value.ok) {
        anySuccess = true;
        const remoteContent = await cRes.value.json() || {};
        this.set('content', remoteContent);
      }

      // ── 7. Size Guides Sync ──
      if (sgRes.status === 'fulfilled' && sgRes.value.ok) {
        anySuccess = true;
        this.set('sizeGuides', await sgRes.value.json());
      }

      if (anySuccess) {
        this.hasBackend = true;
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('storedb_synced'));
      }
    } catch (e) {
      console.error('[StoreDB sync error]', e);
    }
  },

  exportBackupData() {
    const bundle = {
      version: '21.3',
      timestamp: new Date().toISOString(),
      products: this.getProducts(),
      orders: this.getOrders(),
      promos: this.getPromos(),
      shipping: this.getShipping(),
      settings: this.getSettings(),
      content: this.getContent(),
      sizeGuides: this.getSizeGuides()
    };
    return JSON.stringify(bundle, null, 2);
  },

  async importBackupData(raw) {
    if (!raw) throw new Error('Empty backup data');
    let bundle = null;
    try {
      bundle = typeof raw === 'object' ? raw : JSON.parse(raw);
    } catch(e) {
      throw new Error('Invalid JSON format');
    }

    if (bundle.products && Array.isArray(bundle.products)) this.set('products', bundle.products);
    if (bundle.orders && Array.isArray(bundle.orders)) this.set('orders', bundle.orders);
    if (bundle.promos && Array.isArray(bundle.promos)) this.set('promos', bundle.promos);
    if (bundle.shipping) this.set('shipping', bundle.shipping);
    if (bundle.settings) this.set('settings', bundle.settings);
    if (bundle.content) this.set('content', bundle.content);
    if (bundle.sizeGuides) this.set('sizeGuides', bundle.sizeGuides);

    if (this.isOnline()) {
      await this.syncAllToCloud();
    }
    return true;
  },

  async syncAllToCloud() {
    const bundle = {
      products: this.getProducts(),
      orders: this.getOrders(),
      promos: this.getPromos(),
      shipping: this.getShipping(),
      settings: this.getSettings(),
      content: this.getContent(),
      sizeGuides: this.getSizeGuides()
    };
    try {
      const res = await this.fetchApi('/api/neon-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bundle)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  init() {
    // Only seed local defaults on initial local/offline run
    const isOnlineEnv = typeof window !== 'undefined' && window.location.protocol.startsWith('http');
    if (!isOnlineEnv) {
      if (!localStorage.getItem(STORAGE_PREFIX + 'products')) this.set('products', DEFAULT_PRODUCTS);
      if (!localStorage.getItem(STORAGE_PREFIX + 'orders')) this.set('orders', DEFAULT_ORDERS);
      if (!localStorage.getItem(STORAGE_PREFIX + 'promos')) this.set('promos', DEFAULT_PROMOS);
      if (!localStorage.getItem(STORAGE_PREFIX + 'shipping')) this.set('shipping', DEFAULT_SHIPPING);
      if (!localStorage.getItem(STORAGE_PREFIX + 'settings')) this.set('settings', DEFAULT_SETTINGS);
      if (!localStorage.getItem(STORAGE_PREFIX + 'content')) this.set('content', DEFAULT_CONTENT);
      if (!localStorage.getItem(STORAGE_PREFIX + 'sizeGuides')) this.set('sizeGuides', DEFAULT_SIZE_GUIDES);
    }

    if (isOnlineEnv) {
      this.syncWithBackend();
    }
  },

  // ── Products ──
  getProducts() {
    const list = this.get('products', null);
    if (list === null) {
      return this.hasBackend ? [] : DEFAULT_PRODUCTS;
    }
    if (Array.isArray(list) && list.some(p => p.sortOrder !== undefined)) {
      return [...list].sort((a, b) => (Number(a.sortOrder) || 9999) - (Number(b.sortOrder) || 9999));
    }
    return list || [];
  },
  async saveProduct(pData, editId) {
    let prods = this.getProducts();
    let savedProd = null;

    if (editId) {
      const idx = prods.findIndex(x => x.id == editId);
      if (idx !== -1) {
        prods[idx] = { ...prods[idx], ...pData, id: Number(editId) };
        savedProd = prods[idx];
      }
    } else {
      const newId = prods.length ? Math.max(...prods.map(p => p.id)) + 1 : 1;
      const nextSortOrder = prods.length ? Math.max(...prods.map(p => Number(p.sortOrder) || 0)) + 1 : 1;
      savedProd = { id: newId, sortOrder: nextSortOrder, ...pData, active: true };
      prods.push(savedProd);
    }

    this.set('products', prods);

    // Always push FULL products array to server so all Lambdas/devices see it
    if (this.isOnline()) {
      try {
        await this.fetchApi('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prods)
        });
      } catch(e) {
        console.error('Failed to save products to backend:', e);
      }
    }
    return savedProd;
  },

  async saveProductOrder(newProds) {
    newProds.forEach((p, idx) => {
      p.sortOrder = idx + 1;
    });
    this.set('products', newProds);

    if (this.isOnline()) {
      try {
        await this.fetchApi('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProds)
        });
      } catch(e) {
        console.error('Failed to sync reordered products:', e);
      }
    }
    return newProds;
  },

  async deleteProduct(id) {
    let prods = this.getProducts();
    prods = prods.filter(x => x.id != id);
    // Re-index remaining products sortOrder
    prods.forEach((p, idx) => {
      p.sortOrder = idx + 1;
    });
    this.set('products', prods);

    // Push full updated array to server
    if (this.isOnline()) {
      try {
        await this.fetchApi('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prods)
        });
      } catch(e) {
        console.error('Failed to delete product on backend:', e);
      }
    }
  },

  // ── Orders ──
  getOrders() { return this.get('orders', DEFAULT_ORDERS); },
  async addOrder(order) {
    const list = this.getOrders();
    list.unshift(order);
    this.set('orders', list);

    // Decrement local product stock
    const prods = this.getProducts();
    if (order.items && order.items.length) {
      order.items.forEach(item => {
        const p = prods.find(x => x.id === item.id);
        if (p && p.sizes && p.sizes[item.size] !== undefined) {
          p.sizes[item.size] = Math.max(0, p.sizes[item.size] - item.qty);
        }
      });
      this.set('products', prods);
    }

    // Push full data to server so all devices/Lambdas stay in sync
    if (this.isOnline()) {
      try {
        await this.fetchApi('/api/neon-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orders: list, products: prods })
        });
      } catch(e) {
        console.error('Failed to sync order to server:', e);
      }
    }
    return order;
  },

  async updateOrderStatus(id, newStatus) {
    let orders = this.getOrders();
    const o = orders.find(x => x.id == id);
    if (o) {
      o.status = newStatus;
      this.set('orders', orders);

      if (this.isOnline()) {
        try {
          await this.fetchApi('/api/orders', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orders)
          });
        } catch(e) {
          console.error(e);
        }
      }
    }
  },

  async deleteOrder(id) {
    let orders = this.getOrders();
    orders = orders.filter(x => x.id != id);
    this.set('orders', orders);

    if (this.isOnline()) {
      try {
        await this.fetchApi('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orders)
        });
      } catch(e) {
        console.error(e);
      }
    }
  },

  // ── Promo Codes ──
  getPromos() { return this.get('promos', DEFAULT_PROMOS); },
  async setPromos(pms) {
    this.set('promos', pms);
    if (this.isOnline()) {
      try {
        await this.fetchApi('/api/promos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pms)
        });
      } catch(e) {
        console.error(e);
      }
    }
  },

  // ── Shipping ──
  getShipping() { return this.get('shipping', DEFAULT_SHIPPING); },
  async setShipping(shp) {
    this.set('shipping', shp);
    if (this.isOnline()) {
      try {
        await this.fetchApi('/api/shipping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shp)
        });
      } catch(e) {
        console.error(e);
      }
    }
  },

  // ── Settings (including Meta Pixel & Social Links) ──
  getSettings() { return this.get('settings', DEFAULT_SETTINGS); },
  async setSettings(stg) {
    this.set('settings', stg);
    if (this.isOnline()) {
      try {
        // Push settings + content together for full state persistence
        await this.fetchApi('/api/neon-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            settings: stg,
            content: this.getContent(),
            promos: this.getPromos(),
            shipping: this.getShipping(),
            sizeGuides: this.getSizeGuides()
          })
        });
      } catch(e) {
        console.error(e);
      }
    }
  },

  // ── Content & Storefront Texts ──
  getContent() { return this.get('content', DEFAULT_CONTENT); },
  async setContent(cnt) {
    this.set('content', cnt);
    if (this.isOnline()) {
      try {
        await this.fetchApi('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cnt)
        });
      } catch(e) {
        console.error(e);
      }
    }
  },

  // ── Size Guides ──
  getSizeGuides() { return this.get('sizeGuides', DEFAULT_SIZE_GUIDES); },
  async setSizeGuides(sg) {
    this.set('sizeGuides', sg);
    if (this.isOnline()) {
      try {
        await this.fetchApi('/api/size-guides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sg)
        });
      } catch(e) {
        console.error(e);
      }
    }
  },

  // ── Admin Authentication ──
  isAdminLoggedIn() {
    return sessionStorage.getItem('twentyone_admin_logged') === 'true' ||
           localStorage.getItem('twentyone_admin_remember') === 'true';
  },
  async loginAdmin(username, password, remember = false) {
    username = (username || '').trim();
    password = (password || '').trim();

    if (this.hasBackend) {
      try {
        const res = await this.fetchApi('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (res.ok) {
          sessionStorage.setItem('twentyone_admin_logged', 'true');
          sessionStorage.setItem('twentyone_admin_user', username);
          if (remember) localStorage.setItem('twentyone_admin_remember', 'true');
          return { success: true };
        } else {
          const err = await res.json().catch(() => ({}));
          return { success: false, error: err.error || 'Invalid credentials' };
        }
      } catch(e) {}
    }

    // Local validation
    const stg = this.getSettings();
    const validUser = (stg && stg.adminUser) || 'admin';
    const validPass = (stg && stg.adminPass) || 'twenty21';

    if (username === validUser && password === validPass) {
      sessionStorage.setItem('twentyone_admin_logged', 'true');
      sessionStorage.setItem('twentyone_admin_user', username);
      if (remember) localStorage.setItem('twentyone_admin_remember', 'true');
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  },
  logoutAdmin() {
    sessionStorage.removeItem('twentyone_admin_logged');
    sessionStorage.removeItem('twentyone_admin_user');
    localStorage.removeItem('twentyone_admin_remember');
  },

  getProductCategory(product) {
    return (product && product.category === 'sweatpants') ? 'sweatpants' : 'hoodies';
  },

  getProductSizeKeys(product) {
    if (product && product.sizes && typeof product.sizes === 'object') {
      const keys = Object.keys(product.sizes);
      if (keys.length) return keys;
    }
    return ['S', 'M', 'L', 'XL', 'XXL'];
  },

  calculateRecommendedSize(type, opts = {}) {
    const isBottom = type === 'bottom' || type === 'sweatpants';
    const guides = this.getSizeGuides() || DEFAULT_SIZE_GUIDES;
    const guide = (isBottom ? guides.bottom : guides.top) || DEFAULT_SIZE_GUIDES[isBottom ? 'bottom' : 'top'];
    const rows = (guide && Array.isArray(guide.rows) && guide.rows.length) ? guide.rows : DEFAULT_SIZE_GUIDES[isBottom ? 'bottom' : 'top'].rows;

    const h = Number(opts.heightCm) || 176;
    const w = Number(opts.weightKg) || 74;
    const waistInput = Number(opts.waistCm) || 0;
    const fitPref = opts.fitPref || (isBottom ? 'relaxed' : 'oversized');
    const availableSizes = Array.isArray(opts.availableSizes) && opts.availableSizes.length ? opts.availableSizes : null;
    const stdOrder = ['S', 'M', 'L', 'XL', 'XXL'];

    let idx = 2; // L default
    let reasonAr = '';
    let reasonEn = '';

    if (isBottom) {
      // Estimate waist in cm from height/weight if user didn't enter exact waist cm
      const estWaistCm = waistInput > 45 ? waistInput : Math.round(62 + (w - 50) * 0.62 - Math.max(0, (h - 175) * 0.15));
      // Parse guide bottom waist max bounds e.g. "72 - 78"
      idx = rows.findIndex(r => {
        const nums = String(r.waist || '').match(/\d+/g);
        const maxW = nums && nums.length ? Number(nums[nums.length - 1]) : 0;
        return maxW > 0 && estWaistCm <= maxW;
      });
      if (idx === -1) idx = rows.length - 1;

      // Length check for tall customers (Sweatpants length in guide.rows)
      const matchedLen = Number(String((rows[idx] && rows[idx].length) || '').match(/\d+/)?.[0]) || 104;
      const targetMinLen = Math.round(h * 0.575);
      let lengthBumped = false;
      if (h >= 180 && matchedLen < targetMinLen && idx < rows.length - 1) {
        idx += 1;
        lengthBumped = true;
      }
      if (fitPref === 'baggy' && idx < rows.length - 1 && (waistInput ? (waistInput % 6 >= 4) : w >= 72)) {
        idx += 1;
      } else if (fitPref === 'fitted' && idx > 0 && waistInput && waistInput <= 76) {
        idx -= 1;
      }

      const row = rows[Math.min(idx, rows.length - 1)] || rows[0];
      let recSize = row.size || stdOrder[idx] || 'L';

      // If product uses numeric waist sizes (e.g. 28, 30, 32, 34, 36, 38)
      if (availableSizes && availableSizes.every(k => /^\d+$/.test(String(k).trim()))) {
        const targetInches = Math.round(estWaistCm / 2.54) + (fitPref === 'baggy' ? 1 : 0);
        let bestNum = availableSizes[0];
        let bestDiff = Infinity;
        availableSizes.forEach(s => {
          const diff = Math.abs(Number(s) - targetInches);
          if (diff < bestDiff) { bestDiff = diff; bestNum = s; }
        });
        recSize = bestNum;
      } else if (availableSizes && !availableSizes.includes(recSize)) {
        recSize = availableSizes[Math.min(idx, availableSizes.length - 1)] || availableSizes[0];
      }

      const waistLabel = waistInput > 45 ? `${waistInput} cm` : `~${estWaistCm} cm (تقديري)`;
      reasonAr = `بناءً على مقاس الوسط (${waistLabel}) والطول (${h} سم)${lengthBumped ? ' مع مراعاة طول البنطلون المناسب' : ''}: وسط ${row.waist || '-'} سم • طول ${row.length || '-'} سم • فتحة الرجل ${row.legOpening || '-'} سم.`;
      reasonEn = `Matched for waist ${waistLabel} & height ${h}cm: Waist ${row.waist || '-'} cm · Length ${row.length || '-'} cm · Opening ${row.legOpening || '-'} cm.`;
      return { type: 'bottom', recommendedSize: recSize, matchedRow: row, estWaistCm, reasonAr, reasonEn };
    } else {
      // Hoodies / Top upper-body score
      let score = 0;
      if (w < 63 && h < 173) score = 0;
      else if (w < 73 && h < 179) score = 1;
      else if (w < 84 && h < 185) score = 2;
      else if (w < 96) score = 3;
      else score = 4;

      if (fitPref === 'oversized' && w >= 68 && score < rows.length - 1) score = Math.min(rows.length - 1, score);
      if (fitPref === 'fitted' && score > 0) score -= 1;

      idx = Math.min(Math.max(0, score), rows.length - 1);
      const row = rows[idx] || rows[0];
      let recSize = row.size || stdOrder[idx] || 'L';
      if (availableSizes && !availableSizes.includes(recSize)) {
        recSize = availableSizes[Math.min(idx, availableSizes.length - 1)] || availableSizes[0];
      }

      reasonAr = `بناءً على الطول (${h} سم) والوزن (${w} كجم): عرض الصدر ${row.chest || '-'} سم • الطول ${row.length || '-'} سم • الكتف ${row.shoulders || '-'} سم.`;
      reasonEn = `Matched for ${h}cm / ${w}kg: Chest ${row.chest || '-'} cm · Length ${row.length || '-'} cm · Shoulders ${row.shoulders || '-'} cm.`;
      return { type: 'top', recommendedSize: recSize, matchedRow: row, reasonAr, reasonEn };
    }
  },

  generateGarmentSvg(category, mainColor, accentColor) {
    if (category === 'sweatpants') {
      return `
        <svg class="hoodie-artwork" viewBox="0 0 260 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="spGrad_${mainColor.replace('#','')}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${mainColor}" />
              <stop offset="100%" stop-color="${accentColor}" />
            </linearGradient>
          </defs>
          <path d="M84 36 C95 31 165 31 176 36 L186 88 L200 242 L152 246 L132 126 L128 126 L108 246 L60 242 L74 88 Z"
                fill="url(#spGrad_${mainColor.replace('#','')})" stroke="rgba(255,255,255,0.16)" stroke-width="2" />
          <path d="M84 36 C108 42 152 42 176 36 L178 52 C152 57 108 57 82 52 Z"
                fill="rgba(0,0,0,0.28)" stroke="rgba(255,255,255,0.14)" stroke-width="1.2" />
          <path d="M123 48 C120 66 117 78 119 88 M137 48 C140 66 143 78 141 88"
                stroke="rgba(232,227,216,0.55)" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M77 82 Q92 98 90 120 M183 82 Q168 98 170 120"
                stroke="rgba(255,255,255,0.14)" stroke-width="1.3" stroke-linecap="round"/>
          <path d="M62 232 L106 236 M154 236 L198 232" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
          <text x="150" y="102" text-anchor="middle" fill="rgba(232,227,216,0.22)" font-family="Playfair Display, serif" font-size="11" letter-spacing="2">21</text>
        </svg>
      `;
    }
    return `
      <svg class="hoodie-artwork" viewBox="0 0 260 280" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hgGrad_${mainColor.replace('#','')}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${mainColor}" />
            <stop offset="100%" stop-color="${accentColor}" />
          </linearGradient>
        </defs>
        <path d="M80 65 L40 90 L22 180 L48 188 L64 118 L64 235 C64 242 70 245 78 245 L182 245 C190 245 196 242 196 235 L196 118 L212 188 L238 180 L220 90 L180 65 C170 40 150 28 130 28 C110 28 90 40 80 65 Z" 
              fill="url(#hgGrad_${mainColor.replace('#','')})" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
        <path d="M90 65 C100 85 160 85 170 65 C160 40 145 30 130 30 C115 30 100 40 90 65 Z" 
              fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
        <path d="M115 76 L112 120 M145 76 L148 120" stroke="rgba(232,227,216,0.5)" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M88 180 L172 180 L182 225 L78 225 Z" fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
        <text x="130" y="145" text-anchor="middle" fill="rgba(232,227,216,0.18)" font-family="Playfair Display, serif" font-size="22" letter-spacing="4">21</text>
      </svg>
    `;
  }
};

StoreDB.init();
if (typeof window !== 'undefined') {
  window.StoreDB = StoreDB;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StoreDB;
}
