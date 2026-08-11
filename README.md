# Metrics — Performance Evaluation & Trajectory Intelligence

**Metrics** is an enterprise multi-tenant performance evaluation platform built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Prisma ORM 6, and Neon Serverless PostgreSQL.

It replaces static annual performance reviews with continuous monthly evaluation cycles, interactive growth trajectory analytics, structured 5-parameter feedback, and real-time HR compliance tracking.

---

## Key Features

* **Performance Trajectory Graph**: Interactive SVG curve visualization tracking employee score progression across evaluation cycles. Supports *Overall Average* and *Parameter Breakdown* view modes with growth delta metrics.
* **5-Parameter Evaluation Engine**: Structured ratings across **Quality of Work**, **Ownership**, **Communication**, **Teamwork**, and **Initiative** with mandatory written justifications and rating badges (*Poor*, *Below Expectations*, *Meets Expectations*, *Exceeds Expectations*, *Outstanding*).
* **Multi-Cycle Historical Review**: Cycle selector bar on all dashboard views (*My Feedback*, *Team Reviews*, *HR Compliance*) allowing users to inspect evaluation history across past cycles.
* **HR Compliance Portal**: Organization-wide completion rates, total manager counts, pending feedback tracking, and missing feedback reports.
* **Multi-Tenant Data Isolation**: Strict company-level scoping (`company_id`) enforced across database tables, API queries, and Server Actions.
* **Modern Studio Design System**: 56px architectural background grid with left-to-right fade masking, glassmorphic headers, card spotlight hover elevation, and Google Fonts (`Plus_Jakarta_Sans` & `Outfit`).
* **1-Click Demo Profiles**: Interactive sign-in page split into a 50/50 showcase with instant 1-click test sign-in buttons for Managers, HR Admins, and Employees.

---

## Technology Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS v4 + Custom Vanilla CSS |
| **Typography** | Google Fonts (`Plus_Jakarta_Sans` & `Outfit`) |
| **ORM** | Prisma ORM 6 |
| **Database** | Neon Serverless PostgreSQL |
| **Auth & Security** | `jose` (Encrypted HTTP-Only JWT Cookie) + `bcryptjs` |

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation & Setup

Clone the repository and install dependencies:
```bash
git clone https://github.com/your-org/performance-evaluation-tool.git
cd performance-evaluation-tool
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```env
# PostgreSQL connection string
DATABASE_URL="postgresql://neondb_owner:npg_4HfgAe8hWnqa@ep-solitary-smoke-axlx4cyk-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require"

# JWT session signing secret
SESSION_SECRET="your-super-secret-key-change-in-production"
```

### 4. Database Push & Seed

Push the Prisma schema to your database and run the initial data seeder:
```bash
# Push database schema
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed sample companies, cycles, parameters, and demo accounts
npx prisma db seed
```

### 5. Running the Application

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Quick Demo Login Profiles

All demo accounts use the password: `password123`.

### Company 1: Ashoka Textiles
* **Manager**: `priya@ashoka.com` (Priya Sharma — Engineering Manager)
* **HR Admin**: `hr@ashoka.com` (Ananya Roy — HR Director)
* **Employee**: `amit@ashoka.com` (Amit Kumar — Software Engineer)

### Company 2: Bright Path Solutions
* **Manager**: `sarah@brightpath.com` (Sarah Jenkins — Founder & Manager)
* **HR Admin**: `hr@brightpath.com` (David Miller — HR Lead)
* **Employee**: `emily@brightpath.com` (Emily Watson — Product Designer)

---

## Architecture & Design Documentation

For complete technical specifications, database schema diagrams, authorization layer details, and UI design patterns, refer to:
* **[design.md](file:///Users/aryan/Downloads/performance-evaluation-tool/design.md)** — Comprehensive System Architecture Document.

