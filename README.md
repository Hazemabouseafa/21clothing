# 21 — TWENTY ONE CLOTHING 🖤
> Premium Egyptian Streetwear E-Commerce & Brand Control Panel

A sleek, luxury single-page e-commerce store and complete brand management console built for Cairo-based streetwear label **21 (Twenty One Clothing)**.

---

## ⚡ Key Features

* **Streetwear Aesthetic:** Minimalist dark mode (`#080808`), mouse parallax, custom lagging ring cursor, fluid typography (`Playfair Display` + `Inter`).
* **Interactive Hoodie Catalog:** Real-time stock per size (`S`, `M`, `L`, `XL`, `XXL`), color switching, vector artwork previews.
* **Egyptian Checkout:** Cash on Delivery (COD), Instapay, Vodafone Cash, dynamic shipping fee calculation by Egyptian governorate.
* **WhatsApp Order Integration:** 1-click order confirmation via WhatsApp with pre-filled order slip.
* **Brand Control Panel (`/admin`):**
  * Real-time KPIs (Revenue in EGP, Orders count, Stock levels, AOV).
  * Products manager (Add, Edit, Stock, Delete).
  * Orders fulfillment with packing slip printing.
  * Store Texts & Content live editor.
  * Promo codes & regional shipping rates.
  * **Meta Pixel (Facebook Ads):** Integrated tracking (`PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`).
  * Bilingual interface (Arabic RTL & English).
* **Database Support:**
  * **Neon Serverless Postgres** when deployed to Vercel (`DATABASE_URL`).
  * Local JSON storage fallback for zero-setup offline development.

---

## 🚀 Deployment to Vercel

1. Import this repository (`21clothing`) into [Vercel](https://vercel.com).
2. Create a free serverless Postgres database on [Neon](https://neon.tech).
3. In your Vercel Project Settings under **Environment Variables**, add:
   * **Key:** `DATABASE_URL`
   * **Value:** Your Neon connection string (e.g. `postgresql://user:pass@ep-cool-project.us-east-2.aws.neon.tech/neondb?sslmode=require`)
4. Click **Deploy**. Vercel will automatically build and launch your store!

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local server on port 2026
npm start
```

* Storefront: `http://localhost:2026`
* Admin Panel: `http://localhost:2026/admin`
