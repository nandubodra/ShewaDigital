# ShewaDigital

ShewaDigital is a bilingual government service portal built with Next.js, Tailwind CSS, and local API data storage. It supports:

- Hindi/English switching
- User and government profile sections
- Application tracking workflow
- Document upload simulation
- Government approval dashboard
- Service-based form submission flow

## Stack

- Frontend: Next.js + React + Tailwind CSS
- Backend: Next.js API routes
- Storage: Local JSON file persistence for demo mode
- Optional production upgrades: PostgreSQL + Supabase Auth + Cloudinary/S3 + OpenAI/Claude OCR

## Run locally

1. Install dependencies:
   npm install

2. Start dev server:
   npm run dev

3. Open app:
   http://localhost:3000

## Demo credentials

Citizen account:
- Email: user@shewadigital.in
- Password: password123

Government account:
- Email: admin@shewadigital.in
- Password: admin123

## Notes

This is a full working demo website. For production, replace local JSON storage with PostgreSQL and add Supabase Auth, S3/Cloudinary upload, and AI OCR services.
