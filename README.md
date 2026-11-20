# Lead Manager

A lightweight, production-grade full-stack web application designed for sales representatives and teams to capture, organize, and track prospective leads across different pipeline stages.

Built as part of the Full Stack Developer screening assignment for **Meru Technosoft Pvt. Ltd.**

---

## 🚀 Tech Stack & Design Choices

| Area | Technology | Reason for Selection |
| :--- | :--- | :--- |
| **Frontend** | **React 18** (Vite) | High rendering performance, fast development cycles, modular component architecture, and minimal build overhead. |
| **Backend** | **Node.js** with **Express.js** | Lightweight, event-driven REST API, well-suited for high-throughput JSON workloads and asynchronous I/O. |
| **Database** | **MongoDB** with **Mongoose** | Flexible document schema model fitting evolving customer/lead attributes; powerful validation, casting, indexing, and text search. |
| **Icons & Styling** | **Lucide Icons** & Modern Responsive CSS | Clean, accessible design system with responsive layouts, CSS custom properties, smooth transitions, and distinct status color-coding. |
| **Zero-Config DB Fallback** | `mongodb-memory-server` | Ensures instant out-of-the box evaluation without requiring an external MongoDB service to be pre-configured. |

---

## 📁 Project Structure

The project strictly separates concerns with dedicated `frontend/` and `backend/` directories:

```text
Lead Manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB connection (with automatic in-memory fallback)
│   │   ├── controllers/
│   │   │   └── leadController.js# Business logic (CRUD, query filtering, error handling)
│   │   ├── middleware/
│   │   │   └── errorHandler.js  # Validation, CastError, and 404/500 middleware
│   │   ├── models/
│   │   │   └── Lead.js          # Mongoose schema, validation rules, and indexes
│   │   ├── routes/
│   │   │   └── leadRoutes.js    # Clean REST API endpoints
│   │   └── seed.js              # Standalone database seed script
│   ├── .env.example             # Example environment configuration
│   ├── .env                     # Local environment variables (PORT, MONGODB_URI)
│   ├── package.json             # Backend dependencies and scripts
│   └── server.js                # Express entry point & auto-initialization
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx       # Branding header with primary "Add Lead" trigger
│   │   │   ├── SearchBar.jsx    # Real-time search & status filter pills
│   │   │   ├── LeadTable.jsx    # Leads table with status badges and actions
│   │   │   ├── LeadModal.jsx    # Modal dialog for Add & Edit operations
│   │   │   ├── DeleteModal.jsx  # Confirmation step before permanent deletion
│   │   │   └── Notification.jsx # Feedback toasts for success and error states
│   │   ├── services/
│   │   │   └── leadService.js   # Encapsulated API client
│   │   ├── App.jsx              # Main application coordinator state
│   │   ├── index.css            # Polished design system and responsive CSS
│   │   └── main.jsx             # React DOM mounting
│   ├── index.html               # HTML entry point with Inter typography
│   ├── package.json             # Frontend dependencies and scripts
│   └── vite.config.js           # Vite dev server configuration & API proxy
│
├── package.json                 # Root convenience scripts
├── .gitignore                   # Ignored files (node_modules, .env, dist, etc.)
└── README.md                    # Project documentation
```

---

## ✨ Core Features Implemented

1. **Add a Lead**:
   - Captures `Name`, `Email`, `Phone`, `Company`, `Source` (Dropdown: Website, Referral, Cold Call, LinkedIn, Email Campaign, Other), and `Status` (Dropdown: New, Contacted, Qualified, Lost).
2. **List Leads**:
   - Clear tabular presentation with colored badges for each pipeline status (`New`, `Contacted`, `Qualified`, `Lost`), clickable email/phone shortcuts, and formatted creation timestamps.
3. **Edit a Lead**:
   - Modals pre-populate existing lead details allowing seamless updating of contact information and pipeline progression.
