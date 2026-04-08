# 🏗️ AbujaHomes Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                    (React + Vite Frontend)                       │
└─────────────────────┬──────────────────────────────────────────┘
                      │
                      │ HTTP Requests
                      │ (Axios)
                      ▼
        ┌─────────────────────────────┐
        │   API Configuration         │
        │  (frontend/src/config/)     │
        │                             │
        │ - All endpoints centralized │
        │ - Environment-based BaseURL │
        └──────────────┬──────────────┘
                      │
                      │ API Calls
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER                             │
│              (Backend on localhost:5000)                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Routes                                          │  │
│  │  ├── /api/auth/register    → User Registration          │  │
│  │  ├── /api/auth/login       → User Login (JWT)           │  │
│  │  ├── /api/auth/me          → Get Current User           │  │
│  │  ├── /api/properties       → List/Create Properties     │  │
│  │  ├── /api/properties/:id   → Get/Update/Delete          │  │
│  │  ├── /api/bookings         → Booking Management         │  │
│  │  ├── /api/payments         → Payment Processing         │  │
│  │  └── /api/admin            → Admin Controls             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                      │                                           │
│  ┌──────────────────▼──────────────────────────────────────┐   │
│  │        Middleware                                        │   │
│  │  ├── Auth Middleware (JWT Verification)                │   │
│  │  ├── Error Handler (Centralized)                       │   │
│  │  ├── CORS (Cross-Origin)                               │   │
│  │  └── Body Parser (JSON/URL-encoded)                    │   │
│  └──────────────────────────────────────────────────────────┘  │
│                      │                                           │
│  ┌──────────────────▼──────────────────────────────────────┐   │
│  │        Data Models (Mongoose)                           │   │
│  │  ├── User                                               │   │
│  │  ├── Property                                           │   │
│  │  ├── Booking                                            │   │
│  │  ├── Review                                             │   │
│  │  └── RequestProperty                                    │   │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────┬───────────────────────────────────────────────┘
               │
               │ Database Operations
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB                                       │
│            (Database - localhost:27017)                          │
│                                                                  │
│  Collection: users      → User accounts & auth data             │
│  Collection: properties → Real estate listings                  │
│  Collection: bookings   → Property viewing bookings             │
│  Collection: reviews    → Property reviews                      │
│  Collection: requests   → Property requests                     │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### Registration Flow
```
User Inputs (Name, Email, Password)
           ↓
    React Component
           ↓
   AuthContext.register()
           ↓
   Axios POST /api/auth/register
           ↓
Express Route Handler
           ↓
  Validation Check
           ↓
 Password Hashing (bcrypt)
           ↓
 Save to MongoDB
           ↓
  Generate JWT Token
           ↓
     Return Token + User
           ↓
Store Token in localStorage
           ↓
Redirect to Dashboard
```

### Property Search Flow
```
User Enters Search Filters
(location, priceRange, type)
           ↓
PropertiesPage Component
           ↓
Axios GET /api/properties?filters
           ↓
Express Route Handler
           ↓
Build MongoDB Query
           ↓
Execute Find with Filters
           ↓
Sort & Paginate Results
           ↓
Populate Agent Details
           ↓
    Return JSON Response
           ↓
React Query Caches Data
           ↓
Display Property Cards Grid
```

### Property Details Flow
```
User Clicks Property Card
           ↓
Navigate to /property/:id
           ↓
PropertyDetailsPage Loads
           ↓
useQuery Triggers
           ↓
Axios GET /api/properties/:id
           ↓
Express Route Handler
           ↓
Increment Views Counter
           ↓
Fetch from MongoDB
           ↓
Populate Agent Info
           ↓
   Return Full Property
           ↓
Display Full Details Page
   + Agent Contact Info
   + Schedule Viewing Button
   + Save Property Button
```

## File Organization

### Backend Structure
```
backend/
├── server.js                    # Express app setup & startup
├── package.json                 # Dependencies
├── .env                        # Environment config
│
├── routes/
│   ├── auth.js                 # Authentication endpoints (✅ FIXED)
│   ├── properties.js           # Property CRUD (✅ FIXED)
│   ├── bookings.js             # Booking endpoints
│   ├── payments.js             # Payment endpoints
│   └── admin.js                # Admin endpoints
│
├── models/
│   ├── User.js                 # User schema
│   ├── Property.js             # Property schema
│   ├── Booking.js              # Booking schema
│   ├── Review.js               # Review schema
│   └── RequestProperty.js       # Request schema
│
└── middleware/
    ├── auth.js                 # JWT verification
    ├── errorHandler.js         # Error handling
    └── upload.js               # File upload
```

