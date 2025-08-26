# Project Foundation

Eine moderne, skalierbare Grundlage für alle Ihre Projekte. Mit TypeScript, Fastify, Next.js und Supabase.

## 🚀 Features

- **Vollständige TypeScript-Unterstützung** - End-to-End Type Safety
- **Moderne API mit Fastify** - Schnell, sicher und skalierbar
- **Next.js 14 Frontend** - App Router, Server Components, optimierte Performance
- **Supabase Integration** - PostgreSQL mit Prisma ORM
- **Authentifizierung & Autorisierung** - JWT, RBAC, Multi-Tenant
- **Swagger API-Dokumentation** - Automatische API-Docs
- **Docker-Containerisierung** - Einfache Deployment-Pipeline
- **CI/CD mit GitHub Actions** - Automatisierte Builds und Deployments

## 🏗️ Architektur

```
project-foundation/
├── backend/                 # Fastify API Server
│   ├── src/
│   │   ├── routes/         # API Endpoints
│   │   ├── middleware/     # Auth & Validation
│   │   └── index.ts        # Server Entry Point
│   ├── prisma/             # Database Schema & Migrations
│   └── package.json        # Backend Dependencies
├── frontend/               # Next.js 14 Application
│   ├── src/
│   │   ├── app/           # App Router Pages
│   │   └── components/    # Reusable UI Components
│   ├── tailwind.config.js # Tailwind CSS Configuration
│   └── package.json       # Frontend Dependencies
├── shared/                 # Shared Types & Utilities
├── docs/                   # Project Documentation
├── scripts/                # Build & Deployment Scripts
└── package.json            # Root Monorepo Configuration
```

## 🛠️ Tech Stack

### Backend
- **Fastify** - Web Framework
- **TypeScript** - Type Safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Zod** - Validation
- **Swagger** - API Documentation

### Frontend
- **Next.js 14** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Hook Form** - Form Handling
- **Zustand** - State Management
- **Axios** - HTTP Client

## 🚀 Quick Start

### Voraussetzungen

- Node.js 18+ 
- npm 9+
- PostgreSQL Database
- Docker (optional)

### Installation

1. **Repository klonen**
   ```bash
   git clone <your-repo-url>
   cd project-foundation
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   npm run setup
   ```

3. **Umgebungsvariablen konfigurieren**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

4. **Datenbank einrichten**
   ```bash
   cd backend
   npm run db:generate
   npm run db:push
   ```

5. **Entwicklungsserver starten**
   ```bash
   # Beide Server gleichzeitig
   npm run dev
   
   # Oder einzeln
   npm run dev:backend    # Port 3001
   npm run dev:frontend   # Port 3000
   ```

## 📁 Projektstruktur

### Backend (`/backend`)

- **`src/routes/`** - API Endpoints (auth, users, organizations, etc.)
- **`src/middleware/`** - Authentication, validation, error handling
- **`src/index.ts`** - Server entry point mit Plugin-Registrierung
- **`prisma/schema.prisma`** - Database schema mit Multi-Tenant Support

### Frontend (`/frontend`)

- **`src/app/`** - Next.js App Router Struktur
- **`src/components/`** - Wiederverwendbare UI-Komponenten
- **`tailwind.config.js`** - Erweiterte Tailwind-Konfiguration
- **`globals.css`** - Globale Styles und CSS-Variablen

## 📚 Verfügbare Scripts

### Root Level
```bash
npm run dev              # Beide Server starten
npm run build            # Alle Workspaces bauen
npm run test             # Alle Tests ausführen
npm run lint             # Code-Linting
npm run format           # Code-Formatierung
npm run setup            # Dependencies installieren
```

### Backend
```bash
npm run dev              # Development Server
npm run build            # TypeScript kompilieren
npm run start            # Production Server
npm run db:generate      # Prisma Client generieren
npm run db:push          # Schema zur DB pushen
npm run db:studio        # Prisma Studio öffnen
```

### Frontend
```bash
npm run dev              # Development Server
npm run build            # Production Build
npm run start            # Production Server
npm run type-check       # TypeScript prüfen
```

## 🐳 Docker Setup

### Docker Compose
```bash
docker-compose up -d
```

### Einzelne Services
```bash
# Backend
docker build -t project-foundation-backend ./backend
docker run -p 3001:3001 project-foundation-backend

# Frontend
docker build -t project-foundation-frontend ./frontend
docker run -p 3000:3000 project-foundation-frontend
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build:frontend
# Deploy to Vercel
```

### Backend (Railway/Heroku)
```bash
npm run build:backend
# Deploy to Railway/Heroku
```

### CI/CD (GitHub Actions)
```bash
# Automatische Deployments bei Push zu main
```

## 📖 API Dokumentation

Nach dem Start des Backend-Servers ist die Swagger-Dokumentation verfügbar unter:

- **Swagger UI**: `http://localhost:3001/docs`
- **OpenAPI Spec**: `http://localhost:3001/docs/json`

## 🔐 Authentifizierung

### JWT Token
```bash
# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Response
{
  "success": true,
  "token": "jwt-token-here",
  "user": { ... }
}
```

### Geschützte Routen
```bash
# Header hinzufügen
Authorization: Bearer <jwt-token>

# Oder Cookie
Cookie: token=<jwt-token>
```

## 🏢 Multi-Tenant Support

Das System unterstützt mehrere Organisationen:

- **Organizations** - Verschiedene Workspaces/Unternehmen
- **Organization Members** - Benutzer mit Rollen (OWNER, ADMIN, MEMBER, GUEST)
- **Resource Isolation** - Daten sind pro Organisation getrennt

## 🧪 Testing

```bash
# Backend Tests
cd backend
npm run test

# Frontend Tests
cd frontend
npm run test

# Alle Tests
npm run test
```

## 📝 Code Quality

```bash
# Linting
npm run lint

# Formatierung
npm run format

# Type Checking
npm run type-check
```

## 🔧 Entwicklung

### Neue Route hinzufügen
1. Datei in `backend/src/routes/` erstellen
2. In `backend/src/index.ts` registrieren
3. Swagger-Schema definieren

### Neue Komponente erstellen
1. Datei in `frontend/src/components/` erstellen
2. TypeScript-Interface definieren
3. Tailwind-Klassen verwenden

## 📚 Dokumentation

- [Fastify Documentation](https://www.fastify.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Beitragen

1. Fork erstellen
2. Feature Branch: `git checkout -b feature/amazing-feature`
3. Commits: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

## 🆘 Support

- **Issues**: GitHub Issues verwenden
- **Discussions**: GitHub Discussions für Fragen
- **Wiki**: Projekt-Wiki für detaillierte Dokumentation

## 🎯 Roadmap

- [ ] GraphQL Support
- [ ] Real-time Features (WebSocket)
- [ ] File Upload Service
- [ ] Email Service Integration
- [ ] Advanced Analytics
- [ ] Mobile App (React Native)
- [ ] Microservices Architecture

---

**Project Foundation** - Die moderne Grundlage für alle Ihre Projekte! 🚀
