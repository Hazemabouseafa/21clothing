# 21 — TWENTY ONE CLOTHING 🖤
> Premium Egyptian Streetwear E-Commerce & Brand Control Panel
> Designed for Cairo, Egypt | Ready for **Vercel** + **Neon Serverless Postgres**

A luxury streetwear e-commerce platform and brand management console built for Cairo-based fashion label **21 (Twenty One Clothing)**.

---

## ⚡ Key Architecture & Features

* **Streetwear Aesthetic:** Minimalist dark luxury (`#080808`), cursor tracking, fluid typography, smooth animations.
* **Interactive Hoodie Catalog:** Real-time stock per size (`S`, `M`, `L`, `XL`, `XXL`), multi-color variants with dedicated photo galleries for each color.
* **Egyptian Checkout:** Cash on Delivery (COD), Instapay, Vodafone Cash, dynamic shipping fees by governorate.
* **WhatsApp Order Integration:** 1-click customer order confirmation via WhatsApp with formatted order slips.
* **Brand Control Panel (`/admin`):**
  * Real-time KPIs (Total Revenue, Orders, Inventory, AOV).
  * In-page Hoodie Manager (Add, Edit, Sizes Stock, Colors & Galleries).
  * Orders fulfillment with packing slip printing and CSV export.
  * Live Storefront Texts & Content Customizer.
  * Promo codes & regional shipping rates.
  * **Meta Pixel (Facebook/Instagram Ads):** Tracks `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`.
  * Live Neon Database Status indicator in the Settings panel.
  * Bilingual interface (Arabic RTL & English).
* **Database Layer:**
  * **Neon Serverless Postgres (`21clothing`)**: Ultra-fast serverless PostgreSQL with JSONB storage and automatic table initialization.
  * **Local Storage Fallback**: Graceful fallback to local JSON storage for development.

---

## 🚀 Deployment to Vercel with Neon Database (`21clothing`)

### Step 1: Create the Database on Neon
1. Go to [Neon Console](https://console.neon.tech).
2. Create a new project or navigate to your existing project.
3. In the sidebar under **Databases**, create a database named:
   ```
   21clothing
   ```
4. Click **Connect** (or Dashboard) and copy the **Connection String (URI)**.
   Ensure the database name in the URI is `21clothing`:
   ```text
   postgresql://[user]:[password]@[endpoint].neon.tech/21clothing?sslmode=require
   ```

### Step 2: Test Connection Locally (Optional)
Create a `.env` file in the root folder:
```bash
DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/21clothing?sslmode=require"
```
Run the diagnostic check:
```bash
npm run db:test
```
You will see:
`✅ SUCCESS: Connected to Neon Serverless Postgres!`

### Step 3: Deploy to Vercel
1. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Select your repository: `Hazemabouseafa/21clothing`.
3. Under **Environment Variables**, add:
   * **Key:** `DATABASE_URL`
   * **Value:** Your Neon connection string (e.g. `postgresql://.../21clothing?sslmode=require`)
4. Click **Deploy**.

> [!NOTE]
> **Zero Migration Required:** When you deploy and open the store, the table `store_data` and all 7 default hoodies, shipping rates, and content will be created and seeded automatically in your Neon database!

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Test database connection (if .env is configured)
npm run db:test

# 3. Start local development server on port 2026
npm start
```

* **Storefront:** `http://localhost:2026`
* **Brand Console:** `http://localhost:2026/admin`
* **API Health Check:** `http://localhost:2026/api/status`

---

## 🗄️ Database Schema & SQL Queries

The database table `store_data` is defined in [`schema.sql`](file:///schema.sql).
You can run diagnostic queries directly in the Neon SQL Editor:

```sql
-- View all store data categories
SELECT key, updated_at FROM store_data;

-- View all hoodies
SELECT jsonb_pretty(data) FROM store_data WHERE key = 'products';

-- View customer orders
SELECT jsonb_pretty(data) FROM store_data WHERE key = 'orders';
```

---

## 📄 License
MIT © Hazem Abouseafa — 21 Clothing
