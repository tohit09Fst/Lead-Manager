# Lead Manager

A full-stack, production-grade web application designed for sales representatives and teams to capture, organize, and track prospective leads across different pipeline stages.

Built for the Full Stack Developer screening assignment at **Meru Technosoft Pvt. Ltd.**

---

## 🚀 Tech Stack & Design Choices

| Area | Technology | Reason for Selection |
| :--- | :--- | :--- |
| **Frontend** | **React 18** (Vite) | High rendering performance, modular component architecture, and minimal build overhead. |
| **Backend** | **Node.js** with **Express.js** | Lightweight, event-driven REST API, well-suited for high-throughput JSON workloads and asynchronous I/O. |
| **Database** | **MongoDB** with **Mongoose** | Flexible document schema model; powerful validation, casting, indexing, text search, and aggregation pipelines. |
| **Authentication** | **JWT** & **bcryptjs** | Stateless Bearer token authorization and salted password hashing ensuring complete multi-tenant user isolation. |
| **Icons & Styling** | **Lucide Icons** & Responsive CSS | Accessible design system with custom CSS properties, responsive tables, animations, and color-coded status badges. |
| **Testing** | **Node.js Test Runner** (`node:test`) | Native, zero-dependency, lightning-fast integration test suite validating REST APIs and data security. |
| **Zero-Config DB Fallback** | `mongodb-memory-server` | Ensures instant out-of-the-box local evaluation even if an external MongoDB instance is not configured. |

---

## 📁 Project Structure

The project strictly separates concerns into dedicated `frontend/` and `backend/` directories:

```text
Lead Manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB connection (with automatic in-memory fallback)
│   │   ├── controllers/
│   │   │   ├── authController.js# Registration, login, and user profiles
│   │   │   └── leadController.js# CRUD, search, status filter, pagination & sorting
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js# JWT Bearer token authentication & route protection
│   │   │   └── errorHandler.js  # Validation, CastError, and 404/500 error handler
│   │   ├── models/
│   │   │   ├── User.js          # User schema with bcrypt password hashing
│   │   │   └── Lead.js          # Lead schema with user ref, validators & indexes
│   │   ├── routes/
│   │   │   ├── authRoutes.js    # /api/auth (register, login, me)
│   │   │   └── leadRoutes.js    # /api/leads protected REST endpoints
│   │   └── seed.js              # Database seed script for demo user & sample leads
│   ├── tests/
│   │   └── lead.test.js         # Automated end-to-end API test suite
│   ├── .env.example             # Example configuration file
│   ├── .env                     # Local environment variables (PORT, MONGODB_URI, JWT_SECRET)
│   ├── package.json             # Express, Mongoose, JWT, bcryptjs, tests
│   └── server.js                # Express entry point & auto-initialization
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           # App branding, user profile badge, Sign Out
│   │   │   ├── DashboardMetrics.jsx # Status metric breakdown cards (click to filter)
│   │   │   ├── SearchBar.jsx        # Real-time search bar & status filter pills
│   │   │   ├── LeadTable.jsx        # Sortable leads table with pagination controls
│   │   │   ├── LeadModal.jsx        # Add & Edit modal with field validation
│   │   │   ├── DeleteModal.jsx      # Confirmation modal before deletion
│   │   │   ├── AuthModal.jsx        # Sign In / Sign Up modal + 1-Click Demo Login
│   │   │   └── Notification.jsx     # Success and error toast alerts
│   │   ├── services/
│   │   │   ├── authService.js       # Client authentication API calls
│   │   │   └── leadService.js       # Client lead CRUD and filtering API calls
│   │   ├── App.jsx                  # Main application coordinator state
│   │   ├── index.css                # Polished design system and responsive CSS
│   │   └── main.jsx                 # React DOM entry point
│   ├── index.html                   # HTML template with Inter typography
│   ├── package.json                 # React 18, Vite, Lucide Icons
│   └── vite.config.js               # Vite config & API reverse proxy
│
├── package.json                     # Root scripts for running backend & frontend
├── .gitignore                       # Git ignore rules
└── README.md                        # Documentation
```

---

## ✨ Features

### 🌟 Core Requirements
1. **Add a Lead**: Captures `Name`, `Email`, `Phone`, `Company`, `Source` (Dropdown: Website, Referral, Cold Call, LinkedIn, Email Campaign, Other), and `Status` (*New, Contacted, Qualified, Lost*).
2. **List Leads**: Clear tabular presentation with colored badges for each pipeline status, clickable contact shortcuts, and formatted timestamps.
3. **Edit a Lead**: Pre-populates lead details in a modal, allowing updates to contact details and pipeline status.
4. **Delete a Lead (with confirmation)**: Dedicated confirmation modal displays lead details and requires user confirmation before permanent deletion.
5. **Search & Filter**: Real-time search by lead name, email, or company, plus interactive status filter pills (`All`, `New`, `Contacted`, `Qualified`, `Lost`).
6. **Dual-Layer Input Validation**: Client-side feedback on change/blur and submission, paired with Mongoose schema and regex checks on the backend.

