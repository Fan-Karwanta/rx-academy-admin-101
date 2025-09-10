# RX Lifestyle Admin Panel

A comprehensive admin panel for managing RX Lifestyle digital magazine subscriptions and users.

## Features

- **Dashboard**: Analytics overview with user metrics and subscription statistics
- **User Management**: View, edit, and manage user accounts and subscriptions
- **Archive Storage**: Manage digital magazine archives and documents
- **Authentication**: Secure admin login with Supabase integration

## Setup Instructions

### 1. Database Setup

First, execute the database schema in your Supabase dashboard:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → SQL Editor
2. Copy and paste the content from `../supabase-schema.sql`
3. Click "Run" to create all tables and functions

### 2. Admin User Setup

Create the default admin user:

1. In Supabase Dashboard → Authentication → Users
2. Create a new user with:
   - **Email**: `rx@admin`
   - **Password**: `rxacademy2025`
3. Copy the user ID from the created user
4. In SQL Editor, run the content from `admin-setup.sql` (replace the UUID with the actual user ID)

### 3. Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Update the values if needed (default values should work)

### 4. Install Dependencies

```bash
npm install
```

### 5. Development

Start the development server:

```bash
npm run dev
```

The admin panel will be available at `http://localhost:5173`

### 6. Production Build

Build for production:

```bash
npm run build
```

## Deployment to Vercel

### Option 1: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your repository
4. Set the root directory to `admin_panel`
5. Add environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
6. Deploy

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from admin_panel directory
cd admin_panel
vercel

# Follow the prompts
```

## Default Admin Credentials

- **Email**: `rx@admin`
- **Password**: `rxacademy2025`

⚠️ **Important**: Change these credentials after first login in production!

## Project Structure

```
admin_panel/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Sidebar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── users/
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── UsersPage.jsx
│   │   ├── ArchiveStoragePage.jsx
│   │   └── LoginPage.jsx
│   ├── services/
│   │   └── supabase.js
│   └── App.jsx
├── admin-setup.sql
├── .env.example
└── README.md
```

## Key Features

### Dashboard
- User analytics and growth metrics
- Subscription statistics
- Revenue tracking
- Interactive charts and graphs

### User Management
- View all registered users
- Filter by subscription status
- Edit user profiles and subscriptions
- Manage user permissions

### Archive Storage
- Upload and manage magazine archives
- Organize documents by type
- Track download statistics
- Search and filter functionality

## Database Schema

The admin panel integrates with the following Supabase tables:
- `profiles` - User profiles and subscription status
- `subscriptions` - Detailed subscription records
- `admin_users` - Admin user permissions
- `content_access` - Granular content permissions
- `audit_logs` - Activity tracking

## Security

- Row Level Security (RLS) enabled on all tables
- Admin-only access with role-based permissions
- Secure authentication via Supabase Auth
- Protected routes and API endpoints

## Support

For issues or questions, please check the database setup and ensure all environment variables are correctly configured.
