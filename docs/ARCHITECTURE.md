# ProcessIO Architecture Documentation

## System Overview

ProcessIO is a modern web application for business process documentation and visualization. It follows a client-server architecture with the following key components:

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser)                         │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────┐ │
│  │   Next.js App   │  │   BPMN Editor    │  │  Auth UI    │ │
│  │   (React 19)    │  │   (bpmn-js)      │  │ (Supabase)  │ │
│  └─────────────────┘  └──────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Server (Vercel)                         │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────┐ │
│  │   Next.js API   │  │   Middleware     │  │   Static    │ │
│  │   Routes        │  │   (Auth Guard)   │  │   Assets    │ │
│  └─────────────────┘  └──────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                │ API Calls
                                │
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Supabase)                       │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────┐ │
│  │   PostgreSQL    │  │   Auth Service   │  │   Storage   │ │
│  │   Database      │  │   (Users/Auth)   │  │   (Files)   │ │
│  └─────────────────┘  └──────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS + shadcn/ui
- **BPMN Engine**: bpmn-js 18.6.2
- **Icons**: Lucide React
- **Themes**: next-themes

### Backend
- **Runtime**: Node.js (Vercel Serverless)
- **API**: Next.js API Routes
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Session Management**: Supabase SSR

### Development Tools
- **Bundler**: Next.js with Turbopack
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript
- **Package Manager**: npm

## Architecture Layers

### 1. Presentation Layer

**Location**: `app/`, `components/`

**Responsibilities**:
- User interface rendering
- Client-side state management
- Form handling and validation
- BPMN diagram visualization

**Key Components**:
- **Pages**: Route-based components in `app/`
- **Components**: Reusable UI components in `components/`
- **Layouts**: Shared layout components

**Architecture Pattern**: Server Components + Client Components hybrid

```typescript
// Server Component Example
export default async function ProcessListPage() {
  const supabase = await createClient();
  const { data: processes } = await supabase
    .from('processes')
    .select('*');
  
  return <ProcessList processes={processes} />;
}

// Client Component Example
'use client';
export default function BpmnEditor({ xml }: { xml: string }) {
  const [modeler, setModeler] = useState<any>(null);
  
  useEffect(() => {
    // Initialize bpmn-js modeler
  }, []);
  
  return <div ref={containerRef} />;
}
```

### 2. Application Layer

**Location**: `app/api/`, `lib/`

**Responsibilities**:
- API endpoint definitions
- Business logic coordination
- Data validation and transformation
- Authentication and authorization

**Key Components**:
- **API Routes**: RESTful endpoints in `app/api/`
- **Middleware**: Authentication and session management
- **Utilities**: Helper functions and shared logic

**Architecture Pattern**: API Routes + Middleware

```typescript
// API Route Example
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('processes')
    .select('*')
    .eq('id', params.id);
  
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  
  return NextResponse.json(data);
}
```

### 3. Data Layer

**Location**: `lib/supabase/`

**Responsibilities**:
- Database connections and queries
- Data persistence and retrieval
- Schema management
- Authentication provider integration

**Key Components**:
- **Client Configuration**: Browser and server Supabase clients
- **Database Schema**: Process and BPMN data models
- **Authentication**: User management and session handling

**Architecture Pattern**: Repository Pattern (via Supabase client)

```typescript
// Database Client Example
export async function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => cookies.forEach(cookie => 
          cookieStore.set(cookie.name, cookie.value, cookie.options)
        ),
      },
    }
  );
}
```

## Data Architecture

### Current Schema (Minimal)

```sql
-- Authentication (managed by Supabase)
auth.users (
  id UUID PRIMARY KEY,
  email VARCHAR,
  created_at TIMESTAMP
);

-- Basic data table
public.notes (
  id UUID PRIMARY KEY,
  content TEXT,
  user_id UUID REFERENCES auth.users(id)
);
```

### Planned Schema (Full Application)

```sql
-- Processes table
CREATE TABLE processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT,
  detailed_description TEXT,
  status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'in_progress', 'archived')),
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  department VARCHAR,
  tags TEXT[],
  version VARCHAR DEFAULT '1.0',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- BPMN diagrams table
CREATE TABLE bpmn_diagrams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID REFERENCES processes(id) ON DELETE CASCADE,
  xml_content TEXT NOT NULL,
  version VARCHAR DEFAULT '1.0',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Process steps table
CREATE TABLE process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID REFERENCES processes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  element_id VARCHAR, -- BPMN element ID
  created_at TIMESTAMP DEFAULT NOW()
);

-- User permissions table
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  process_id UUID REFERENCES processes(id) ON DELETE CASCADE,
  permission_level VARCHAR CHECK (permission_level IN ('view', 'edit', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Component Architecture

### BPMN Components Hierarchy

```
BpmnPanel (Container)
├── BpmnViewer (Read-only)
│   ├── bpmn-js/lib/Viewer
│   └── Canvas controls
├── BpmnEditor (Edit mode)
│   ├── bpmn-js/lib/Modeler
│   ├── Palette
│   ├── Properties panel
│   └── Save/Export functions
└── ViewerSection (Wrapper)
    ├── Toolbar
    ├── Status indicators
    └── Mode switching
