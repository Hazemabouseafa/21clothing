/**
 * 21 — TWENTY ONE CLOTHING
 * Standard Defaults & Initial Seed Data for Neon Postgres & Local Storage
 */

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Midnight Drop Hoodie",
    price: 1250,
    originalPrice: 1450,
    badge: "New Drop",
    fit: "Oversized Fit 450 GSM",
    colorTheme: "black",
    colors: ["#0a0a0a", "#1a1a2e", "#2d1b1b"],
    svgFill: "#1c1c1c",
    accent: "#3a3a3a",
    sizes: { S: 8, M: 14, L: 20, XL: 12, XXL: 5 },
    desc: "100% Egyptian Cotton, ultra-dense 450 GSM French Terry, double-layered hood with brushed 21 insignia.",
    active: true,
    image: null,
    colorVariants: [
      {
        colorName: "Midnight Black",
        colorHex: "#0a0a0a",
        images: []
      }
    ]
  },
  {
    id: 2,
    name: "Ash Classic Hoodie",
    price: 1150,
    originalPrice: 1300,
    badge: "Bestseller",
    fit: "Relaxed Fit 420 GSM",
    colorTheme: "ash",
    colors: ["#666666", "#888888", "#444444"],
    svgFill: "#4a4a4a",
    accent: "#888888",
    sizes: { S: 12, M: 18, L: 15, XL: 10, XXL: 4 },
    desc: "Custom washed ash fleece with dropped shoulders, kangaroo pocket, and hidden cuff embroidery.",
    active: true,
    image: null,
    colorVariants: [
      {
        colorName: "Ash Heather",
        colorHex: "#666666",
        images: []
      }
    ]
  },
  {
    id: 3,
    name: "Stone Desert Oversized",
    price: 1350,
    originalPrice: 1600,
    badge: "Limited",
    fit: "Boxy Heavyweight 480 GSM",
    colorTheme: "stone",
    colors: ["#c8b89a", "#d4c5ae", "#e0d5c0"],
    svgFill: "#3d3530",
    accent: "#5a4f46",
    sizes: { S: 5, M: 9, L: 11, XL: 6, XXL: 2 },
    desc: "Earthy Egyptian desert hue, tailored boxy cut, ribbed hems with heavy raw cotton weight.",
    active: true,
    image: null,
    colorVariants: [
      {
        colorName: "Stone Desert",
        colorHex: "#c8b89a",
        images: []
      }
    ]
  },
  {
    id: 4,
    name: "Chalk Essential Hoodie",
    price: 1100,
    originalPrice: 1250,
    badge: "",
    fit: "Regular Streetwear 400 GSM",
    colorTheme: "chalk",
    colors: ["#e8e3d8", "#f0ece2", "#d4cfc4"],
    svgFill: "#6a6a6a",
    accent: "#999999",
    sizes: { S: 10, M: 15, L: 12, XL: 8, XXL: 4 },
    desc: "Clean off-white minimalism. Subtle tonal 21 screen-print, buttery soft brushed inner lining.",
    active: true,
    image: null,
    colorVariants: [
      {
        colorName: "Chalk Bone",
        colorHex: "#e8e3d8",
        images: []
      }
    ]
  },
  {
    id: 5,
    name: "Ink Heavyweight Zip-Up",
    price: 1450,
    originalPrice: 1700,
    badge: "New Drop",
    fit: "Heavy Zip 500 GSM",
    colorTheme: "ink",
    colors: ["#111111", "#1a1a1a", "#000000"],
    svgFill: "#2a2a2a",
    accent: "#555555",
    sizes: { S: 6, M: 12, L: 16, XL: 10, XXL: 3 },
    desc: "Double-way matte silver metal zipper, premium heavyweight Egyptian yarn, engineered box hood.",
    active: true,
    image: null,
    colorVariants: [
      {
        colorName: "Midnight Black",
        colorHex: "#111111",
        images: []
      }
    ]
  },
  {
    id: 6,
    name: "Fog Relaxed Hoodie",
    price: 1200,
    originalPrice: 1350,
    badge: "",
    fit: "Oversized Fit 420 GSM",
    colorTheme: "ash",
    colors: ["#b0aaa0", "#c0bab0", "#a0a09a"],
    svgFill: "#3d3d3d",
    accent: "#666666",
    sizes: { S: 9, M: 14, L: 17, XL: 7, XXL: 3 },
    desc: "Subtle muted fog tone, seamless shoulder drop, vintage garment dyed finish.",
    active: true,
    image: null,
    colorVariants: [
      {
        colorName: "Ash Heather",
        colorHex: "#b0aaa0",
        images: []
      }
    ]
  },
  {
    id: 7,
    name: "Onyx Acid Wash Hoodie",
    price: 1399,
    originalPrice: 1599,
    badge: "Limited",
    fit: "Boxy Fit 460 GSM",
    colorTheme: "black",
    colors: ["#1c1c1c", "#2d2d2d"],
    sizes: { S: 5, M: 10, L: 15, XL: 8, XXL: 4 },
    desc: "Vintage acid wash finish, custom heavy ribbing, dropped shoulders.",
    active: true,
    image: null,
    colorVariants: [
      {
        colorName: "Midnight Black",
        colorHex: "#1c1c1c",
        images: []
      }
    ]
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
      {
        id: 1,
        name: "Midnight Drop Hoodie",
        size: "L",
        color: "#0a0a0a",
        qty: 1,
        price: 1250
      }
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
      {
        id: 3,
        name: "Stone Desert Oversized",
        size: "M",
        color: "#c8b89a",
        qty: 1,
        price: 1350
      },
      {
        id: 4,
        name: "Chalk Essential Hoodie",
        size: "S",
        color: "#e8e3d8",
        qty: 1,
        price: 1100
      }
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
      {
        id: 5,
        name: "Ink Heavyweight Zip-Up",
        size: "XL",
        color: "#111111",
        qty: 1,
        price: 1450
      }
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
  {
    code: "TWENTY21",
    type: "percentage",
    value: 10,
    min: 1000,
    used: 24,
    active: true
  },
  {
    code: "CAIRODROP",
    type: "fixed",
    value: 150,
    min: 1500,
    used: 12,
    active: true
  },
  {
    code: "FREESHIP",
    type: "fixed",
    value: 50,
    min: 2000,
    used: 8,
    active: true
  }
];

