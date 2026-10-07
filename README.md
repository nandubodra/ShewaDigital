# ShewaDigital

AI-powered government service portal for citizens, government offices, and application tracking.

## Stack

- Frontend: Next.js + React + Tailwind CSS
- Backend: Next.js API routes
- Auth: Supabase Auth
- AI: OpenAI / Claude
- Storage: local uploads for demo, Supabase Storage ready for production
- PDF/print: ready for jsPDF / react-pdf

## Run locally

1. Install packages:
   npm install

2. Set environment variables in `.env.local`:
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   OPENAI_API_KEY=...

3. Start app:
   npm run dev

4. Open:
   http://localhost:3000

## Demo login

Use your Supabase auth or test with these sample credentials after setup:
- Email: user@shewadigital.in
- Password: password123

## Notes

This project is built for real-world extension. Replace demo flows with Supabase DB tables, storage bucket policies, OTP email, and AI extraction APIs for production.
