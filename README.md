# Student Management System

A modern student management system built with Next.js 15, Tailwind CSS, and Supabase.

## Features

- 🔐 Authentication with Supabase Auth
- 📊 Dashboard with summary statistics
- 👥 Student management (CRUD operations)
- 🔍 Search functionality
- 📱 Responsive design
- ✅ Form validation with React Hook Form and Zod

## Tech Stack

- Next.js 15 (App Router)
- Tailwind CSS
- Supabase (Auth + PostgreSQL)
- React Hook Form + Zod
- TypeScript

## Prerequisites

- Node.js 18+ installed
- Supabase account and project

## Setup

1. Clone the repository:
```bash
git clone https://github.com/MarkeloPuangpoo/STMs.git
cd student-management
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up your Supabase database:
   - Create a new table called `students` with the following columns:
     - `student_id` (text, primary key)
     - `first_name` (text)
     - `last_name` (text)
     - `class` (text)
     - `phone` (text)
     - `email` (text)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   └── (dashboard)/
│       ├── dashboard/
│       └── students/
├── components/
│   └── ui/
├── lib/
│   ├── supabase/
│   └── validations/
└── middleware.ts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
