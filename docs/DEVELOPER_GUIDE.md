# ProcessIO Developer Guide

## Overview

ProcessIO is a modern web application for business process documentation and visualization built with the following tech stack:

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **BPMN Engine**: bpmn-js library
- **Deployment**: Vercel-ready with German localization

## Project Structure

```
processiov2/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── process/[id]/bpmn/    # BPMN data endpoints
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   └── confirm/
│   ├── protected/                # Protected routes
│   │   ├── page.tsx              # Dashboard (process list)
│   │   └── process/[id]/         # Process detail view
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── bpmn/                     # BPMN-related components
│   │   ├── BpmnEditor.tsx        # BPMN editor component
│   │   ├── BpmnViewer.tsx        # BPMN viewer component
│   │   ├── BpmnPanel.tsx         # Combined panel component
│   │   └── ViewerSection.tsx     # Viewer section wrapper
│   ├── ui/                       # shadcn/ui components
│   └── [various-components].tsx  # Auth, tutorial, theme components
├── lib/                          # Utilities and configuration
│   ├── supabase/                 # Supabase client configuration
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── middleware.ts         # Session middleware
│   └── utils.ts                  # General utilities
├── docs/                         # Documentation
│   └── bpmn-js.txt              # BPMN.js reference
├── middleware.ts                 # Next.js middleware
├── package.json                  # Dependencies
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── next.config.ts               # Next.js configuration
```

## Key Architecture Components

### 1. Authentication Flow

**Location**: `lib/supabase/`

The app uses Supabase for authentication with cookie-based sessions:

- **Browser Client** (`lib/supabase/client.ts`): Client-side operations
- **Server Client** (`lib/supabase/server.ts`): Server-side operations with cookie handling
- **Middleware** (`lib/supabase/middleware.ts`): Session validation and route protection

**Protected Routes**: All routes under `/protected/` require authentication

### 2. BPMN Integration

**Location**: `components/bpmn/`

The BPMN functionality is built on the bpmn-js library:

- **BpmnEditor.tsx**: Full editing capabilities using bpmn-js/lib/Modeler
- **BpmnViewer.tsx**: Read-only viewing using bpmn-js/lib/Viewer
- **BpmnPanel.tsx**: Combined component that switches between editor/viewer
- **ViewerSection.tsx**: Wrapper for viewer functionality

**Key Features**:
- Dynamic import of bpmn-js (client-side only)
- XML import/export capabilities
- Fit-to-viewport functionality
- Proper cleanup on component unmount

### 3. API Architecture

**Current Endpoints**:
- `GET /api/process/[id]/bpmn` - Returns BPMN XML for a process
- `GET /auth/confirm` - Email confirmation handler

**Missing Endpoints** (planned):
- `PUT /api/process/[id]/bpmn` - Save BPMN XML
- `POST /api/process` - Create new process
- `GET /api/process` - List processes
- `DELETE /api/process/[id]` - Delete process

### 4. Data Layer

**Current State**: Mostly mock data
- Process data is hardcoded in components
- Only `notes` table exists in Supabase
- BPMN XML is served as static mock data

**Schema Needed**:
```sql
-- Processes table
CREATE TABLE processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT,
  detailed_description TEXT,
  status VARCHAR DEFAULT 'draft',
  author_id UUID REFERENCES auth.users(id),
  department VARCHAR,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  version VARCHAR DEFAULT '1.0'
);

-- BPMN diagrams table
CREATE TABLE bpmn_diagrams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID REFERENCES processes(id),
  xml_content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Development Workflow

### Getting Started

1. **Environment Setup**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

### Key Commands

- `npm run dev` - Start development server (uses Turbopack)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Configuration Files

- **Next.js**: `next.config.ts` - Basic configuration
- **TypeScript**: `tsconfig.json` - Strict mode enabled
- **Tailwind**: `tailwind.config.ts` - shadcn/ui integration
- **ESLint**: `eslint.config.mjs` - Next.js + TypeScript rules
- **PostCSS**: `postcss.config.mjs` - Tailwind + Autoprefixer
- **shadcn/ui**: `components.json` - Component configuration

## Component Architecture

### UI Components (shadcn/ui)

**Location**: `components/ui/`

Pre-built components following the shadcn/ui pattern:
- Button, Card, Input, Label, Textarea
- Badge, Checkbox, DropdownMenu
- All components use Tailwind CSS with CSS variables

### BPMN Components

**BpmnEditor.tsx**:
```typescript
// Usage
<BpmnEditor xml={bpmnXml} ref={editorRef} />

