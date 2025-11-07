# Finance Dashboard Pro - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Documentation](#api-documentation)
5. [Frontend Components](#frontend-components)
6. [Authentication System](#authentication-system)
7. [AI Assistant Integration](#ai-assistant-integration)
8. [Deployment Guide](#deployment-guide)
9. [Development Guide](#development-guide)

## Overview

Finance Dashboard Pro is a full-stack web application that helps users manage their personal finances with AI-powered insights. The application provides:

- User authentication and profile management
- Transaction tracking (income and expenses)
- Financial goal setting and tracking
- AI-powered financial advisor using Claude
- Real-time dashboard with key metrics
- Dark mode support
- Responsive design

## Architecture

### Technology Stack

```
Frontend:
├── Next.js 15 (App Router)
├── React 19
├── TypeScript
├── Tailwind CSS
├── shadcn/ui Components
└── next-themes (Dark Mode)

Backend:
├── Next.js API Routes
├── Prisma ORM
├── PostgreSQL
├── JWT Authentication
└── bcryptjs (Password Hashing)

AI:
└── Claude API (Anthropic)
```

### Application Flow

```
User → Login/Signup → Onboarding → Dashboard
                                      ├── View Transactions
                                      ├── Manage Goals
                                      ├── Chat with AI
                                      └── Update Settings
```

## Database Schema

### User Model

```prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  password          String
  name              String
  occupation        String?
  income            Float?
  householdSize     Int?
  livingWith        String?
  location          String?
  riskTolerance     String?
  monthlyBudget     Float?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  transactions      Transaction[]
  goals             FinancialGoal[]
  conversations     AIConversation[]
}
```

**Fields:**
- `email`: Unique email address for login
- `password`: Hashed password
- `name`: User's full name
- `occupation`: Job title/profession
- `income`: Monthly income in currency
- `householdSize`: Number of people in household
- `livingWith`: Living situation (alone, family, roommates, partner)
- `location`: City/Country
- `riskTolerance`: Investment risk level (low, medium, high)
- `monthlyBudget`: Monthly spending budget

### Transaction Model

```prisma
model Transaction {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  description String
  category    String
  amount      Float
  date        DateTime
  type        String    // "income" or "expense"
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

**Fields:**
- `description`: Transaction description
- `category`: Category (salary, food, utilities, etc.)
- `amount`: Transaction amount
- `date`: Transaction date
- `type`: "income" or "expense"

### FinancialGoal Model

```prisma
model FinancialGoal {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  name          String
  targetAmount  Float
  currentAmount Float     @default(0)
  targetDate    DateTime
  category      String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

**Fields:**
- `name`: Goal name (e.g., "Emergency Fund")
- `targetAmount`: Target amount to save
- `currentAmount`: Current saved amount
- `targetDate`: Target completion date
- `category`: Goal category

### AIConversation Model

```prisma
model AIConversation {
  id        String       @id @default(cuid())
  userId    String
  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages  AIMessage[]
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
}

model AIMessage {
  id             String          @id @default(cuid())
  conversationId String
  conversation   AIConversation  @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role           String          // "user" or "assistant"
  content        String
  createdAt      DateTime        @default(now())
}
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/signup

Create a new user account.

**Request:**
```json
{
  "name": "Nounga Joseph",
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "Nounga Joseph"
  },
  "token": "jwt-token"
}
```

#### POST /api/auth/login

Authenticate user and get JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "Nounga Joseph"
  },
  "token": "jwt-token"
}
```

### Transaction Endpoints

#### GET /api/transactions

Get all transactions for the authenticated user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "trans-1",
    "description": "Monthly Salary",
    "category": "Salary",
    "amount": 5000,
    "date": "2025-11-07T00:00:00Z",
    "type": "income"
  }
]
```

#### POST /api/transactions

Create a new transaction.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "description": "Grocery Shopping",
  "category": "Food",
  "amount": 150,
  "date": "2025-11-07T00:00:00Z",
  "type": "expense"
}
```

### Goals Endpoints

#### GET /api/goals

Get all financial goals for the authenticated user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "goal-1",
    "name": "Emergency Fund",
    "targetAmount": 10000,
    "currentAmount": 2500,
    "targetDate": "2026-11-07T00:00:00Z",
    "category": "Savings"
  }
]
```

#### POST /api/goals

Create a new financial goal.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Emergency Fund",
  "targetAmount": 10000,
  "targetDate": "2026-11-07T00:00:00Z",
  "category": "Savings"
}
```

### AI Chat Endpoint

#### POST /api/ai/chat

Send a message to the AI financial advisor.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "message": "What are some tips to save money?",
  "conversationId": "conv-id" // optional
}
```

**Response:**
```json
{
  "message": "Based on your $5000 monthly income...",
  "conversationId": "conv-id"
}
```

### User Profile Endpoint

#### GET /api/user/profile

Get user profile information.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "Nounga Joseph",
  "occupation": "Software Engineer",
  "income": 5000,
  "householdSize": 2,
  "livingWith": "Family",
  "location": "Lagos, Nigeria",
  "riskTolerance": "medium",
  "monthlyBudget": 2000
}
```

#### PUT /api/user/profile

Update user profile information.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Nounga Joseph",
  "occupation": "Senior Software Engineer",
  "income": 6000,
  "monthlyBudget": 2500
}
```

## Frontend Components

### Layout Components

#### AuthProvider (`lib/context.tsx`)

Provides authentication state to the entire application.

```tsx
<AuthProvider>
  <App />
