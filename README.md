# Citizens' Atlas - Next.js

The Citizens' Atlas is a collaborative platform for mapping and documenting false solutions in circular economy and climate action. Discover citizen-led initiatives, research, and evidence-based analysis of environmental policies and corporate greenwashing.

## 🏗️ Project Structure

```
├── app/                          # Next.js App Router
│   ├── about/page.tsx           # About page
│   ├── admin/page.tsx           # Admin dashboard
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── map/page.tsx             # Interactive map
│   ├── news/page.tsx            # News listing
│   ├── page.tsx                 # Home page
│   ├── partner-with-us/page.tsx # Partner page
│   ├── publications/page.tsx    # Publications
│   └── what-we-do/page.tsx      # What we do page
├── public/                       # Static assets
├── src/                         # Source code
│   ├── components/              # React components
│   │   ├── features/            # Feature-specific components
│   │   │   ├── admin/           # Admin dashboard components
│   │   │   ├── articles/        # Article-related components
│   │   │   ├── map/             # Map components
│   │   │   └── projects/        # Project components
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/               # Page components
│   │   └── ui/                  # Reusable UI components
│   ├── lib/                     # Utility functions and constants
│   │   ├── constants.ts         # App constants and data
│   │   └── utils.ts             # Helper functions
│   └── types/                   # TypeScript type definitions
│       └── types.ts
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local`
   - Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📁 Key Changes from Vite to Next.js

### 🏗️ Architecture Changes

1. **App Router**: Migrated to Next.js 14+ App Router with file-based routing
2. **Professional Structure**: Organized components by features and functionality
3. **TypeScript Configuration**: Updated for Next.js with proper path aliases
4. **Build System**: Switched from Vite to Next.js build system

### 🎨 Styling & Assets

- **Tailwind CSS**: Properly configured for Next.js
- **Global Styles**: Moved to `app/globals.css`
- **Static Assets**: Moved to `public/` directory
- **Custom Design System**: Maintained brand colors and design tokens

### 🔧 Development Improvements

- **Hot Reloading**: Next.js fast refresh
- **SEO Optimization**: Built-in meta tags and SEO features
- **Performance**: Automatic code splitting and optimization
- **TypeScript**: Enhanced type checking and IntelliSense

## 📦 Production Deployment

```bash
npm run build
npm start
```

The application will be optimized for production with:
- Static Site Generation (SSG) where applicable
- Automatic code splitting
- Image optimization
- CSS optimization and minification

## 🤝 Contributing

1. Follow the established file structure
2. Use TypeScript for type safety
3. Follow Next.js and React best practices
4. Test components thoroughly
5. Update documentation as needed
