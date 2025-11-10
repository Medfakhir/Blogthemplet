# 🎬 IPTV Blog - Modern Content Management System

A professional, SEO-optimized blog platform built with Next.js 15, TypeScript, and Prisma. Perfect for IPTV-related content, reviews, and guides.

## ✨ Features

### 🎯 Content Management
- **Rich Text Editor** - TipTap editor with fullscreen mode
- **SEO Analyzer** - Real-time SEO scoring and suggestions
- **Article Management** - Full CRUD operations with draft/publish workflow
- **Category & Tags** - Organize content efficiently
- **Media Library** - Upload and manage images
- **Comment System** - Built-in commenting functionality

### 🚀 Performance
- **ISR (Incremental Static Regeneration)** - Fast page loads
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Optimized bundle sizes
- **Caching Strategy** - Smart revalidation

### 🔒 Security
- **Security Headers** - HSTS, CSP, XSS protection
- **Input Validation** - Zod schemas for all inputs
- **Environment Validation** - Type-safe environment variables
- **Error Boundaries** - Graceful error handling

### 📊 SEO
- **Dynamic Sitemap** - Auto-generated from database
- **Schema Markup** - Article and Breadcrumb schemas
- **Meta Tags** - Complete Open Graph and Twitter cards
- **robots.txt** - Configured for search engines

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.6 (App Router)
- **Language:** TypeScript 5
- **Database:** MySQL with Prisma ORM
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI
- **Editor:** TipTap
- **Validation:** Zod
- **Icons:** Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- MySQL 8+
- npm or yarn

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Blogthemplet
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `env.example` to `.env` and fill in your values:

```bash
cp env.example .env
```

Required variables:
```env
DATABASE_URL="mysql://user:password@localhost:3306/iptv_blog"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── article/           # Article pages
│   │   └── ...
│   ├── components/            # React components
│   │   ├── admin/            # Admin components
│   │   ├── editor/           # Rich text editor
│   │   ├── seo/              # SEO components
│   │   └── ui/               # UI components
│   ├── lib/                   # Utilities
│   │   ├── db.ts             # Prisma client
│   │   ├── validations.ts    # Zod schemas
│   │   └── env.ts            # Environment validation
│   └── contexts/              # React contexts
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
└── public/                    # Static files
```

## 🎨 Admin Dashboard

Access the admin dashboard at `/admin/articles`

Features:
- Article management (create, edit, delete)
- Category management
- Tag management
- Media library
- Settings configuration
- Real-time SEO analysis

## 🔐 Security Features

- ✅ Security headers (HSTS, CSP, XSS protection)
- ✅ Input validation on all API routes
- ✅ Environment variable validation
- ✅ Error boundaries
- ✅ CORS configuration
- ⚠️ **Authentication not yet implemented** (coming soon)

## 📊 SEO Features

- ✅ Dynamic sitemap generation
- ✅ Article schema markup
- ✅ Breadcrumb schema
- ✅ Real-time SEO analyzer
- ✅ Meta tags optimization
- ✅ Open Graph images
- ✅ Twitter cards

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS
- DigitalOcean

## 📝 Environment Variables

See `env.example` for all available variables.

**Required:**
- `DATABASE_URL` - MySQL connection string

**Optional:**
- `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` - ImageKit public key
- `IMAGEKIT_PRIVATE_KEY` - ImageKit private key
- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` - ImageKit URL endpoint

## 🧪 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio
npx prisma migrate   # Run database migrations
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TipTap Documentation](https://tiptap.dev/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review the code comments

## 🎯 Roadmap

- [ ] Authentication system (NextAuth)
- [ ] Rate limiting
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Email notifications
- [ ] Advanced search
- [ ] Content scheduling
- [ ] User roles & permissions

## ⚡ Performance

- Build size: ~158 kB (shared JS)
- ISR caching: 15min - 1hr
- Lighthouse score: 90+ (target)

---

Built with ❤️ using Next.js
