# Finance Dashboard Pro 💰

A production-ready personal finance management application with AI-powered financial advice, built with Next.js, PostgreSQL, and Claude AI.

## 🌟 Features

### Authentication & User Management
- ✅ Secure user registration and login
- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ User profile management
- ✅ Personalized onboarding questionnaire

### Financial Tracking
- ✅ Add, edit, and delete transactions
- ✅ Categorize income and expenses
- ✅ Real-time balance calculations
- ✅ Transaction history and filtering
- ✅ Multiple expense categories

### Financial Goals
- ✅ Create and track financial goals
- ✅ Visual progress bars
- ✅ Goal completion tracking
- ✅ Target date management
- ✅ Multiple goal categories

### AI Financial Advisor
- ✅ Claude AI-powered financial advice
- ✅ Personalized recommendations based on user profile
- ✅ Conversation history
- ✅ Context-aware responses using financial data
- ✅ Real-time chat interface

### Dashboard
- ✅ Key metrics cards (Income, Expenses, Balance)
- ✅ Transaction overview
- ✅ Goals progress visualization
- ✅ Dark mode support
- ✅ Responsive design

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT, bcryptjs
- **AI**: Claude API (Anthropic)
- **State Management**: React Context API
- **UI Components**: shadcn/ui
- **Notifications**: Sonner
- **Theme**: next-themes

## 📋 Prerequisites

- Node.js 18+ or Bun
- PostgreSQL 12+
- Claude API key from Anthropic

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/NoungaJoseph/finance-dashboard-pro.git
cd finance-dashboard-pro
```

### 2. Install Dependencies

```bash
bun install
# or
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/finance_dashboard_pro"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY="your-claude-api-key"
```

### 4. Set Up Database

```bash
# Create the database
createdb finance_dashboard_pro

# Run migrations
bunx prisma migrate dev --name init
```

### 5. Run Development Server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Project Structure

```
finance-dashboard-pro/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── transactions/      # Transaction management
│   │   ├── goals/             # Financial goals
│   │   ├── ai/                # AI assistant
│   │   └── user/              # User profile
│   ├── auth/                  # Auth pages (login, signup)
│   ├── dashboard/             # Main dashboard
│   ├── onboarding/            # User onboarding
│   ├── settings/              # User settings
│   └── layout.tsx             # Root layout
├── components/
│   ├── ai/                    # AI assistant component
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── auth.ts               # Authentication utilities
│   ├── context.tsx           # Auth context provider
│   └── utils.ts              # Utility functions
├── prisma/
│   └── schema.prisma         # Database schema
└── public/                   # Static assets
```

## 🔐 Authentication Flow

1. **Signup**: User creates account with email and password
2. **Onboarding**: User answers personal finance questions
3. **Login**: User logs in with credentials
4. **JWT Token**: Token stored in localStorage for API requests
5. **Protected Routes**: Dashboard and settings require authentication

## 💬 AI Assistant Features

The AI assistant uses Claude to provide personalized financial advice based on:

- User's occupation and income
- Household size and living situation
- Financial goals and risk tolerance
- Recent transactions and spending patterns
- Current financial goals

### Example Interactions

- "What are some tips to save money?"
- "How should I budget my income?"
- "What's a good emergency fund amount?"
- "How can I reach my financial goals faster?"

## 📊 Database Schema

### User Model
- Email, password, name
- Occupation, income, household size
- Living situation, location
- Risk tolerance, savings rate, monthly budget

### Transaction Model
- Description, category, amount
- Date, type (income/expense)
- User reference

### FinancialGoal Model
- Name, target amount, current amount
- Target date, category
- User reference

### AIConversation & AIMessage Models
- Conversation history
- Message role (user/assistant)
- Timestamps

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT authentication
- ✅ Protected API routes
- ✅ Environment variable protection
- ✅ HTTPS on production
- ✅ No sensitive data in localStorage

## 🎨 UI/UX Features

- ✅ Clean, minimalist design
- ✅ Dark mode support
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Smooth animations
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🚢 Deployment

### Deploy to Vercel

```bash
vercel deploy
```

### Deploy to Other Platforms

1. Build the application:
```bash
bun run build
```

2. Start the production server:
```bash
bun run start
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal

### AI Assistant
- `POST /api/ai/chat` - Send message to AI

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## 🐛 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env.local
- Verify database exists

### AI Assistant Not Responding
- Check ANTHROPIC_API_KEY is valid
- Verify API key has sufficient credits
- Check network connection

### Authentication Issues
- Clear localStorage and try again
- Verify NEXTAUTH_SECRET is set
- Check token expiration

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👤 Author

Nounga Joseph - [GitHub](https://github.com/NoungaJoseph)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email noungajoseph58@gmail.com or open an issue on GitHub.

---

**Live Demo**: https://finance-dashboard-pro.lindy.site

**Repository**: https://github.com/NoungaJoseph/finance-dashboard-pro
