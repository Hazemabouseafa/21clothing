const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DATA_DIR } = require('./db');

const IS_VERCEL = Boolean(process.env.VERCEL);
const USE_DISK_MEDIA = !IS_VERCEL;
const MEDIA_DIR = path.join(DATA_DIR, 'media');

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg'
};

const EXT_TO_MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml'
};

const MAX_RAM_CACHE_BYTES = 64 * 1024 * 1024;
const MAX_RAM_CACHE_ITEMS = 250;
const mediaRamCache = new Map();
let mediaRamBytes = 0;

let productsProjectionCache = null;
let hydratingPromise = null;

function ensureMediaDir() {
  if (!USE_DISK_MEDIA) return false;
  try {
    if (!fs.existsSync(MEDIA_DIR)) {
      fs.mkdirSync(MEDIA_DIR, { recursive: true });
    }
    return true;
  } catch (e) {
    return false;
  }
}

function cacheMediaEntry(filename, buffer, mime) {
  if (!filename || !Buffer.isBuffer(buffer)) return null;
  if (mediaRamCache.has(filename)) {
    const existing = mediaRamCache.get(filename);
    mediaRamCache.delete(filename);
    mediaRamCache.set(filename, existing);
    return existing;
  }

  const hash = filename.split('.')[0];
  const entry = {
    filename,
    buffer,
    mime: mime || EXT_TO_MIME[path.extname(filename).toLowerCase()] || 'application/octet-stream',
    etag: `"${hash}"`,
    size: buffer.length
  };

  if (buffer.length <= 8 * 1024 * 1024) {
    while (
      (mediaRamBytes + buffer.length > MAX_RAM_CACHE_BYTES || mediaRamCache.size >= MAX_RAM_CACHE_ITEMS) &&
      mediaRamCache.size > 0
    ) {
      const oldestKey = mediaRamCache.keys().next().value;
      const oldestVal = mediaRamCache.get(oldestKey);
      mediaRamBytes -= oldestVal ? oldestVal.size : 0;
      mediaRamCache.delete(oldestKey);
    }
    mediaRamCache.set(filename, entry);
    mediaRamBytes += buffer.length;
  }

  return entry;
}

function saveDataUrlToMedia(dataUrl, { force = false } = {}) {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }
  if (!USE_DISK_MEDIA && !force) {
    return dataUrl;
  }

  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/);
  if (!match) return dataUrl;

  const mime = match[1].toLowerCase();
  const ext = MIME_TO_EXT[mime] || 'jpg';
  let buffer;
  try {
    buffer = Buffer.from(match[2], 'base64');
  } catch (e) {
    return dataUrl;
  }
  if (!buffer || buffer.length === 0) return dataUrl;

  const hash = crypto.createHash('sha1').update(buffer).digest('hex').slice(0, 16);
  const filename = `${hash}.${ext}`;

  cacheMediaEntry(filename, buffer, mime);

  if (ensureMediaDir()) {
    const targetPath = path.join(MEDIA_DIR, filename);
    try {
      if (!fs.existsSync(targetPath)) {
        const tmpPath = `${targetPath}.${process.pid}.${Date.now()}.tmp`;
        fs.writeFileSync(tmpPath, buffer);
        fs.renameSync(tmpPath, targetPath);
      }
    } catch (e) {
      // Fallback: RAM cache keeps serving even if disk mount has permission issues
    }
  }

  return `/media/${filename}`;
}

function projectSingleProductMedia(product, opts = {}) {
  if (!product || typeof product !== 'object') return product;
  if (!USE_DISK_MEDIA && !opts.force) return product;

  let changed = false;
  const next = { ...product };

  if (typeof next.image === 'string' && next.image.startsWith('data:image/')) {
    const mapped = saveDataUrlToMedia(next.image, opts);
    if (mapped !== next.image) {
      next.image = mapped;
      changed = true;
    }
  }

  if (Array.isArray(next.colorVariants)) {
    next.colorVariants = next.colorVariants.map(variant => {
      if (!variant || typeof variant !== 'object') return variant;
      if (!Array.isArray(variant.images)) return variant;
      let varChanged = false;
      const mappedImages = variant.images.map(img => {
        const mapped = saveDataUrlToMedia(img, opts);
        if (mapped !== img) varChanged = true;
        return mapped;
      });
      if (!varChanged) return variant;
      changed = true;
      return { ...variant, images: mappedImages };
    });
  }

  return changed ? next : product;
}

function externalizeProductsMedia(products, opts = {}) {
  if (!Array.isArray(products)) return products;
  if (!USE_DISK_MEDIA && !opts.force) return products;
  return products.map(p => projectSingleProductMedia(p, opts));
}

function getCachedProjectedProducts(rawProducts) {
  if (!Array.isArray(rawProducts)) return rawProducts;
  if (!USE_DISK_MEDIA) return rawProducts;
  if (productsProjectionCache && productsProjectionCache.sourceRef === rawProducts) {
    return productsProjectionCache.projected;
  }
  const projected = externalizeProductsMedia(rawProducts);
  productsProjectionCache = { sourceRef: rawProducts, projected };
  return projected;
}

function invalidateProductsProjectionCache() {
  productsProjectionCache = null;
}

async function hydrateMediaFromProducts(getProductsFn) {
  if (!USE_DISK_MEDIA || typeof getProductsFn !== 'function') return;
  if (hydratingPromise) return hydratingPromise;
  hydratingPromise = (async () => {
    try {
      const products = await getProductsFn();
      if (Array.isArray(products)) {
        getCachedProjectedProducts(products);
      }
    } catch (e) {
      // Ignore background hydration errors
    } finally {
      hydratingPromise = null;
    }
  })();
  return hydratingPromise;
}

async function getMediaEntry(filename, getProductsFn) {
  if (!filename || typeof filename !== 'string') return null;
  const safeName = path.basename(filename);
  if (!/^[a-f0-9]{8,40}\.(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(safeName)) {
    return null;
  }

  if (mediaRamCache.has(safeName)) {
    const cached = mediaRamCache.get(safeName);
    mediaRamCache.delete(safeName);
    mediaRamCache.set(safeName, cached);
    return cached;
  }

  const diskPath = path.join(MEDIA_DIR, safeName);
  if (USE_DISK_MEDIA && fs.existsSync(diskPath)) {
    try {
      const buf = fs.readFileSync(diskPath);
      const mime = EXT_TO_MIME[path.extname(safeName).toLowerCase()] || 'application/octet-stream';
      return cacheMediaEntry(safeName, buf, mime);
    } catch (e) {}
  }

  if (typeof getProductsFn === 'function') {
    await hydrateMediaFromProducts(getProductsFn);
    if (mediaRamCache.has(safeName)) {
      return mediaRamCache.get(safeName);
    }
    if (USE_DISK_MEDIA && fs.existsSync(diskPath)) {
      try {
        const buf = fs.readFileSync(diskPath);
        const mime = EXT_TO_MIME[path.extname(safeName).toLowerCase()] || 'application/octet-stream';
        return cacheMediaEntry(safeName, buf, mime);
      } catch (e) {}
    }
  }

  return null;
}

module.exports = {
  USE_DISK_MEDIA,
  MEDIA_DIR,
  saveDataUrlToMedia,
  projectSingleProductMedia,
  externalizeProductsMedia,
  getCachedProjectedProducts,
  invalidateProductsProjectionCache,
  hydrateMediaFromProducts,
  getMediaEntry
};