// Save functionality
const xml = await editorRef.current?.save();
```

**BpmnViewer.tsx**:
```typescript
// Usage
<BpmnViewer xml={bpmnXml} />
```

**BpmnPanel.tsx**:
```typescript
// Usage
<BpmnPanel processId="123" />
// Handles API calls and switching between edit/view modes
```

### Authentication Components

- **LoginForm**: Email/password login
- **SignUpForm**: User registration
- **ForgotPasswordForm**: Password reset
- **UpdatePasswordForm**: Password update
- **LogoutButton**: Sign out functionality

## Data Flow

### Process Management

1. **List View** (`/protected`):
   - Displays mock process data
   - Shows process cards with status, tags, metadata
   - Links to detail views

2. **Detail View** (`/protected/process/[id]`):
   - Shows process metadata and description
   - Embeds BPMN viewer/editor
   - Fetches BPMN XML via API

3. **BPMN Handling**:
   - API endpoint serves XML
   - Components handle import/export
   - Editor provides save functionality

### Authentication Flow

1. **Login** → Supabase Auth → Session Cookie → Protected Routes
2. **Middleware** validates session on every request
3. **Redirect** to `/auth/login` if unauthenticated

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-anon-key
```

## Styling System

### Tailwind CSS

- **CSS Variables**: Theme colors defined in `globals.css`
- **Dark Mode**: Supported via `next-themes`
- **Responsive**: Mobile-first approach
- **Animation**: `tailwindcss-animate` for smooth transitions

### Theme Colors

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  /* ... more colors */
}
```

## Common Patterns

### Server Components with Auth

```typescript
export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  
  if (error || !data?.claims) {
    redirect("/auth/login");
  }
  
  // Component logic
}
```

### Client-Side API Calls

```typescript
const response = await fetch(`/api/process/${id}/bpmn`);
const xml = await response.text();
```

### Form Handling

```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData);
  
  // Process form data
};
```

## Development Tips

### File Organization

- Keep components small and focused
- Use proper TypeScript interfaces
- Separate API logic from UI components
- Follow Next.js App Router conventions

### Performance

- Use dynamic imports for heavy libraries (bpmn-js)
- Implement proper loading states
- Use Next.js Image optimization
- Leverage React 19 features

### Error Handling

- Implement proper try-catch blocks
- Show user-friendly error messages
- Log errors for debugging
- Use loading states for async operations

## Deployment

### Vercel Deployment

1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Setup

- Supabase project with proper configuration
- Authentication providers configured
- Database schema deployed
- Environment variables set

## Next Steps & TODOs

### High Priority

1. **Database Schema**: Create proper tables for processes and BPMN data
2. **API Endpoints**: Implement CRUD operations for processes
3. **Data Integration**: Replace mock data with real database queries
4. **BPMN Storage**: Implement proper BPMN XML storage and retrieval

### Medium Priority

1. **User Management**: Add user profiles and permissions
2. **Process Templates**: Pre-built process templates
3. **Collaboration**: Multi-user editing capabilities
4. **Export Features**: PDF/PNG export of BPMN diagrams

### Low Priority

1. **Advanced Search**: Full-text search for processes
2. **Analytics**: Process usage analytics
3. **Integration**: API for external systems
4. **Mobile App**: React Native companion app

## Troubleshooting

### Common Issues

1. **BPMN Import Errors**: Check XML format and bpmn-js version
2. **Auth Redirects**: Verify middleware configuration
3. **CSS Issues**: Check Tailwind classes and imports
4. **API Errors**: Verify Supabase connection and credentials

### Debugging Tips

1. Use browser DevTools for client-side issues
2. Check Next.js console for server-side errors
3. Verify Supabase dashboard for auth/database issues
4. Test API endpoints directly with curl/Postman

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [bpmn-js Documentation](https://bpmn.io/toolkit/bpmn-js/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)