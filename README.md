# 🛠️ Enterprise Service Marketplace

Welcome to the **Service Marketplace**, a robust, full-stack platform designed to connect everyday users with certified professionals for home cleaning, repairs, and maintenance.

This project was engineered with a heavy focus on scalability, secure transaction flows, and Enterprise-grade administration controls.

---

## ✨ Core Features

*   **Multi-Role Architecture:** Dedicated flows for **Users** (booking services), **Providers** (rendering services), and **System Administrators** (moderating the platform).
*   **Dynamic Price Filtering:** Deep SQL pagination and real-time frontend caching to filter services efficiently without overloading the UI grid.
*   **Automated PDF Invoicing:** Client-side generation of branded PDF receipts for all completed network transactions.
*   **Financial & System Auditing:** The Administration Control Center automatically aggregates 15% platform commissions, measures GMV (Gross Market Value), and permanently records every action into a hardened MySQL Audit tracking table.
*   **Enterprise Administration:** Global `LIKE` search indices engineered across Users, Providers, Services, and System Logs to instantly locate platform anomalies or moderate user behavior.

---

## 💻 Technology Stack

*   **Frontend Ecosystem:** React.js, Vite, Tailwind CSS, Lucide React (Icons), jsPDF 
*   **Backend Architecture:** Node.js, Express.js, JWT (JSON Web Tokens), `bcryptjs`, RESTful APIs
*   **Data Layer:** MySQL2, parameterized queries for strict SQL-injection prevention

---

## 🚀 How to Run Locally

If you'd like to spin up this module locally, follow these instructions:

### 1. Database Configuration
Rename the provided `.env.example` file to `.env` and configure your local MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=service_marketplace
JWT_SECRET=supersecretkey_change_this_later
PORT=3000
```

### 2. Boot the Backend
Open a terminal inside the root directory and install dependencies:
```bash
npm install
npm run dev
```
*(The backend will begin listening identically on Port 3000)*

### 3. Boot the Frontend Space
Open a **second** terminal inside the `frontend/` directory:
```bash
npm install
npm run dev
```
Navigate to **http://localhost:5173/** in your web browser, and the platform is live!