4. **Delete a Lead (with confirmation)**:
   - Dedicated confirmation modal requiring user intent before deleting, preventing accidental data loss.
5. **Search & Filter**:
   - Instant search across lead names, emails, and company names.
   - Interactive status filter pills (`All`, `New`, `Contacted`, `Qualified`, `Lost`) with dynamic result count.
6. **Robust Validation (Frontend & Backend)**:
   - Frontend: Real-time validation on change/blur and submission, inline visual alerts, and red input border highlights.
   - Backend: Mongoose schema and controller-level format verification (regex for email and phone, min/max lengths, required fields, and enum enforcement).

---

## 🛠️ Setup & Running Locally

### Prerequisites
- **Node.js** (v18 or higher recommended; developed on Node v22)
- **npm** (v9 or higher)
- *(Optional)* A running MongoDB instance or MongoDB Atlas URI. **If no MongoDB server is running, the app automatically boots an embedded in-memory MongoDB server without needing manual setup.**

---

### Step 1: Clone the repository
```bash
git clone <repository-url>
cd "Lead Manager"
```

---

### Step 2: Install dependencies

You can install dependencies for both `backend` and `frontend`:

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

### Step 3: Configure Environment Variables

The backend has a `.env.example` pre-configured. By default, `backend/.env` is configured as follows:

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/lead_manager
```

> **Note**: If `127.0.0.1:27017` is not running, the application gracefully launches an in-memory MongoDB instance automatically, so you can test it immediately without installing MongoDB!

---

### Step 4: Run the Application

#### Option A: Running separately (Recommended for development)

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server will run on http://localhost:5001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App will open at http://localhost:3000
```

#### Option B: From the root directory
```bash
# Terminal 1:
npm run dev:backend

# Terminal 2:
npm run dev:frontend
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status | — |
| `GET` | `/api/leads` | Retrieve all leads | `?search=term&status=Qualified` |
| `GET` | `/api/leads/:id` | Retrieve single lead by ID | — |
| `POST` | `/api/leads` | Create a new lead | — |
| `PUT` | `/api/leads/:id` | Update existing lead details/status | — |
| `DELETE`| `/api/leads/:id` | Delete a lead | — |

### Sample Payload (`POST /api/leads`)
```json
{
  "name": "Alex Mercer",
  "email": "alex.mercer@gentek.org",
  "phone": "+1 555-019-9922",
  "company": "Gentek Corp",
  "source": "Referral",
  "status": "New"
}
```

---

## 🧠 Assumptions Made

1. **Lead Identifier**: Each lead is uniquely identified by MongoDB's `_id`. Emails can be duplicate across different contacts if multiple people share a general domain, but are normalized to lowercase.
2. **Single Tenant Focus**: As requested, bonus multi-user authentication is intentionally omitted to keep the core pipeline workflow focused, reliable, and clean.
3. **Resilient Local Database**: Added transparent fallback to `mongodb-memory-server` so anyone reviewing the project on any computer can run `npm run dev` and immediately evaluate a 100% working application without needing Docker or a local MongoDB service running.

---

## 🔮 What I Would Improve With More Time

1. **User Authentication & Role-Based Access (RBAC)**: JWT-based authentication with bcrypt password hashing allowing sales reps to manage their private pipelines and sales managers to review team performance.
2. **Activity Timeline & Notes**: A timeline tab on each lead modal to log call summaries, emails sent, and scheduled follow-up dates.
3. **CSV Export / Import**: Bulk lead import wizard with column mapping and export to Excel/CSV for sales reporting.
4. **End-to-End Automated Testing**: Playwright or Cypress test suites integrated into GitHub Actions CI pipeline.

---

## 💬 A Note on the Build

> *“What I'm most satisfied with in this solution is the balance between strict core feature completeness and user experience — having zero-friction setup via the resilient database fallback, paired with instant feedback through client/server validation, status pill filtering, and a confirmation modal for destructive actions.”*
