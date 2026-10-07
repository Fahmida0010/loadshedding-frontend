# Load Shedding & Power Management System

A full-stack enterprise-grade web application designed to track, manage, and optimize power interruptions, schedules, and grid infrastructure. Built with modern web technologies, it features real-time monitoring, role-based dashboards, automated scheduling, secure authentication, and payment integration.

---

## 🔗 Live Links & Repository

* **Live Frontend:** https://loadshedding-frontend.vercel.app
* **Live Backend API:** https://loadshedding-backend-eight.vercel.app
* **Frontend Repository:** https://github.com/Fahmida0010/loadshedding-frontend.git
* **Backend Repository:**https://github.com/Fahmida0010/loadshedding-backend.git

---

## 🔐 Default Admin Credentials

* **Email:** `admin@demo.com`
* **Password:** `Password248` 

---

## 🚀 Tech Stack

### Frontend
* **Framework:** Next.js (App Router, TypeScript)
* **State Management:** Zustand
* **Data Fetching & Caching:** TanStack Query (React Query)
* **API Client:** Axios
* **Styling:** Tailwind CSS
* **Validation:** Zod
* **Icons:** Lucide React
* **Charts & Analytics:** Recharts

### Payment & Integrations
* **Payment Gateway:** SSLCommerz

---

## 🌟 Key Features & Modules

### 🌐 Public Pages
* **Home:** Overview of power management updates and quick access links.
* **Services:** Detailed information on grid and monitoring services offered.
* **Schedules:** Publicly accessible load shedding timings and calendars.
* **Outages:** Live tracking of ongoing and emergency power outages.
* **About Us:** Information about the mission and management team.
* **Contact Us:** Support channels and inquiry submission forms.

### 👥 Role-Based Dashboards
* **Admin Dashboard:** 
 * Overview of activities
  * Comprehensive management of **Substations**, **Feeders**, **Distribution Zones**.**Areas**,**Assignments**, **Payment History**, **Users**, **Outages**, **Schedules**
  * Complete user management and role assignments.
  * System-wide analytics powered by **Recharts**.
* **Technician Dashboard:** 
  * Overview of activities
  * Task and technician assignments for grid repairs.
  * Real-time status updates on outage resolution.
* **Customer Dashboard:** 
 * Overview of activities
  * Outage reporting system with tracking.
  * Profile and settings management.

---

## 📂 Project Structure (Frontend App Router)

```tree
src/
├── app/
│   ├── (public)/          # Public pages (Home, Services, Schedules, Outages, About, Contact)
│   ├── dashboard/         # Role-based protected dashboards (Admin, Customer, Technician)
│   ├── layout.tsx         # Root layout with providers & global metadata
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components & Lucide wrappers
├── context/               # React Context providers (Theme, Language, etc.)
├── hooks/                 # Custom Axios & TanStack Query hooks
├── store/                 # Zustand state stores
└── types/                 # TypeScript interfaces and Zod schemas