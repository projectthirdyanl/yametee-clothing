# Yametee E‑Commerce MVP – Technical Spec

Brand: **Yametee (Yame‑Tee)** – Anime‑inspired Japanese streetwear T‑shirts

Color Palette: **Black (#000000) · Red (#E50914) · White (#FFFFFF)**

---

## 1. Overall Goal

Build a **standalone e‑commerce website** (mini‑Shopify) for Yametee that:

- Uses your **own domain and branding**
- Is **easy to manage** (simple admin to upload products)
- Supports **sizes & colors** for each shirt
- Accepts **GCash (via PayMongo)** and other local payment methods
- Can eventually integrate with **TikTok** (Pixel + TikTok Shop API in the future)
- Runs on your existing **Proxmox + PostgreSQL** setup (enterprise‑grade ready)

---

## 2. Tech Stack

### 2.1 Frontend + Backend

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **UI:** Custom components + simple admin UI
- **Runtime:** Node.js (served via Docker on Proxmox)

### 2.2 Database & ORM

- **Database:** PostgreSQL (existing instance on Proxmox)
- **ORM:** Prisma
  - Handles schema
  - Migrations
  - Type‑safe queries

### 2.3 Payments

- **Gateway:** PayMongo
- **Supported methods:** GCash, cards, e‑wallets, online banking (PH‑focused)
- **Integration type:**
  - Hosted checkout / payment link
  - Webhook callback to mark orders as **PAID**

### 2.4 Hosting / Infra

- **Proxmox VM: `yametee-web`**
  - OS: Ubuntu Server (or similar)
  - Docker + Docker Compose
  - Containers:
    - `nextjs-app` – Next.js frontend + backend API
    - `nginx` – Reverse proxy, SSL termination (via Let’s Encrypt / Cloudflare)
- **Existing Postgres VM/Container:**
  - Shared for this store (separate DB/schema for clean isolation)

---

## 3. System Architecture (High‑Level)

**Flow:**

1. Customer visits Yametee website (Next.js frontend).
2. Site reads product catalogue from PostgreSQL via Prisma.
3. Customer selects **size & color**, adds to cart, then proceeds to checkout.
4. Next.js backend:
   - Validates order
   - Creates `Order` + `OrderItem` records in Postgres
   - Calls **PayMongo API** to create a checkout session
5. Customer is redirected to **PayMongo hosted payment page** (GCash, etc.).
6. PayMongo sends a **webhook** back to backend on payment success/failure.
7. Backend:
   - Verifies webhook signature
   - Updates `Order` and `Payment` records (`PAID`, `FAILED`, etc.)
   - Adjusts `Variant.stock_quantity` accordingly.

Future extension: integrate TikTok Pixel + TikTok Shop API.

---

## 4. Database Schema (Core Models)

### 4.1 Product Catalog

#### `Product`

- `id` (PK)
- `slug` (unique, e.g. `gojo-domain-tee`)
- `name` (e.g. “Gojo Domain Expansion Oversized Tee”)
- `description` (long text, markdown/HTML safe)
- `brand` (always `"Yametee"` for now)
- `status` (`ACTIVE`, `DRAFT`, `HIDDEN`)
- `created_at`
- `updated_at`

#### `Variant`

Represents a unique combination of **size + color** for a product.

- `id` (PK)
- `product_id` (FK → `Product.id`)
- `sku`
- `size` (e.g. `S`, `M`, `L`, `XL`, `2XL`)
- `color` (e.g. `Black`, `White`, `Red`)
- `price` (decimal)
- `stock_quantity` (integer)
- `created_at`
- `updated_at`

#### `ProductImage`

- `id` (PK)
- `product_id` (FK → `Product.id`)
- `image_url`
- `is_primary` (boolean)
- `position` (int for ordering)

---

### 4.2 Customers & Orders

#### `Customer`

- `id` (PK)
- `email`
- `phone`
- `name`
- `hashed_password` (optional, if account logins are enabled)
- `created_at`
- `updated_at`

#### `Address`

- `id` (PK)
- `customer_id` (FK → `Customer.id`, nullable for guest checkout)
- `full_name`
- `phone`
- `line1`
- `line2`
- `city`
- `province`
- `postal_code`
- `country`
- `created_at`
- `updated_at`

#### `Order`

- `id` (PK)
- `order_number` (human‑friendly, e.g. `WEB‑2025‑000123`)
- `customer_id` (nullable – for guest checkout)
- `status`
  - `PENDING`
  - `PAID`
  - `PROCESSING`
  - `SHIPPED`
  - `COMPLETED`
  - `CANCELLED`
- `payment_status` (`UNPAID`, `PAID`, `REFUNDED`, `FAILED`)
- `payment_provider` (`PAYMONGO`, `COD`, etc.)
- `subtotal` (decimal)
- `shipping_fee` (decimal)
- `discount_total` (decimal)
- `grand_total` (decimal)
- `created_at`
- `updated_at`

#### `OrderItem`

- `id` (PK)
- `order_id` (FK → `Order.id`)
- `product_id` (FK → `Product.id`)
- `variant_id` (FK → `Variant.id`)
- `quantity` (int)
- `unit_price` (decimal)
- `total_price` (decimal)

#### `Payment`

- `id` (PK)
- `order_id` (FK → `Order.id`)
- `provider` (e.g. `PAYMONGO`)
- `provider_payment_id` (PayMongo payment/checkout ID)
- `amount` (decimal)
- `status` (`PENDING`, `PAID`, `FAILED`, `REFUNDED`)
- `raw_payload` (JSON, PayMongo’s full webhook data)
- `created_at`
- `updated_at`

---

## 5. Admin Interface (Easy Product Management)

### 5.1 Admin Routes

- `/admin/login` – Simple email/password login
- `/admin/products` – List all products
- `/admin/products/new` – Create product
- `/admin/products/[id]` – Edit product

### 5.2 Create/Edit Product Form

Fields:

1. **Basic Info**
   - Name
   - Slug (auto‑generated from name; editable)
   - Description (textarea / rich text)
   - Status (Draft / Active / Hidden)

2. **Images**
   - Drag‑and‑drop upload
   - Select which image is **primary**
   - Reorder images by drag

3. **Variants (Size & Color)**

   - Predefined size options (checkbox list):
     - `S`, `M`, `L`, `XL`, `2XL`
   - Predefined color options (checkbox list):
     - `Black`, `White`, `Red`

   When sizes & colors are selected, the UI auto‑generates a variants table like:

   | Size | Color | SKU           | Price | Stock |
   |------|-------|---------------|-------|-------|
   | M    | Black | GOJO‑M‑BLK    | 599   | 20    |
   | L    | Black | GOJO‑L‑BLK    | 599   | 15    |
   | XL   | White | GOJO‑XL‑WHT   | 599   | 10    |

   - Admin can edit SKU, price, stock per row.
   - Button to **bulk set price** for all variants.

This makes it **fast and simple** for your encoders to add new anime designs.

---

## 6. Customer Experience

### 6.1 Public Pages

- `/` – Homepage (hero banner, featured drops, best sellers)
- `/products` – Product grid
- `/products/[slug]` – Product details with:
  - Large product image gallery
  - Title + short anime‑inspired subtitle
  - Price (from selected variant)
  - **Color selector:** pill buttons for Black / White / Red
  - **Size selector:** S / M / L / XL / 2XL
  - Stock indicator (In stock / Low stock)
  - “Add to Cart” button
- `/cart` – Cart view
- `/checkout` – Customer info + shipping address + summary
- `/order/[order_number]` – Order confirmation/tracking page

### 6.2 Design Language (Black/Red/White)

- Background: near‑black (`#050505`)
- Primary accent: red (`#E50914`)
- Text: white (`#FFFFFF`)
- Buttons:
  - Primary: red background, white text
  - Hover: darker red + glow
- Product cards:
  - Dark card background
  - White text, red price
  - Hover zoom on image + red border

Anime / Japanese streetwear vibe: clean grid, strong typography, and animation on hover, but **not cluttered**.

---

## 7. Checkout & PayMongo Flow (GCash Ready)

1. Customer fills out checkout form on `/checkout`:
   - Name, email, phone
   - Shipping address
2. Backend:
   - Validates cart & stock
   - Creates `Order` + `OrderItem` records with `payment_status = 'UNPAID'`
   - Calculates `grand_total`

3. Backend calls **PayMongo API** to create a **Checkout Session / Payment Link**:
   - Amount (in centavos)
   - Description (e.g. `Yametee Order WEB‑2025‑000123`)
   - Redirect URLs:
     - `success` → `/order/[order_number]`
     - `failed` → `/checkout?status=failed`
   - Methods: `gcash`, `paymaya`, `card`, etc.

4. PayMongo returns a `checkout_url`.
5. Frontend redirects customer to PayMongo’s hosted page.
6. Customer completes payment (GCash, card, etc.).
7. PayMongo sends webhook to `/api/webhooks/paymongo`:
   - Backend verifies signature.
   - Looks up the `Order` (by `metadata` or `provider_payment_id`).
   - Sets:
     - `payment_status = 'PAID'`
     - `status = 'PAID'` or `PROCESSING`
   - Decreases `Variant.stock_quantity`.
8. Customer is redirected back to your `/order/[order_number]` page, which now shows **Paid**.

---

## 8. Next.js Routes (Structure Overview)

### Public

- `app/page.tsx` → Home
- `app/products/page.tsx` → Product listing
- `app/products/[slug]/page.tsx` → Product detail
- `app/cart/page.tsx` → Cart
- `app/checkout/page.tsx` → Checkout
- `app/order/[order_number]/page.tsx` → Order confirmation

### Admin

- `app/admin/login/page.tsx`
- `app/admin/products/page.tsx`
- `app/admin/products/new/page.tsx`
- `app/admin/products/[id]/page.tsx`

### API Routes

- `app/api/products/route.ts` (listing/filtering, optional)
- `app/api/checkout/route.ts` (create order + PayMongo session)
- `app/api/webhooks/paymongo/route.ts` (handle payment webhooks)

---

## 9. Phase 1 Build Order (Minimal Viable Store)

1. **Setup project & DB**
   - Initialize Next.js (TS + Tailwind)
   - Setup Prisma + PostgreSQL connection
   - Create models & run migrations

2. **Admin: Products**
   - Implement `/admin/products` (list)
   - Implement `/admin/products/new` with:
     - Basic info
     - Image upload
     - Size/color variant generator

3. **Storefront**
   - Homepage (`/`)
   - Product grid (`/products`)
   - Product page with size/color toggle (`/products/[slug]`)
   - Cart (`/cart`)

4. **Checkout + Payments**
   - Checkout page (`/checkout`)
   - Backend `POST /api/checkout` → create order + PayMongo session
   - Webhook: `/api/webhooks/paymongo` → update order & stock

5. **Polish the design**
   - Refine black/red/white theme
   - Add hover effects, animations, and strong visuals to match anime streetwear branding.

---

This markdown file is the **blueprint** for building Yametee’s own e‑commerce platform: simple admin, solid database structure, GCash/PayMongo payments, and a clean, modern anime‑inspired UI.