```

### Authentication Flow

```
Request → Middleware → Auth Check → Route Handler
    ↓
Protected Route?
    ↓
Yes → Validate Session → Allow/Redirect
    ↓
No → Continue to Handler
```

### State Management

**Client State**:
- React component state (useState, useReducer)
- Form state (controlled components)
- BPMN modeler state (bpmn-js instances)

**Server State**:
- Database queries (via Supabase client)
- Session management (via Supabase Auth)
- API responses (via Next.js API routes)

**Global State**:
- Theme (next-themes)
- Authentication status (Supabase context)

## API Design

### RESTful Endpoints

```
GET    /api/process              # List processes
POST   /api/process              # Create process
GET    /api/process/[id]         # Get process details
PUT    /api/process/[id]         # Update process
DELETE /api/process/[id]         # Delete process

GET    /api/process/[id]/bpmn    # Get BPMN XML
PUT    /api/process/[id]/bpmn    # Save BPMN XML
POST   /api/process/[id]/export  # Export process (PDF/PNG)

GET    /api/user/profile         # Get user profile
PUT    /api/user/profile         # Update user profile
GET    /api/user/processes       # Get user's processes
```

### Response Format

```json
{
  "data": {
    "id": "uuid",
    "title": "Process Title",
    "description": "Process description",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "meta": {
    "version": "1.0",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### Error Handling

```json
{
  "error": {
    "code": "PROCESS_NOT_FOUND",
    "message": "Process with ID 'uuid' not found",
    "details": {}
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## Security Architecture

### Authentication
- **Provider**: Supabase Auth
- **Method**: Email/password with email verification
- **Session**: HTTP-only cookies for SSR compatibility
- **Middleware**: Route-level authentication checks

### Authorization
- **Role-based**: User roles (viewer, editor, admin)
- **Resource-based**: Per-process permissions
- **Route protection**: Middleware guards protected routes

### Data Security
- **Database**: Row-level security (RLS) policies
- **API**: Authentication required for all endpoints
- **Client**: No sensitive data in client-side code
- **Environment**: Secrets in environment variables

### Security Headers

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}
```

## Performance Architecture

### Client-Side Optimization
- **Code Splitting**: Dynamic imports for heavy libraries
- **Lazy Loading**: Components loaded on demand
- **Caching**: Browser caching for static assets
- **Bundle Size**: Tree shaking and dead code elimination

### Server-Side Optimization
- **SSR**: Server-side rendering for initial load
- **API Caching**: Response caching where appropriate
- **Database**: Optimized queries and indexes
- **CDN**: Static asset delivery via Vercel

### BPMN Performance
- **Lazy Loading**: bpmn-js loaded only when needed
- **Viewport**: Fit-to-viewport for large diagrams
- **Memory Management**: Proper cleanup of modeler instances
- **Debouncing**: Throttled save operations

## Deployment Architecture

### Vercel Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                      Vercel Edge Network                   │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────┐ │
│  │   CDN/Static    │  │   Edge Runtime   │  │   Serverless│ │
│  │   Assets        │  │   (Middleware)   │  │   Functions │ │
│  └─────────────────┘  └──────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                │ Database Connection
                                │
┌─────────────────────────────────────────────────────────────┐
│                      Supabase                              │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────┐ │
│  │   PostgreSQL    │  │   Auth Service   │  │   Storage   │ │
│  │   Database      │  │                  │  │   Bucket    │ │
│  └─────────────────┘  └──────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Environment Configuration

```
Development:
- Local Next.js dev server
- Supabase local development (optional)
- Hot reloading and debugging

Staging:
- Vercel preview deployments
- Supabase staging environment
- End-to-end testing

Production:
- Vercel production deployment
- Supabase production environment
- Monitoring and analytics
```

## Monitoring and Observability

### Client-Side Monitoring
- **Error Tracking**: Browser error reporting
- **Performance**: Core Web Vitals monitoring
- **User Analytics**: Usage tracking and insights

### Server-Side Monitoring
- **API Monitoring**: Response times and error rates
- **Database Monitoring**: Query performance and health
- **System Monitoring**: Resource usage and uptime

### Logging Strategy
- **Client**: Console logging for development
- **Server**: Structured logging for production
- **Database**: Query logging and performance metrics
- **Security**: Authentication and authorization events

## Development Guidelines

### Code Organization
- **Feature-based**: Group related components and logic
- **Separation of Concerns**: Clear layer boundaries
- **Reusability**: Shared components and utilities
- **Type Safety**: Comprehensive TypeScript usage

### Testing Strategy
- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API endpoint and database tests
- **E2E Tests**: User workflow testing
- **Performance Tests**: Load and stress testing

### Documentation
- **API Documentation**: OpenAPI/Swagger specs
- **Component Documentation**: JSDoc and examples
- **Architecture Documentation**: System design docs
- **User Documentation**: Feature and usage guides

This architecture provides a solid foundation for a scalable, maintainable, and secure business process management application with room for future enhancements and integrations.