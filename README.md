# Posify Delivery Hub

A modern POS system with delivery management capabilities.

## Features

- 🔐 PIN-based authentication system
- 👥 Multi-role support (Admin, Manager, Staff)
- 🛍️ Point of Sale interface
- 🚚 Delivery management
- 📊 Analytics dashboard
- ⚡ Real-time updates

## Tech Stack

- React + TypeScript
- Supabase (Database & Authentication)
- TailwindCSS
- Vite

## Getting Started

1. Clone the repository
```bash
git clone [your-repo-url]
cd posify-delivery-hub
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
```

## Default Login PINs

- Admin: 1234
- Manager: 5678
- Staff 1: 9012
- Staff 2: 3456

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## Security Notes

- Change default PINs in production
- Keep your `.env` file secure and never commit it
- Regularly rotate PINs for security
