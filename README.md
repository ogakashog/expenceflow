# ExpenseFlow — Expense Management System

🚀 **[Live Demo: https://expenceflo.web.app](https://expenceflo.web.app)**

A production-ready expense management system built with **React**, **Firebase**, and **Tailwind CSS**. Track, submit, and manage business expenses with a beautiful, responsive dashboard.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-10-orange?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

---

## 📖 About the Project

This Expense Management System was engineered as a demonstration of modern, full-stack web development capabilities. The goal was to combine robust backend functionality with a visually stunning, user-centric frontend experience. 

Key focuses of this build include:
- **Scalability**: Utilizing Firebase's NoSQL database structure to efficiently handle growing amounts of user data.
- **User Experience**: Prioritizing a frictionless, glassmorphic UI with micro-interactions to make data entry a pleasure rather than a chore.
- **Real-world Utility**: Implementing essential business workflows like file uploads, data filtering, and CSV exports for accounting teams.

---

## ✨ Features

### Core
- **Expense Submission** — Create expenses with date, category, amount, description, and optional receipt upload
- **Expense List** — View all expenses in a responsive table with search, filter, sort, and pagination
- **Workflow Management** — Status transitions: Draft → Submitted → Approved / Rejected
- **Dashboard** — Real-time summary cards showing totals, approved/rejected/submitted/draft counts

### Authentication
- Firebase Email/Password authentication
- Protected routes with automatic redirects
- Sign up and sign in with validation

### File Management
- Receipt/bill upload to Firebase Storage
- In-app receipt image preview modal
- File size validation (max 5MB)

### Premium UI & Aesthetics
- 🎨 **Vibrant Glassmorphism Design** — Overhauled UI featuring a mesh-gradient background, backdrop-blur "glass" panels, and premium typography (Outfit font)
- 💵 **Localized Currency** — All amounts elegantly formatted in Indian Rupees (₹)
- ✨ **Micro-animations** — Smooth hover states, subtle lifting effects, and animated interactive elements
- 🛡️ **Interactive Feedback** — Sleek, glass-styled logout confirmation modal

### Bonus Features
- 📊 **Export to CSV** — Download filtered expense reports directly to a spreadsheet
- 🖱️ **Drag-and-Drop** — Intuitive drag-and-drop file upload for receipts and bills
- 🔍 **Search & Filter** — Search expenses by category or description, and filter by status
- 📅 **Sorting & Pagination** — Sort by date (ascending/descending) with pagination
- 🖼️ **Receipt Preview** — In-app receipt preview in a lightbox modal

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev) | UI library |
| [Vite](https://vite.dev) | Build tool and dev server |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first CSS |
| [Firebase Auth](https://firebase.google.com/docs/auth) | Authentication |
| [Cloud Firestore](https://firebase.google.com/docs/firestore) | NoSQL database |
| [Firebase Storage](https://firebase.google.com/docs/storage) | Receipt file storage |
| [React Router v6](https://reactrouter.com) | Client-side routing |
| [React Hot Toast](https://react-hot-toast.com) | Notifications |
| [Lucide React](https://lucide.dev) | Icons |

---

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ExpenseFilters.jsx
│   ├── ExpenseForm.jsx
│   ├── ExpenseTable.jsx
│   ├── LoadingSpinner.jsx
│   ├── Navbar.jsx
│   ├── Pagination.jsx
│   ├── ProtectedRoute.jsx
│   ├── ReceiptPreview.jsx
│   ├── StatsCard.jsx
│   └── StatusBadge.jsx
├── firebase/
│   └── firebase.js           # Firebase initialization
├── hooks/
│   ├── useAuth.js            # Auth context and hook
│   └── useExpenses.js        # Expense data management hook
├── pages/
│   ├── AddExpensePage.jsx
│   ├── DashboardPage.jsx
│   ├── ExpensesPage.jsx
│   └── LoginPage.jsx
├── services/
│   ├── authService.js        # Firebase Auth API
│   ├── expenseService.js     # Firestore CRUD API
│   └── storageService.js     # Firebase Storage API
├── utils/
│   ├── constants.js          # App-wide constants
│   └── helpers.js            # Formatting and validation utilities
├── App.jsx                   # Root component with routing
├── main.jsx                  # Vite entry point
└── index.css                 # Global styles and Tailwind config
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- A [Firebase](https://firebase.google.com/) account

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd expense-management-system
npm install
```

### 2. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable the following services:

#### Authentication
- Navigate to **Authentication** then **Sign-in method**
- Enable **Email/Password** provider

#### Firestore Database
- Navigate to **Firestore Database**
- Click **Create database**
- Start in **test mode** (for development)

#### Firebase Storage
- Navigate to **Storage**
- Click **Get started**
- Start in **test mode** (for development)

#### Web App Registration
- Go to **Project Settings** then **General** then **Your apps**
- Click the **Web** icon to register a web app
- Copy the Firebase config values

### 3. Environment Variables

Copy the example env file and fill in your Firebase credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 5. Build for Production

```bash
npm run build
npm run preview
```

---

## 🗂️ Firestore Collection Structure

```
expenses (collection)
  └── {expenseId} (document)
        ├── userId: string
        ├── date: string
        ├── category: string
        ├── amount: number
        ├── description: string
        ├── receiptUrl: string or null
        ├── receiptName: string or null
        ├── status: string  (draft, submitted, approved, rejected)
        ├── createdAt: timestamp
        └── updatedAt: timestamp
```

---

## 📝 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📄 License

MIT