</AuthProvider>
```

**Context Methods:**
- `login(email, password)` - Authenticate user
- `signup(name, email, password)` - Create new account
- `logout()` - Clear authentication
- `updateProfile(data)` - Update user profile

### Pages

#### Login Page (`app/auth/login/page.tsx`)

User login interface with email and password fields.

#### Signup Page (`app/auth/signup/page.tsx`)

User registration with name, email, and password.

#### Onboarding Page (`app/onboarding/page.tsx`)

4-step questionnaire:
1. Occupation and Income
2. Household Information
3. Location
4. Financial Preferences

#### Dashboard Page (`app/dashboard/page.tsx`)

Main dashboard with:
- Key metrics (Income, Expenses, Balance)
- Transaction list
- Financial goals
- AI Assistant chat

#### Settings Page (`app/settings/page.tsx`)

User profile management and preferences.

### AI Components

#### AIAssistant (`components/ai/AIAssistant.tsx`)

Chat interface for AI financial advisor.

**Features:**
- Message history
- Real-time responses
- Loading states
- Auto-scroll to latest message

## Authentication System

### JWT Implementation

1. **Token Generation** (on login/signup):
```typescript
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.NEXTAUTH_SECRET,
  { expiresIn: '7d' }
);
```

2. **Token Storage** (client-side):
```typescript
localStorage.setItem('token', token);
```

3. **Token Usage** (API requests):
```typescript
headers: {
  'Authorization': `Bearer ${token}`
}
```

4. **Token Verification** (server-side):
```typescript
const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
```

### Password Security

- Passwords hashed with bcryptjs (10 salt rounds)
- Never stored in plain text
- Compared using bcryptjs.compare()

## AI Assistant Integration

### Claude API Integration

The AI assistant uses Claude to provide personalized financial advice.

### System Prompt

The system prompt includes:
- User's financial profile
- Recent transactions
- Active financial goals
- Risk tolerance and preferences

### Example Interaction

```
User: "How can I save more money?"

System Context:
- Income: $5000/month
- Budget: $2000/month
- Risk Tolerance: Medium
- Recent Expenses: Food ($150), Utilities ($100)
- Goals: Emergency Fund ($2500/$10000)

Claude Response: "Based on your profile, here are personalized tips..."
```

## Deployment Guide

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Claude API key
- Vercel account (for deployment)

### Environment Variables

Create `.env.local`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/finance_dashboard_pro"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
ANTHROPIC_API_KEY="your-claude-api-key"
```

### Build and Deploy

```bash
# Build
bun run build

# Test production build locally
bun run start

# Deploy to Vercel
vercel deploy --prod
```

## Development Guide

### Local Development Setup

1. **Clone repository:**
```bash
git clone https://github.com/NoungaJoseph/finance-dashboard-pro.git
cd finance-dashboard-pro
```

2. **Install dependencies:**
```bash
bun install
```

3. **Set up database:**
```bash
createdb finance_dashboard_pro
bunx prisma migrate dev --name init
```

4. **Create .env.local:**
```env
DATABASE_URL="postgresql://localhost/finance_dashboard_pro"
NEXTAUTH_SECRET="dev-secret-key"
ANTHROPIC_API_KEY="your-api-key"
```

5. **Run development server:**
```bash
bun dev
```

6. **Open browser:**
```
http://localhost:3000
```

### Database Migrations

```bash
# Create new migration
bunx prisma migrate dev --name migration_name

# View database
bunx prisma studio
```

### Testing

```bash
# Run tests
bun test

# Run tests in watch mode
bun test --watch
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting

### Common Tasks

**Add new API endpoint:**
1. Create file in `app/api/[route]/route.ts`
2. Implement GET/POST/PUT/DELETE handlers
3. Add authentication check
4. Return JSON response

**Add new component:**
1. Create file in `components/`
2. Use TypeScript for props
3. Import shadcn/ui components
4. Add Tailwind CSS classes

**Update database schema:**
1. Edit `prisma/schema.prisma`
2. Run `bunx prisma migrate dev --name description`
3. Update API routes if needed

## Troubleshooting

### Common Issues

**Database Connection Error**
- Check PostgreSQL is running
- Verify DATABASE_URL
- Run migrations: `bunx prisma migrate dev`

**AI Assistant Not Responding**
- Verify ANTHROPIC_API_KEY
- Check API key has credits
- Review API rate limits

**Authentication Issues**
- Clear localStorage
- Check NEXTAUTH_SECRET
- Verify JWT token format

**Build Errors**
- Clear `.next` folder
- Reinstall dependencies: `bun install`
- Check TypeScript errors: `bun run type-check`

## Performance Optimization

- Next.js Image optimization
- Database query optimization with Prisma
- Client-side caching with React Context
- API response caching
- Code splitting with dynamic imports

## Security Best Practices

- ✅ HTTPS only in production
- ✅ Environment variables for secrets
- ✅ Password hashing with bcryptjs
- ✅ JWT token expiration
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection (React)

## Future Enhancements

- [ ] Multi-currency support
- [ ] Budget alerts and notifications
- [ ] Investment tracking
- [ ] Tax optimization suggestions
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reports
- [ ] Recurring transactions
- [ ] Bill reminders
- [ ] Integration with banking APIs
- [ ] Export to CSV/PDF

---

For more information, visit the [GitHub Repository](https://github.com/NoungaJoseph/finance-dashboard-pro)
