# Quality Monitoring System (QMS) - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Architecture](#3-project-architecture)
4. [Application Flow](#4-application-flow)
5. [Authentication System](#5-authentication-system)
6. [API Integration](#6-api-integration)
7. [Core Features & Components](#7-core-features--components)
8. [Module-wise Functionality](#8-module-wise-functionality)
9. [Data Flow Diagrams](#9-data-flow-diagrams)
10. [File Structure](#10-file-structure)
11. [Setup & Installation](#11-setup--installation)

---

## 1. Project Overview

### 1.1 Purpose & Need

The **Quality Monitoring System (QMS)** is a comprehensive web-based application designed for **pharmaceutical quality control and medicine inventory management**. It addresses the critical need for:

- **Real-time Quality Monitoring**: Track medicine quality scores, acceptance/rejection status, and environmental conditions
- **Expiry Management**: Monitor medicine expiry dates with automated alerts and status updates
- **Compliance Tracking**: Ensure all medicines meet quality standards and regulatory requirements
- **Performance Analytics**: Track inspector and supplier performance metrics
- **Inventory Control**: Manage medicine batches with full CRUD (Create, Read, Update, Delete) operations

### 1.2 Key Business Problems Solved

| Problem | Solution |
|---------|----------|
| Manual quality tracking | Automated digital quality monitoring dashboard |
| Expiry date mismanagement | Auto-status updates based on expiry dates with alerts |
| No supplier performance data | Real-time supplier analytics and performance tracking |
| Inefficient data entry | Voice input support for hands-free medicine entry |
| Scattered quality reports | Centralized dashboards for all quality metrics |
| No environmental monitoring | Environmental alert system for temperature, humidity, etc. |

### 1.3 Target Users

- **Quality Inspectors**: Add, update, and verify medicine quality
- **Supervisors**: Monitor overall quality metrics and team performance
- **Administrators**: Manage system users and access controls
- **Quality Analysts**: Analyze trends and generate reports

---

## 2. Technology Stack

### 2.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React.js** | 18.3.1 | UI component library |
| **React Router DOM** | 6.26.2 | Client-side routing |
| **Axios** | 1.7.7 | HTTP client for API calls |
| **React Speech Recognition** | 4.0.1 | Voice input functionality |
| **React Toastify** | 10.0.6 | Toast notifications |
| **React Icons** | 5.3.0 | Icon library |

### 2.2 Backend Technologies (Expected)

| Technology | Purpose |
|------------|---------|
| **Django** | Python web framework |
| **Django REST Framework** | RESTful API development |
| **JWT (JSON Web Tokens)** | Authentication |
| **PostgreSQL/MySQL** | Database |

### 2.3 Development Tools

- **Create React App**: Project bootstrapping
- **npm**: Package manager
- **ESLint**: Code linting
- **Jest**: Testing framework

---

## 3. Project Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React.js)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Components │  │   Routing   │  │   State Management     │  │
│  │   (UI Layer) │  │ (React Router)│ │   (useState/useEffect) │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS (REST API)
                              │ JWT Authentication
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Django REST Framework)               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Auth API  │  │   Items API │  │   Analytics API        │  │
│  │   (JWT)     │  │   (CRUD)    │  │   (Quality/Stats)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE                                 │
│              (PostgreSQL / MySQL / SQLite)                       │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Component Architecture

```
App.js (Root Component)
├── NavBar.jsx (Navigation)
├── Routes
│   ├── Public Routes
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Chatbot.jsx
│   │
│   └── Protected Routes (Requires Authentication)
│       ├── Dashboard.jsx
│       ├── ItemList.jsx (Medicine Management)
│       ├── ItemDetails.jsx
│       ├── SearchResult.jsx
│       ├── DeleteMedicine.jsx
│       ├── UpdateMedicine.jsx
│       ├── QualityScoreDashboard.jsx
│       ├── AcceptanceStatsDashboard.jsx
│       ├── EnvironmentalAlerts.jsx
│       ├── ExpiryStatusDashboard.jsx
│       └── PerformanceAnalytics.jsx
│
└── Footer.jsx
```

---

## 4. Application Flow

### 4.1 User Journey Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Landing    │ --> │    Login/    │ --> │    Dashboard     │
│    Page      │     │   Signup     │     │   (Main Hub)     │
└──────────────┘     └──────────────┘     └──────────────────┘
                                                   │
                    ┌──────────────────────────────┼──────────────────────────────┐
                    │                              │                              │
                    ▼                              ▼                              ▼
          ┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
          │ Medicine CRUD   │          │ Quality Dashboards│         │ Analytics       │
          │ - Add           │          │ - Quality Scores │          │ - Inspector Stats│
          │ - Update        │          │ - Acceptance     │          │ - Supplier Stats │
          │ - Delete        │          │ - Expiry Status  │          │ - Performance   │
          │ - View List     │          │ - Env Alerts     │          └─────────────────┘
          └─────────────────┘          └─────────────────┘
```

### 4.2 Authentication Flow

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   User      │     │   API Call      │     │   Backend        │
│   Login     │ --> │   /auth/login/  │ --> │   Validates      │
└─────────────┘     └─────────────────┘     │   Credentials    │
                                            └──────────────────┘
                                                    │
                           ┌────────────────────────┘
                           ▼
            ┌──────────────────────────┐
            │   Returns JWT Tokens     │
            │   - Access Token         │
            │   - Refresh Token        │
            └──────────────────────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │   Store in localStorage  │
            │   - accessToken          │
            │   - refreshToken         │
            │   - user data            │
            └──────────────────────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │   Redirect to Dashboard  │
            │   (Protected Routes)     │
            └──────────────────────────┘
```

### 4.3 Token Refresh Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ API Request     │     │ 401 Unauthorized│     │ Refresh Token   │
│ with Access     │ --> │ Response        │ --> │ API Call        │
│ Token           │     └─────────────────┘     │ /auth/refresh/  │
└─────────────────┘                             └─────────────────┘
                                                        │
                    ┌───────────────────────────────────┘
                    ▼
        ┌───────────────────────────────┐
        │ New Access Token Received     │
        │ - Update localStorage         │
        │ - Retry Original Request      │
        └───────────────────────────────┘
```

---

## 5. Authentication System

### 5.1 Login Functionality

**File**: `src/components/Login.jsx`

**Purpose**: Authenticates users and manages session tokens

**Flow**:
1. User enters username and password
2. Form validation checks for required fields
3. API call to `/api/auth/login/` endpoint
4. On success: Store tokens, redirect to dashboard
5. On failure: Display error message

**Key Code Implementation**:
```javascript
// Login API call
const handleLogin = async (e) => {
  e.preventDefault();
  const accessToken = await login(username, password);
  
  if (accessToken) {
    setLoggedIn(true);
    navigate('/dashboard');
  }
};
```

### 5.2 Signup/Registration

**File**: `src/components/Signup.jsx`

**Purpose**: Register new users with role assignment

**User Data Collected**:
- Username (required)
- Email (required)
- Password (required, min 8 chars)
- First Name (required)
- Last Name (required)
- Phone Number (optional)
- Employee ID (optional)
- Department (optional)
- Role Selection:
  - Quality Inspector
  - Supervisor
  - Administrator
  - Quality Analyst

### 5.3 Protected Routes

**File**: `src/components/ProtectedRoute.jsx`

**Purpose**: Guards routes that require authentication

**Implementation**:
```javascript
const ProtectedRoute = ({ loggedIn, children }) => {
  return loggedIn ? children : <Navigate to="/login" />;
};
```

### 5.4 Token Management

**File**: `src/api.js`

**Features**:
- Automatic token attachment to requests (Axios interceptor)
- Automatic token refresh on 401 responses
- Secure token storage in localStorage

---

## 6. API Integration

### 6.1 Base Configuration

**Base URL**: `http://localhost:8000/api`

### 6.2 API Endpoints Reference

#### Authentication Endpoints

| Endpoint | Method | Purpose | Request Body | Response |
|----------|--------|---------|--------------|----------|
| `/auth/signup/` | POST | User registration | `{username, email, password, ...}` | `{tokens: {access, refresh}, user}` |
| `/auth/login/` | POST | User login | `{username, password}` | `{access, refresh, user}` |
| `/auth/refresh/` | POST | Refresh access token | `{refresh}` | `{access}` |
| `/auth/logout/` | POST | User logout | - | - |

#### Medicine/Items Endpoints

| Endpoint | Method | Purpose | Request Body | Response |
|----------|--------|---------|--------------|----------|
| `/items/` | GET | List all medicines | - | `[{id, name, batch_number, ...}]` |
| `/items/` | POST | Add new medicine | `{name, batch_number, accepted_or_rejected}` | Created item |
| `/items/{id}/` | GET | Get medicine details | - | Single item object |
| `/items/{id}/` | PUT | Update medicine | Updated fields | Updated item |
| `/items/{id}/` | DELETE | Delete medicine | - | - |
| `/items/?search=` | GET | Search medicines | Query param | Filtered items |

#### Quality Score Endpoints

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/quality-scores/` | GET | All medicines with scores | `{medicines: [...]}` |
| `/quality-scores/statistics/` | GET | Overall statistics | `{total, average_score, grade_distribution}` |
| `/quality-scores/top/` | GET | Top performers | `{top_performers: [...]}` |
| `/quality-scores/worst/` | GET | Poor performers | `{poor_performers: [...]}` |

#### Acceptance Statistics Endpoints

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/acceptance-stats/` | GET | Batch acceptance stats | `{overview, rejection_reasons, supplier_stats}` |
| `/acceptance-stats/?date_from=&date_to=` | GET | Filtered by date | Same with date filter |

#### Status & Expiry Endpoints

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/status/statistics/` | GET | Status breakdown | `{total_items, active, expired, quarantine}` |
| `/items/expiry_stats/` | GET | Expiry statistics | `{safe, warning, critical, expired}` |
| `/items/expiry_report/` | GET | Detailed expiry report | Expiry data |

#### Environmental Alerts Endpoints

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/alerts/count/` | GET | Alert statistics | `{total_alerts, critical, warning, alert_types}` |
| `/alerts/list/` | GET | List all alerts | `{items: [...]}` |
| `/alerts/list/?severity=&type=` | GET | Filtered alerts | Filtered alert items |

#### Performance Analytics Endpoints

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/inspector-stats/` | GET | Inspector performance | `{inspectors: [...]}` |
| `/supplier-stats/` | GET | Supplier performance | `{suppliers: [...]}` |

#### Bulk Operations Endpoints

| Endpoint | Method | Purpose | Request |
|----------|--------|---------|---------|
| `/csv-template/` | GET | Download CSV template | - |
| `/bulk-upload/` | POST | Upload CSV file | FormData with file |

### 6.3 API Response Handling

**Axios Instance Configuration**:
```javascript
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request Interceptor - Attach Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - Handle Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 and refresh token
  }
);
```

---

## 7. Core Features & Components

### 7.1 Dashboard (Main Hub)

**File**: `src/components/Dashboard.jsx`

**Purpose**: Central navigation and statistics overview

**Features**:
- Welcome message with user info
- Statistics cards (Total Items, Approved, Rejected, Pending)
- Quick Actions grid for fast navigation
- System modules overview with visual cards

**Statistics Displayed**:
```javascript
const [stats, setStats] = useState({
  totalItems: 0,
  approved: 0,
  rejected: 0,
  pending: 0
});
```

**Quick Actions Available**:
1. Add Medicine → `/items`
2. Update Record → `/update-medicine`
3. Delete Item → `/delete-medicine`
4. Quality Dashboard → `/quality-scores`
5. Acceptance Stats → `/acceptance-stats`
6. Environmental Alerts → `/environmental-alerts`
7. Expiry Management → `/expiry-status`
8. Performance Analytics → `/performance-analytics`

### 7.2 Medicine Management (ItemList)

**File**: `src/components/ItemList.jsx`

**Purpose**: Complete CRUD operations for medicines

**Features**:

#### Add Medicine
- Form fields: Name, Batch Number, Status
- Voice input support
- Form validation
- Toast notifications

#### View Medicines
- List all medicines
- Toggle full list visibility
- Search functionality

#### CSV Operations
- Download CSV template
- Bulk upload via CSV file
- Progress indicators

**Voice Input Integration**:
```javascript
const handleVoiceInput = (transcript) => {
  const parsedData = parseVoiceCommand(transcript);
  // Map parsed data to form fields
  if (parsedData.medicine_name) {
    updatedItem.name = parsedData.medicine_name;
  }
  if (parsedData.batch_number) {
    updatedItem.batch_number = parsedData.batch_number;
  }
  if (parsedData.quality_status) {
    updatedItem.accepted_or_rejected = parsedData.quality_status;
  }
};
```

### 7.3 Voice Input System

**Files**: 
- `src/components/VoiceInput.jsx`
- `src/utils/voiceParser.js`

**Purpose**: Hands-free data entry using speech recognition

**Supported Voice Commands**:

| Command Pattern | Parsed Field | Example |
|-----------------|--------------|---------|
| "medicine [name]" | medicine_name | "medicine Paracetamol" |
| "batch [number]" | batch_number | "batch A123" |
| "temp [value]" | temperature | "temp 25" |
| "humidity [value]" | humidity | "humidity 60" |
| "expiry [date]" | expiry_date | "expiry 2026-12-31" |
| "approved/accepted/pass" | quality_status | "status approved" |
| "rejected/fail" | quality_status | "rejected" |
| "quantity [value]" | quantity | "quantity 100" |
| "manufacturer [name]" | manufacturer | "manufacturer Pfizer" |

**Voice Parser Implementation**:
```javascript
export const parseVoiceCommand = (transcript) => {
  const data = {};
  const lower = transcript.toLowerCase();
  
  // Parse medicine name
  let medicineMatch = lower.match(/medicine\s+(?:name\s+)?([a-zA-Z0-9\s]+?)(?:\s+batch|$)/i);
  if (medicineMatch) {
    data.medicine_name = medicineMatch[1].trim();
  }
  
  // Parse batch number
  const batchMatch = lower.match(/batch\s+(?:number\s+)?([a-z0-9]+)/i);
  if (batchMatch) {
    data.batch_number = batchMatch[1].toUpperCase();
  }
  
  return data;
};
```

### 7.4 AI Chatbot

**File**: `src/components/Chatbot.jsx`

**Purpose**: Medicine assistant for queries about medicines, dosages, and health advice

**Features**:
- Text chat interface
- Voice input (Speech-to-Text)
- Text-to-Speech for responses
- Auto-scroll for new messages
- Professional UI design

**Capabilities**:
- Answer medicine-related questions
- Provide dosage information
- Share side effects details
- Offer general health advice

---

## 8. Module-wise Functionality

### 8.1 Quality Score Dashboard

**File**: `src/components/QualityScoreDashboard.jsx`

**Purpose**: Comprehensive view of medicine quality metrics

**API Endpoints Used**:
- `GET /api/quality-scores/statistics/` - Overall statistics
- `GET /api/quality-scores/top/` - Top performers
- `GET /api/quality-scores/worst/` - Poor performers
- `GET /api/quality-scores/` - All medicines

**Data Displayed**:

| Metric | Description |
|--------|-------------|
| Total Medicines | Count of all medicines |
| Average Score | Mean quality score |
| Highest Score | Best performing medicine |
| Lowest Score | Worst performing medicine |
| Grade Distribution | A, B, C, D, F breakdown |

**Grade Scoring System**:
```javascript
const getScoreBadge = (score) => {
  if (score >= 90) return { label: 'A', status: 'Excellent' };
  if (score >= 80) return { label: 'B', status: 'Good' };
  if (score >= 70) return { label: 'C', status: 'Fair' };
  if (score >= 60) return { label: 'D', status: 'Poor' };
  return { label: 'F', status: 'Failed' };
};
```

### 8.2 Acceptance Statistics Dashboard

**File**: `src/components/AcceptanceStatsDashboard.jsx`

**Purpose**: Track batch acceptance/rejection metrics

**API Endpoint**: `GET /api/acceptance-stats/`

**Features**:
- Date range filtering
- Overview statistics
- Rejection reasons analysis
- Supplier performance stats

**Response Structure**:
```javascript
{
  overview: {
    total_batches: number,
    accepted_batches: number,
    rejected_batches: number,
    acceptance_rate: number,
    rejection_rate: number
  },
  rejection_reasons: [...],
  supplier_stats: [...],
  date_range: { from, to }
}
```

### 8.3 Expiry Status Dashboard

**File**: `src/components/ExpiryStatusDashboard.jsx`

**Purpose**: Monitor medicine expiry dates and auto-status updates

**API Endpoints Used**:
- `GET /api/status/statistics/` - Status breakdown
- `GET /api/items/expiry_stats/` - Expiry statistics
- `GET /api/items/` - Items with filters

**Status Categories**:

| Status | Icon | Description |
|--------|------|-------------|
| Active | ✅ | Safe to use |
| Expired | ❌ | Past expiry date |
| Quarantine | ⚠️ | Under review |

**Expiry Status Logic**:
```javascript
const getExpiryStatusText = (daysUntilExpiry, isExpired) => {
  if (isExpired) return `Expired ${Math.abs(daysUntilExpiry)} days ago`;
  if (daysUntilExpiry <= 7) return `Expires in ${daysUntilExpiry} days - CRITICAL`;
  if (daysUntilExpiry <= 30) return `Expires in ${daysUntilExpiry} days - Warning`;
  if (daysUntilExpiry <= 90) return `Expires in ${daysUntilExpiry} days`;
  return `${daysUntilExpiry} days remaining`;
};
```

### 8.4 Environmental Alerts System

**File**: `src/components/EnvironmentalAlerts.jsx`

**Purpose**: Monitor environmental conditions and generate alerts

**API Endpoints Used**:
- `GET /api/alerts/count/` - Alert statistics
- `GET /api/alerts/list/` - Alert items list

**Alert Types Monitored**:

| Type | Icon | Color |
|------|------|-------|
| Temperature | 🌡️ | Red (#ef4444) |
| Humidity | 💧 | Blue (#3b82f6) |
| Contamination | ⚠️ | Orange (#f59e0b) |
| Purity | ✨ | Purple (#8b5cf6) |
| pH Level | 🧪 | Green (#10b981) |

**Alert Severity Levels**:
- **Critical** 🔴 - Immediate attention required
- **Warning** 🟡 - Monitor closely

**Filter Options**:
- By severity (Critical/Warning)
- By alert type
- By result limit

### 8.5 Performance Analytics

**File**: `src/components/PerformanceAnalytics.jsx`

**Purpose**: Track inspector and supplier performance

**API Endpoints Used**:
- `GET /api/inspector-stats/` - Inspector performance
- `GET /api/supplier-stats/` - Supplier performance

**Inspector Metrics**:
```javascript
{
  inspector_name: string,
  total_inspections: number,
  average_quality_score: number,
  current_month: { average_score, inspections },
  previous_month: { average_score, inspections },
  acceptance_rate: number,
  grade_distribution: { A, B, C, D, F },
  trend: 'up' | 'down' | 'stable' | 'new',
  trend_percentage: number
}
```

**Trend Indicators**:
- 📈 Up - Improving
- 📉 Down - Declining
- ➡️ Stable - No change
- 🆕 New - New inspector

### 8.6 Delete Medicine

**File**: `src/components/DeleteMedicine.jsx`

**Purpose**: Search and delete medicine records

**Flow**:
1. Fetch all medicines on load
2. Search by name, batch number, or status
3. Display filtered results
4. Delete with confirmation
5. Show success/error toast

### 8.7 Update Medicine

**File**: `src/components/UpdateMedicine.jsx`

**Purpose**: Search and update medicine status

**Flow**:
1. Search for medicine
2. Select from search results
3. Update status (Accepted/Rejected/Pending)
4. Voice input support for status update
5. Submit changes

---

## 9. Data Flow Diagrams

### 9.1 Medicine CRUD Flow

```
┌─────────────────┐
│   User Action   │
│   (Add/Edit/    │
│    Delete)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│   Form Input    │     │   Voice Input   │
│   (Manual)      │ OR  │   (Parsed)      │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌─────────────────────┐
         │   Validate Input    │
         │   (Frontend)        │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │   API Request       │
         │   with JWT Token    │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │   Backend Process   │
         │   (Django)          │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │   Database Update   │
         │   (PostgreSQL)      │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │   Response to       │
         │   Frontend          │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │   Update UI         │
         │   (Toast + Refresh) │
         └─────────────────────┘
```

### 9.2 Quality Score Calculation Flow

```
┌──────────────────────┐
│   Medicine Data      │
│   (Backend Model)    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Quality Factors    │
│   - Expiry Status    │
│   - Environmental    │
│   - Acceptance       │
│   - Test Results     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Calculate Score    │
│   (0-100 scale)      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Assign Grade       │
│   A(≥90), B(≥80),    │
│   C(≥70), D(≥60), F  │
└──────────────────────┘
```

---

## 10. File Structure

```
quality-monitoring-system/
│
├── public/
│   ├── index.html          # Main HTML template
│   ├── manifest.json       # PWA manifest
│   └── robots.txt          # SEO configuration
│
├── src/
│   ├── api.js              # API configuration & functions
│   ├── App.js              # Root component with routing
│   ├── App.css             # Global styles
│   ├── index.js            # Application entry point
│   ├── index.css           # Base styles
│   ├── ErrorBoundary.js    # Error handling wrapper
│   │
│   ├── components/
│   │   ├── About.jsx                    # About page
│   │   ├── AcceptanceStatsDashboard.jsx # Batch acceptance metrics
│   │   ├── Chatbot.jsx                  # AI medicine assistant
│   │   ├── Contact.jsx                  # Contact page
│   │   ├── Dashboard.jsx                # Main dashboard
│   │   ├── DeleteMedicine.jsx           # Delete medicine interface
│   │   ├── EnvironmentalAlerts.jsx      # Environmental monitoring
│   │   ├── ExpiryStatusDashboard.jsx    # Expiry management
│   │   ├── Footer.jsx                   # Footer component
│   │   ├── Home.jsx                     # Landing page
│   │   ├── ItemDetails.jsx              # Single item view
│   │   ├── ItemList.jsx                 # Medicine CRUD operations
│   │   ├── Login.jsx                    # User login
│   │   ├── NavBar.jsx                   # Navigation bar
│   │   ├── PerformanceAnalytics.jsx     # Performance tracking
│   │   ├── ProtectedRoute.jsx           # Route guard
│   │   ├── QualityScoreDashboard.jsx    # Quality metrics
│   │   ├── SearchResult.jsx             # Search results display
│   │   ├── Signup.jsx                   # User registration
│   │   ├── UpdateMedicine.jsx           # Update medicine status
│   │   └── VoiceInput.jsx               # Voice recognition component
│   │
│   ├── config/
│   │   └── apiConfig.js    # API endpoint configuration
│   │
│   ├── utils/
│   │   ├── backendDetection.js   # Backend status detection
│   │   ├── errorSuppression.js   # Error handling utilities
│   │   └── voiceParser.js        # Voice command parsing
│   │
│   └── Images/
│       ├── AboutImages/    # About page images
│       └── DashboardImages/# Dashboard images
│
├── package.json            # Dependencies & scripts
└── README.md               # Basic readme
```

---

## 11. Setup & Installation

### 11.1 Prerequisites

- Node.js (v16+)
- npm (v8+)
- Django backend running on port 8000

### 11.2 Installation Steps

```bash
# 1. Clone the repository
git clone <repository-url>

# 2. Navigate to project directory
cd quality-monitoring-system

# 3. Install dependencies
npm install

# 4. Start development server
npm start

# 5. Access application
# Open http://localhost:3000 in browser
```

### 11.3 Environment Configuration

Ensure backend is running:
```
Backend URL: http://localhost:8000/api
```

### 11.4 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm build` | Build for production |
| `npm test` | Run tests |

---

## 12. Security Considerations

### 12.1 Authentication Security
- JWT tokens used for authentication
- Tokens stored in localStorage
- Automatic token refresh mechanism
- Secure logout clearing all tokens

### 12.2 API Security
- All protected routes require valid JWT
- Token attached via Authorization header
- 401 responses trigger token refresh

### 12.3 Input Validation
- Frontend form validation
- Backend validation (Django)
- Sanitized voice input parsing

---

## 13. Summary

The **Quality Monitoring System** is a comprehensive React-based frontend application that provides:

1. **Complete Medicine Management** - CRUD operations with voice input support
2. **Real-time Quality Monitoring** - Quality scores, grades, and analytics
3. **Expiry Tracking** - Automated status updates based on expiry dates
4. **Environmental Monitoring** - Alerts for temperature, humidity, and other factors
5. **Performance Analytics** - Inspector and supplier performance tracking
6. **Secure Authentication** - JWT-based authentication with token refresh
7. **User-friendly Interface** - Modern UI with responsive design

The system integrates with a Django REST Framework backend through well-defined API endpoints, providing a robust solution for pharmaceutical quality control and inventory management.

---

**Document Version**: 1.0  
**Last Updated**: March 2026  
**Author**: Quality Monitoring System Team
