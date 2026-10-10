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
  storyEyebrow: "The Philosophy",
  storyTitle: "Built for the\nstreets of Cairo.",
  storyParagraph1: "Twenty One was born out of an obsession with the uncompromising hoodie. Engineered with ultra-heavyweight 450 GSM Egyptian combed cotton, bespoke garment dye, and an architectural drop-shoulder cut.",
  storyParagraph2: "No loud noise. No oversized slogans. Just silhouette and weight that speak.",
  footerDesc: "Cairo, Egypt\nIndependent Streetwear Label.\nDesigned and crafted locally.",
  footerCopyright: "© 2026 Twenty One Clothing. All Rights Reserved."
};

const StoreDB = {
  hasBackend: false,

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
    try {
      const v = localStorage.getItem(STORAGE_PREFIX + key);
      return v ? JSON.parse(v) : fallback;
    } catch(e) {
      return fallback;
    }
  },

  set(key, val) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('storedb_change', { detail: { key, val } }));
      }
    } catch(e) {
      console.error(e);
    }
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

      // ── 1. Smart Products Bidirectional Sync ──
      if (pRes.status === 'fulfilled' && pRes.value.ok) {
        anySuccess = true;
        const remoteProducts = await pRes.value.json();
        const localProducts = this.get('products', []);

        if (Array.isArray(remoteProducts)) {
          const productMap = new Map();
          // Seed remote items
          remoteProducts.forEach(p => {
            if (p && p.id) productMap.set(Number(p.id), p);
          });

          // Reconcile local items
          let hasLocalNewItems = false;
          if (Array.isArray(localProducts)) {
            localProducts.forEach(lp => {
              if (lp && lp.id) {
                const numId = Number(lp.id);
                if (!productMap.has(numId)) {
                  productMap.set(numId, lp);
                  hasLocalNewItems = true;
                } else {
                  const rem = productMap.get(numId);
                  // Merge local colorVariants or custom edits if remote is less detailed
                  if (lp.colorVariants && lp.colorVariants.length && (!rem.colorVariants || !rem.colorVariants.length)) {
                    productMap.set(numId, { ...rem, ...lp });
                    hasLocalNewItems = true;
                  }
                }
              }
            });
          }

          const mergedProducts = Array.from(productMap.values()).sort((a, b) => (Number(a.sortOrder) || 9999) - (Number(b.sortOrder) || 9999));
          this.set('products', mergedProducts);

          // If local has items not yet on the server, push to server so all devices sync up
          if (hasLocalNewItems && this.isOnline()) {
            console.log('[StoreDB] Automatically syncing local products to server...');
            this.saveProductOrder(mergedProducts).catch(() => {});
          }
        }
      }

      // ── 2. Orders Sync ──
      if (oRes.status === 'fulfilled' && oRes.value.ok) {
        anySuccess = true;
        const remoteOrders = await oRes.value.json();
        const localOrders = this.get('orders', []);
        if (Array.isArray(remoteOrders)) {
          const orderMap = new Map();
          remoteOrders.forEach(o => { if (o && o.id) orderMap.set(String(o.id), o); });
          if (Array.isArray(localOrders)) {
            localOrders.forEach(lo => {
              if (lo && lo.id && !orderMap.has(String(lo.id))) {
                orderMap.set(String(lo.id), lo);
              }
            });
          }
          this.set('orders', Array.from(orderMap.values()));
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

      // ── 5. Smart Settings Reconciler (Social Links, WhatsApp, Announcements) ──
      if (stRes.status === 'fulfilled' && stRes.value.ok) {
        anySuccess = true;
        const remoteSettings = await stRes.value.json() || {};
        const localSettings = this.get('settings', {}) || {};
        
        let settingsNeedSync = false;
        const mergedSettings = { ...remoteSettings, ...localSettings };

        // Ensure non-empty social links and phone numbers from either device are preserved
        ['instagram', 'tiktok', 'facebook', 'whatsapp', 'waNumber', 'announcement', 'showAnnouncement', 'metaPixel'].forEach(k => {
          if (localSettings[k] && String(localSettings[k]).trim() && (!remoteSettings[k] || !String(remoteSettings[k]).trim())) {
            mergedSettings[k] = String(localSettings[k]).trim();
            settingsNeedSync = true;
          } else if (remoteSettings[k] && String(remoteSettings[k]).trim()) {
            mergedSettings[k] = String(remoteSettings[k]).trim();
          }
        });

        this.set('settings', mergedSettings);

        if (settingsNeedSync && this.isOnline()) {
          console.log('[StoreDB] Automatically syncing local settings to server...');
          this.setSettings(mergedSettings).catch(() => {});
        }
      }

      // ── 6. Smart Content Reconciler (Texts, Hero, Story) ──
      if (cRes.status === 'fulfilled' && cRes.value.ok) {
        anySuccess = true;
        const remoteContent = await cRes.value.json() || {};
        const localContent = this.get('content', {}) || {};

        let contentNeedSync = false;
        const mergedContent = { ...remoteContent, ...localContent };

        Object.keys(localContent).forEach(k => {
          if (localContent[k] && localContent[k] !== DEFAULT_CONTENT[k] && (!remoteContent[k] || remoteContent[k] === DEFAULT_CONTENT[k])) {
            mergedContent[k] = localContent[k];
            contentNeedSync = true;
          }
        });

        this.set('content', mergedContent);

        if (contentNeedSync && this.isOnline()) {
          this.setContent(mergedContent).catch(() => {});
        }
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
    if (!localStorage.getItem(STORAGE_PREFIX + 'products')) this.set('products', DEFAULT_PRODUCTS);
    if (!localStorage.getItem(STORAGE_PREFIX + 'orders')) this.set('orders', DEFAULT_ORDERS);
    if (!localStorage.getItem(STORAGE_PREFIX + 'promos')) this.set('promos', DEFAULT_PROMOS);
    if (!localStorage.getItem(STORAGE_PREFIX + 'shipping')) this.set('shipping', DEFAULT_SHIPPING);
    if (!localStorage.getItem(STORAGE_PREFIX + 'settings')) this.set('settings', DEFAULT_SETTINGS);
    if (!localStorage.getItem(STORAGE_PREFIX + 'content')) this.set('content', DEFAULT_CONTENT);
    if (!localStorage.getItem(STORAGE_PREFIX + 'sizeGuides')) this.set('sizeGuides', DEFAULT_SIZE_GUIDES);

    if (window.location.protocol.startsWith('http')) {
      this.syncWithBackend();
    }
  },

  // ── Products ──
  getProducts() {
    const list = this.get('products', DEFAULT_PRODUCTS);
    if (Array.isArray(list) && list.some(p => p.sortOrder !== undefined)) {
      return [...list].sort((a, b) => (Number(a.sortOrder) || 9999) - (Number(b.sortOrder) || 9999));
    }
    return list;
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

    if (this.isOnline()) {
      try {
        if (editId) {
          await this.fetchApi(`/api/products/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(savedProd)
          });
        } else {
          await this.fetchApi('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(savedProd)
          });
        }
      } catch(e) {
        console.error('Failed to save product to backend:', e);
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

    if (this.isOnline()) {
      try {
        await this.fetchApi(`/api/products/${id}`, { method: 'DELETE' });
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

    if (this.isOnline()) {
      try {
        await this.fetchApi('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        });
      } catch(e) {
        console.error('Failed to post order to server:', e);
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
          await this.fetchApi(`/api/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
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
        await this.fetchApi(`/api/orders/${id}`, { method: 'DELETE' });
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
        await this.fetchApi('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stg)
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
  }
};

StoreDB.init();
if (typeof window !== 'undefined') {
  window.StoreDB = StoreDB;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StoreDB;
}
