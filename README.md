# Toggl Clone

A powerful time tracking application built with Next.js 14, TypeScript, Supabase, and Tailwind CSS.

## 🚀 Live Demo

Deploy your own instance on Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/toggl-clone&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY)

## ✨ Features

- ⏱️ Real-time timer tracking
- 📁 Project management
- 📊 Time reports and analytics
- 🔄 Multi-device sync via Supabase Realtime
- 🌙 Dark mode support
- 📱 Fully responsive design
- 🔐 Secure authentication with Supabase Auth
- 📊 Beautiful charts with Recharts
- 🎯 Type-safe with TypeScript

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Backend**: [Supabase](https://supabase.com/) (Auth, Database, Realtime)
- **UI Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## 📋 Prerequisites

- [GitHub account](https://github.com/)
- [Supabase account](https://supabase.com/)
- [Vercel account](https://vercel.com/)
- Node.js 18.17.0+ (for local development)

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project
3. Save your project URL and anon key

### 2. Deploy to Vercel

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### 3. Set up Database

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and run the contents of `supabase/schema.sql`

### 4. Configure Authentication

1. In Supabase: Authentication → URL Configuration
2. Set Site URL to your Vercel deployment URL
3. Add `https://your-app.vercel.app/auth/callback` to Redirect URLs

## 💻 Local Development

If you want to run the project locally:

```bash
# Clone the repository
git clone <repository-url>
cd toggl-clone

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

## 📁 Project Structure

```
toggl-clone/
├── app/                  # Next.js App Router
│   ├── (auth)/          # Authentication pages
│   ├── (dashboard)/     # Protected pages
│   └── auth/            # Auth endpoints
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── store/              # Zustand stores
├── types/              # TypeScript types
├── utils/              # Utility functions
│   ├── supabase/       # Supabase clients
│   └── helpers/        # Helper functions
├── supabase/           # Database schema
└── public/             # Static assets
```

## 🗄️ Database Schema

The application uses PostgreSQL via Supabase with the following main tables:

- `profiles` - User profiles and settings
- `projects` - User projects with color coding
- `time_entries` - Time tracking records
- `client_logs` - Error logging for debugging

All tables include Row Level Security (RLS) policies for data isolation.

## 🔐 Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site URL is automatically set by Vercel
# For local development, you can set:
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📚 Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Detailed deployment instructions
- [Specification](./SPECIFICATION.md) - Complete feature specification
- [Database Schema](./supabase/schema.sql) - SQL schema definition

## 🧪 Development Commands

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Toggl Track](https://toggl.com/)
- Built with [Next.js](https://nextjs.org/) and [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)

## 🐛 Known Issues

- Time zone handling is fixed to Asia/Tokyo
- Email templates need to be configured in Supabase for production use

## 📧 Support

For support, please open an issue in the GitHub repository.