# AbujaHomes Setup & Running Guide

## Prerequisites
- Node.js and npm installed
- MongoDB running locally or connection string ready

## Project Structure
```
AbujaHomes/
├── backend/          # Express.js server
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth, error handling, file upload
│   ├── package.json
│   └── server.js
├── frontend/         # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── config/   # API configuration
│   │   └── main.jsx
│   ├── .env.local
│   └── package.json
└── .env              # Back-end environment variables
```

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Verify dependencies are installed
```bash
npm install
```

### 3. Check .env file
The `.env` file should contain:
```
MONGODB_URI=mongodb://localhost:27017/Abujahomes
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
CLOUDINARY_CLOUD_NAME=dzq2twxqg
CLOUDINARY_API_KEY=345833431157731
CLOUDINARY_API_SECRET=UjYOzcGCaTwHegcNO8Tgm7Ti2po
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

### 4. Start MongoDB (if local)
```bash
mongod
```

### 5. Start the backend server
**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Backend will run at: `http://localhost:5000`

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Verify dependencies are installed
```bash
npm install
```

### 3. Verify .env.local file
Should contain:
```
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Start the development server
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173` (or another available port)

## Running Both Together

### Terminal 1 - Backend
```bash
cd AbujaHomes/backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd AbujaHomes/frontend
npm run dev
```

Then open your browser to the frontend URL shown in the terminal.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  - Body: `{ name, email, password }`
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
- `GET /api/auth/me` - Get current user (requires JWT token)
- `POST /api/auth/logout` - Logout

### Properties
- `GET /api/properties` - List all properties
  - Query params: `location`, `minPrice`, `maxPrice`, `propertyType`, `sort`, `page`, `limit`
  - Example: `/api/properties?location=Lagos&minPrice=1000000&maxPrice=10000000&sort=newest&page=1&limit=12`
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (requires auth)
- `PUT /api/properties/:id` - Update property (requires auth + ownership)
- `DELETE /api/properties/:id` - Delete property (requires auth + ownership)

## Frontend Features

### Home Page
- Search properties by location, price range, and type
- View featured properties
- See testimonials and stats

### Properties Page
- Filter properties with advanced search
- Sort by newest, price (low-high), price (high-low), most popular
- Pagination support

### Property Details
- View full property information
- See agent contact information
- Schedule viewings
- Save properties

### Authentication
- Register new account
- Login with email/password
- Dashboard for logged-in users
- Admin panel for admin users

### Dashboard
- View saved properties
- Manage bookings
- User profile settings (agent/admin specific)

## Testing the Connection

1. **Register a new account** on the login page
2. **View properties** - should load from backend
3. **Search properties** - use search filters
4. **View property details** - click on a property card
5. **Create property** (as agent) - add property with details
6. **Admin panel** (as admin) - access advanced controls

## Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongod`
- Check port 5000 is available
- Review `.env` file for correct settings
- Check console for error messages

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check `.env.local` has correct API URL
- Check browser console for CORS errors
- Verify MongoDB connection in backend console

### Authentication errors
- Clear browser local storage and token
- Check JWT_SECRET in backend .env
- Verify user is created in MongoDB

### Property queries returning empty
- Ensure MongoDB is running and connected
- Check properties exist in database
- Verify query parameters are correct

## Development Notes

- Backend uses Express.js with MongoDB via Mongoose
- Frontend uses React 18 with Vite for fast bundling
- State management: React Context API for auth and theme
- Styling: Tailwind CSS
- UI Components: Framer Motion animations, React Icons
- Data fetching: Axios with React Query
- Form handling: React Hook Form

## Build for Production

### Backend
No build needed - just ensure `.env` file has production values

### Frontend
```bash
cd frontend
npm run build
```

This creates optimized files in the `dist/` folder ready for deployment.
