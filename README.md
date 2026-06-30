# 🚀 Follower Shop - Instagram Growth Panel

A full-stack, responsive web application for purchasing Instagram growth services (Followers, Likes, Views). It includes a user-facing storefront, an admin dashboard to manage orders/services, and a Node.js/Express backend integrated with MongoDB and Razorpay.

---

## 📁 Repository Structure

The project is split into three directories:
*   **[`/site`](./site)**: The React + Vite client-side storefront where users view and purchase services.
*   **[`/admin`](./admin)**: The React + Vite admin dashboard for managing services, orders, and system settings.
*   **[`/backend`](./backend)**: The Express.js REST API server handling database interactions, Razorpay payments, and admin authentication.

---

## ✨ Features

### 🛒 Client Storefront (`/site`)
*   **Service Catalog**: Browse popular plans for Instagram Followers, Views, and Likes.
*   **Seamless Ordering**: Dynamic price calculations based on custom quantity inputs.
*   **Razorpay Integration**: Fully functional, secure payments via Razorpay.
*   **Interactive UI**: Sleek dark-mode aesthetic with smooth animations, FAQ section, and trust badges.
*   **No Password Required**: Users only need to provide their Instagram username or post link.

### 📊 Admin Panel (`/admin`)
*   **Authentication**: Secure login for administrators.
*   **Order Management**: View all incoming orders, update status (Pending, Processing, Completed, Cancelled).
*   **Service Configuration**: Add new services, edit details (price per unit, minimum/maximum order limits), or toggle popular/active status.
*   **Sales Overview**: Track analytics such as total revenue, order count, and customer metrics.

### ⚙️ Backend API (`/backend`)
*   **RESTful endpoints** for services, order processing, and payment status verification.
*   **MongoDB integration** using Mongoose for schema models.
*   **Razorpay Payment Gateway** APIs for order generation and webhook/signature validation.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Functional Components, Hooks), React Router DOM, Axios, Vanilla CSS.
*   **Backend**: Node.js, Express.js, Razorpay SDK.
*   **Database**: MongoDB, Mongoose ODM.
*   **Build Tools & Environment**: Vite, Dotenv, Nodemon.

---

## 🚀 Setup & Installation

### Prerequisites
*   Node.js (v14 or higher)
*   MongoDB (Local server or MongoDB Atlas)
*   Razorpay Account (for API credentials)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` variables with your MongoDB connection string and Razorpay credentials:
   ```env
   MONGODB_URI=mongodb://localhost:27017/follower_shop
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   PORT=3000
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   FRONTEND_URL=http://localhost:5173
   ```
5. Seed the initial service plans:
   ```bash
   npm run seed
   ```
6. Start the server in development mode:
   ```bash
   npm run dev
   ```

### 2. Storefront Setup (`/site`)
1. Navigate to the site directory:
   ```bash
   cd ../site
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 3. Admin Panel Setup (`/admin`)
1. Navigate to the admin directory:
   ```bash
   cd ../admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🛡️ Security Best Practices
Before making this repository public on GitHub, ensure you do not commit any sensitive files:
*   Do **NOT** upload your `.env` file. It is already added to `/backend/.gitignore`.
*   Ensure that any test configuration containing credentials in `node_modules` or local config is ignored.
*   Keep your Razorpay API secrets private.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
