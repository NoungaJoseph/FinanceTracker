# Finance Dashboard Pro - Setup Guide

## Quick Start (5 minutes)

### 1. Prerequisites

- **Node.js**: 18.0.0 or higher
- **Bun** (optional, but recommended): `curl -fsSL https://bun.sh/install | bash`
- **PostgreSQL**: 12 or higher
- **Git**: For version control

### 2. Clone the Repository

```bash
git clone https://github.com/NoungaJoseph/finance-dashboard-pro.git
cd finance-dashboard-pro
```

### 3. Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Or using npm:
```bash
npm install
```

### 4. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/finance_dashboard_pro"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# AI Assistant
ANTHROPIC_API_KEY="sk-ant-your-claude-api-key"
```

**Getting API Keys:**

- **Claude API Key**: Visit [Anthropic Console](https://console.anthropic.com)
- **PostgreSQL**: Install from [postgresql.org](https://www.postgresql.org/download/)

### 5. Set Up Database

```bash
# Create database
createdb finance_dashboard_pro

# Run migrations
bunx prisma migrate dev --name init
```

### 6. Start Development Server

```bash
bun dev
```

The application will be available at `http://localhost:3000`

### 7. Test the Application

1. Open http://localhost:3000
2. Click "Sign up"
3. Create an account with test data
4. Complete the onboarding questionnaire
5. Access the dashboard

---

## Detailed Setup Instructions

### PostgreSQL Setup

#### macOS (using Homebrew)

```bash
brew install postgresql@15
brew services start postgresql@15
createdb finance_dashboard_pro
```

#### Ubuntu/Debian

```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb finance_dashboard_pro
```

#### Windows

1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer and follow prompts
3. Remember the password you set
4. Open pgAdmin and create database `finance_dashboard_pro`

#### Docker (Recommended)

```bash
docker run --name finance-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=finance_dashboard_pro \
  -p 5432:5432 \
  -d postgres:15
```

### Environment Variables Explained

```env
# DATABASE_URL
# Format: postgresql://[user]:[password]@[host]:[port]/[database]
# Example: postgresql://postgres:password@localhost:5432/finance_dashboard_pro
DATABASE_URL="postgresql://postgres:password@localhost:5432/finance_dashboard_pro"

# NEXTAUTH_SECRET
# Used for JWT signing. Generate with:
# openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-key"

# NEXTAUTH_URL
# The URL where your app is hosted
# Development: http://localhost:3000
# Production: https://yourdomain.com
NEXTAUTH_URL="http://localhost:3000"

# ANTHROPIC_API_KEY
# Get from https://console.anthropic.com
# Format: sk-ant-...
ANTHROPIC_API_KEY="sk-ant-your-api-key"
```

### Generate NEXTAUTH_SECRET

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString())) | Select-Object -First 32
```

---

## Troubleshooting Setup

### Issue: "Cannot find module 'next'"

**Solution:**
```bash
bun install
# or
npm install
```

### Issue: "Database connection refused"

**Solution:**
1. Check PostgreSQL is running:
```bash
# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Windows
# Check Services app for PostgreSQL
```

2. Verify DATABASE_URL in `.env.local`
3. Test connection:
```bash
psql postgresql://postgres:password@localhost:5432/finance_dashboard_pro
```

### Issue: "ANTHROPIC_API_KEY is not set"

**Solution:**
1. Get API key from [Anthropic Console](https://console.anthropic.com)
2. Add to `.env.local`:
```env
ANTHROPIC_API_KEY="sk-ant-your-key"
```
3. Restart dev server

### Issue: "Port 3000 is already in use"

**Solution:**
```bash
# Kill process on port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Prisma migration fails

**Solution:**
```bash
# Reset database (WARNING: deletes all data)
bunx prisma migrate reset

# Or manually:
dropdb finance_dashboard_pro
createdb finance_dashboard_pro
bunx prisma migrate dev --name init
```

---

## Development Workflow

### 1. Start Development Server

```bash
bun dev
```

### 2. Make Changes

Edit files in:
- `app/` - Pages and API routes
- `components/` - React components
- `lib/` - Utilities and context
- `prisma/schema.prisma` - Database schema

### 3. Hot Reload

Changes are automatically reloaded in the browser.

### 4. Database Changes

If you modify `prisma/schema.prisma`:

```bash
bunx prisma migrate dev --name description_of_change
```

### 5. View Database

```bash
bunx prisma studio
```

Opens http://localhost:5555 with database GUI.

---

## Project Structure

```
finance-dashboard-pro/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication
│   │   ├── transactions/      # Transaction CRUD
│   │   ├── goals/             # Goals CRUD
│   │   ├── ai/                # AI chat
│   │   └── user/              # User profile
│   ├── auth/                  # Auth pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/             # Main dashboard
│   ├── onboarding/            # Onboarding flow
│   ├── settings/              # User settings
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/
│   ├── ai/                    # AI components
│   │   └── AIAssistant.tsx
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── auth.ts               # Auth utilities
│   ├── context.tsx           # Auth context
│   └── utils.ts              # Utilities
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration files
├── public/                   # Static files
├── .env.local               # Environment variables
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind config
├── next.config.ts           # Next.js config
└── README.md                # Project README
```

---

## Next Steps

1. **Explore the Dashboard**: Create transactions and goals
2. **Test AI Assistant**: Ask financial questions
3. **Customize**: Modify colors, add features
4. **Deploy**: Follow deployment guide in README.md

---

## Getting Help

- **Documentation**: See `DOCUMENTATION.md`
- **Issues**: Check GitHub Issues
- **Email**: noungajoseph58@gmail.com

---

## Quick Commands Reference

```bash
# Development
bun dev                          # Start dev server
bun run build                    # Build for production
bun run start                    # Start production server

# Database
bunx prisma migrate dev          # Create migration
bunx prisma migrate reset        # Reset database
bunx prisma studio              # Open database GUI
bunx prisma generate            # Generate Prisma client

# Utilities
bun run type-check              # Check TypeScript
bun run lint                    # Run ESLint
bun run format                  # Format code with Prettier
```

---

Happy coding! 🚀