### 🎁 Implemented Bonus Features
1. **User Authentication (Signup / Login with JWT)**:
   - Secure registration and login with bcrypt-hashed passwords and signed JWT tokens.
   - **Multi-Tenant User Isolation**: Users see, edit, and delete only their own leads.
   - Includes a **1-Click Quick Demo Login** button for reviewer convenience.
2. **Table Pagination & Column Sorting**:
   - Column sorting by clicking headers (*Name & Company, Source, Status, Creation Date*) with dynamic direction arrows.
   - Pagination controls with configurable rows per page (*5, 10, 20*) and page navigation (*Prev, Page X of Y, Next*).
3. **Dashboard Status Metrics**:
   - Live breakdown metric cards: *Total Leads*, *New*, *Contacted*, *Qualified*, and *Lost*.
   - Clicking any metric card instantly filters the table to that status.
4. **Automated API Test Suite**:
   - 9 automated test scenarios covering registration, login, validation errors, protected routes, CRUD lifecycle, sorting, pagination, and multi-user isolation.

---

## 🛠️ Setup & Running Locally

### Prerequisites
- **Node.js** (v18 or higher; tested on Node v22)
- **npm** (v9 or higher)
- *(Optional)* A running MongoDB instance or MongoDB Atlas URI. If none is reachable, the backend automatically uses an embedded in-memory MongoDB fallback.

---

### Step 1: Install Dependencies

```bash
# In backend
cd backend
npm install

# In frontend
cd ../frontend
npm install

# Return to root
cd ..
```

---

### Step 2: Configure Environment Variables

The backend has a `.env.example` pre-configured. Ensure `backend/.env` contains:

```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lead_manager
JWT_SECRET=lead_manager_super_secret_jwt_key_2026
```

---

### Step 3: Seed Sample Data (Optional)

```bash
cd backend
npm run seed
```
> Seeds a demo user (`demo@merutechno.com` / `password123`) with 7 sample leads across all pipeline stages.

---

### Step 4: Run the Application

#### Option A: Running separately (Recommended)

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Backend API will run on http://localhost:5001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Frontend web app will open at http://localhost:3000
```

#### Option B: From the root directory
```bash
# Terminal 1:
npm run dev:backend

# Terminal 2:
npm run dev:frontend
```

---

### Step 5: Run Automated API Tests

To run the automated test suite:

```bash
cd backend
npm test
```

Expected output:
```text
▶ Full Stack Lead Manager API Test Suite
  ✔ 1. Health check returns 200 OK
  ✔ 2. User Registration & Validation
  ✔ 3. User Login
  ✔ 4. Protected Routes Reject Unauthorized Requests
  ✔ 5. Lead Creation and Input Validation
  ✔ 6. Pagination, Sorting & Metrics Count
  ✔ 7. Multi-User Isolation (User B cannot see or delete User A leads)
  ✔ 8. Update Lead Status
  ✔ 9. Delete Lead with Confirmation Step endpoint
✔ Full Stack Lead Manager API Test Suite (9 passing)
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Service health status | No |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT | No |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Yes |
| `GET` | `/api/leads` | List leads (with pagination, sort, search, status filter) | Yes |
| `GET` | `/api/leads/:id` | Get single lead by ID | Yes |
| `POST` | `/api/leads` | Create a new lead | Yes |
| `PUT` | `/api/leads/:id` | Update lead details / status | Yes |
| `DELETE`| `/api/leads/:id` | Delete a lead | Yes |

---

## 🧠 Assumptions Made

1. **User Scoping**: In a commercial CRM, each sales representative should only have visibility and editing rights over their assigned leads. All query, update, and delete operations strictly verify ownership via `req.user._id`.
2. **Reviewer Convenience**: Added a 1-click **"One-Click Login as Demo User"** button in the authentication modal so evaluators can inspect the full application immediately without registering a new email manually.
3. **Resilient Local Database**: Integrated an automatic in-memory MongoDB fallback in `db.js` so anyone reviewing the project on any computer can test it out of the box even without pre-configuring MongoDB.

---

## 🔮 What I Would Improve With More Time

1. **Activity Timeline & Notes**: A timeline tab on each lead modal to log notes from phone calls, emails sent, and scheduled follow-up reminders.
2. **CSV Bulk Import & Export**: Allow sales reps to export filtered leads into CSV/Excel or import prospect lists via spreadsheet upload.
3. **End-to-End Browser Tests**: Playwright automated UI tests verifying modal flows and responsive layouts in a CI/CD GitHub Action.

---

## 💬 A Note on the Build

> *“What I'm most satisfied with in this solution is how naturally the bonus features (JWT multi-user isolation, pagination, sorting, status metrics, and automated tests) build upon the solid core architecture without adding bloat or fragile complexity.”*