### Frontend Structure
```
frontend/
├── src/
│   ├── main.jsx                # App entry point
│   ├── App.jsx                 # Router setup
│   ├── index.css               # Global styles
│   │
│   ├── config/
│   │   └── api.js              # ✨ API endpoints (NEW)
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx     # Auth state (🔄 UPDATED)
│   │   └── ThemeContext.jsx    # Theme state
│   │
│   ├── pages/
│   │   ├── HomePage.jsx        # 🔄 UPDATED
│   │   ├── LoginPage.jsx       # 🔄 UPDATED
│   │   ├── RegisterPage.jsx    # 🔄 UPDATED
│   │   ├── PropertiesPage.jsx  # 🔄 UPDATED
│   │   ├── PropertyDetailsPage.jsx  # 🔄 UPDATED
│   │   ├── DashboardPage.jsx   # User dashboard
│   │   ├── AdminDashboardPage.jsx   # Admin panel
│   │   └── AddPropertyPage.jsx # Add property form
│   │
│   └── components/
│       ├── Navbar.jsx          # Navigation
│       ├── Footer.jsx          # Footer
│       ├── PropertyCard.jsx    # Property display
│       ├── ProtectedRoute.jsx  # Route protection
│       ├── PropertyCard.jsx    # Property listing
│       └── [other components]
│
├── .env.local                  # ✨ Frontend env (NEW)
├── vite.config.js              # Vite bundler config
├── tailwind.config.js          # Tailwind config
└── package.json                # Dependencies
```

## Component Communication

### AuthContext Flow
```
┌─────────────────────────┐
│   AuthContext           │
│                         │
│ State:                  │
│  - user                 │
│  - loading              │
│                         │
│ Methods:                │
│  - login()   ────────┐  │
│  - register() ────┐  │  │
│  - logout()  ──┐  │  │  │
└────────────────┼──┼──┼──┘
                 │  │  │
      ┌──────────┘  │  │
      │          ┌──┘  │
      │          │     │
      ▼          ▼     ▼
   API_ENDPOINTS
      │
      ├─→ localStorage (token)
      └─→ axios (headers)
```

## Security Flow

```
User Registers
     ↓
Password: "secret123"
     ↓
bcrypt.hash("secret123") 
     ↓
Hashed: $2a$10$N9qo8uLO...
     ↓
Stored in MongoDB
     ↓
Later: User Logs In
     ↓
Password: "secret123"
     ↓
bcrypt.compare("secret123", $2a$10$N9qo8uLO...)
     ↓
Match? YES
     ↓
JWT.sign({userId}) with SECRET
     ↓
Token: eyJhbGc... (stored in localStorage)
     ↓
API Requests:
  Header: Authorization: Bearer eyJhbGc...
     ↓
Server: JWT.verify(token)
     ↓
Valid? Access Granted
```

## Request-Response Cycle

### Successful Request
```
Frontend Request
  ├─ POST /api/auth/login
  ├─ Headers: Content-Type: application/json
  └─ Body: {email, password}
        ↓
Backend Processing
  ├─ Validate inputs
  ├─ Find user in DB
  ├─ Compare password
  ├─ Generate JWT
  └─ Return response
        ↓
Success Response (200)
  ├─ token: "JWT_TOKEN"
  ├─ user: {name, email, role}
  └─ message: "Login successful"
        ↓
Frontend
  ├─ Save token to localStorage
  ├─ Set axios header
  ├─ Update AuthContext
  └─ Redirect to dashboard
```

### Error Handling
```
Frontend Request
        ↓
Backend Receives
        ↓
Error Occurs:
  ├─ Validation error
  ├─ Database error
  ├─ Authentication error
  └─ Authorization error
        ↓
Error Handler Middleware
        ↓
Error Response
  ├─ Status code
  ├─ Error message
  └─ Stack trace (dev mode)
        ↓
Frontend Receives Error
        ↓
Error Handler
  ├─ Toast notification
  ├─ Console log
  └─ User feedback
```

## Authentication Flow

```
Unauthenticated User
        ↓
    Page Load
        ↓
Check localStorage for token
        ↓
Token exists?
        ├─ YES: Verify with backend (/api/auth/me)
        │       ├─ Valid: Load user data, proceed
        │       └─ Invalid: Clear token, redirect login
        └─ NO: User stays guest, some pages restricted
        ↓
Pages with ProtectedRoute
        ├─ User logged in: Show page
        └─ Not logged in: Redirect to login
```

## API Response Patterns

All API responses follow this pattern:

```json
// Success (200-201)
{
  "message": "Operation successful",
  "data": { ... }  // or "user", "properties", etc.
}

// Error (400-500)
{
  "message": "Error description",
  "errors": [ ... ]  // if validation errors
}
```

---

This architecture ensures:
- ✅ Clear separation of concerns
- ✅ Scalability for new features
- ✅ Security through JWT & password hashing
- ✅ Error handling at every level
- ✅ Efficient database queries
- ✅ Fast frontend with Vite
- ✅ Type safety where possible
- ✅ Easy debugging and logging