const DEFAULT_SHIPPING = {
  cairo: 50,
  alex: 65,
  delta: 70,
  upperEgypt: 85,
  freeThreshold: 2500
};

const DEFAULT_SETTINGS = {
  storeStatus: "open",
  metaPixel: "",
  announcement: "FREE SHIPPING ON ORDERS OVER 2,500 EGP | CASH ON DELIVERY ACROSS EGYPT",
  waNumber: "201012345678",
  showAnnouncement: "true",
  adminUser: "admin",
  adminPass: "twenty21"
};

const DEFAULT_SIZE_GUIDES = {
  top: {
    id: "top",
    name: "Hoodies & Shirts Size Guide (دليل مقاسات الهوديز والتيشرتات)",
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
    fitNotes: "Model is 182 cm (78 kg) wearing Large for an oversized streetwear look. Choose normal size for oversize, or size down for standard fit."
  },
  bottom: {
    id: "bottom",
    name: "Pantalon & Sweatpants Size Guide (دليل مقاسات البنطلون)",
    type: "pantalon",
    description: "Straight leg relaxed cut with elastic waist drawstring. Measurements in Centimeters (cm).",
    unit: "cm",
    columns: ["Size", "Waist (الوسط)", "Length (الطول)", "Thigh (الفخذ)", "Leg Opening (فتحة الرجل)"],
    rows: [
      { size: "S", waist: "72 - 78", length: "100", thigh: "62", legOpening: "22" },
      { size: "M", waist: "78 - 84", length: "103", thigh: "65", legOpening: "23" },
      { size: "L", waist: "84 - 90", length: "105", thigh: "68", legOpening: "24" },
      { size: "XL", waist: "90 - 96", length: "107", thigh: "71", legOpening: "25" },
      { size: "XXL", waist: "96 - 104", length: "109", thigh: "74", legOpening: "26" }
    ],
    fitNotes: "Elastic waist band provides generous flex. Order based on your usual waist sizing."
  }
};

const DEFAULT_CONTENT = {
  announcement: "FREE SHIPPING ON ORDERS OVER 2,500 EGP | CASH ON DELIVERY ACROSS EGYPT",
  heroTagline: "Premium Egyptian Streetwear - Limited Drop 001",
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

module.exports = {
  DEFAULT_PRODUCTS,
  DEFAULT_ORDERS,
  DEFAULT_PROMOS,
  DEFAULT_SHIPPING,
  DEFAULT_SETTINGS,
  DEFAULT_CONTENT,
  DEFAULT_SIZE_GUIDES,
  DEFAULTS: {
    products: DEFAULT_PRODUCTS,
    orders: DEFAULT_ORDERS,
    promos: DEFAULT_PROMOS,
    shipping: DEFAULT_SHIPPING,
    settings: DEFAULT_SETTINGS,
    content: DEFAULT_CONTENT,
    sizeGuides: DEFAULT_SIZE_GUIDES
  }
};
