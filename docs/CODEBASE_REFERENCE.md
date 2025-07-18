# ProcessIO Codebase Reference

## Quick Navigation

This document provides a comprehensive reference for navigating and understanding the ProcessIO codebase. Use this as your go-to guide for finding specific functionality, understanding implementation patterns, and locating key files.

## File Structure Quick Reference

### 🔍 **Finding Core Features**

| Feature | Primary Location | Key Files |
|---------|------------------|-----------|
| **Authentication** | `app/auth/`, `lib/supabase/` | `middleware.ts`, `server.ts`, `client.ts` |
| **BPMN Editor** | `components/bpmn/` | `BpmnEditor.tsx`, `BpmnViewer.tsx` |
| **Process Management** | `app/protected/` | `page.tsx`, `process/[id]/page.tsx` |
| **API Endpoints** | `app/api/` | `process/[id]/bpmn/route.ts` |
| **UI Components** | `components/ui/` | `button.tsx`, `card.tsx`, etc. |
| **Configuration** | Root directory | `tailwind.config.ts`, `next.config.ts` |

### 📁 **Directory Deep Dive**

```
processiov2/
├── 🎨 app/                    # Next.js App Router
│   ├── 🔐 auth/               # Authentication pages
│   │   ├── login/page.tsx             # Login form page
│   │   ├── sign-up/page.tsx           # Registration page
│   │   ├── forgot-password/page.tsx   # Password reset
│   │   ├── update-password/page.tsx   # Password update
│   │   ├── confirm/route.ts           # Email confirmation API
│   │   └── error/page.tsx             # Auth error display
│   │
│   ├── 🔒 protected/          # Protected routes (require auth)
│   │   ├── layout.tsx                 # Protected layout wrapper
│   │   ├── page.tsx                   # Dashboard/process list
│   │   └── process/[id]/page.tsx      # Process detail view
│   │
│   ├── 🌐 api/                # API routes
│   │   └── process/[id]/bpmn/route.ts # BPMN data endpoint
│   │
│   ├── 📝 notes/              # Notes feature
│   │   └── pages.tsx                  # Notes page
│   │
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
│
├── 🧩 components/             # React components
│   ├── 📊 bpmn/               # BPMN-specific components
│   │   ├── BpmnEditor.tsx             # Full BPMN editor
│   │   ├── BpmnViewer.tsx             # Read-only viewer
│   │   ├── BpmnPanel.tsx              # Combined panel
│   │   └── ViewerSection.tsx          # Viewer wrapper
│   │
│   ├── 🎛️ ui/                 # shadcn/ui components
│   │   ├── button.tsx                 # Button component
│   │   ├── card.tsx                   # Card component
│   │   ├── input.tsx                  # Input component
│   │   └── [more-ui-components]
│   │
│   ├── 🔐 auth-button.tsx     # Authentication button
│   ├── 📝 login-form.tsx      # Login form
│   ├── 📝 sign-up-form.tsx    # Registration form
│   ├── 🎨 theme-switcher.tsx  # Dark/light theme toggle
│   └── [various-components]
│
├── 📚 lib/                    # Utilities and configuration
│   ├── 🗄️ supabase/          # Supabase configuration
│   │   ├── client.ts                  # Browser client
│   │   ├── server.ts                  # Server client
│   │   └── middleware.ts              # Session management
│   └── utils.ts               # General utilities
│
├── 📖 docs/                   # Documentation
│   ├── DEVELOPER_GUIDE.md             # This guide
│   ├── ARCHITECTURE.md               # System architecture
│   ├── CODEBASE_REFERENCE.md         # File navigation
│   └── bpmn-js.txt                   # BPMN.js reference
│
├── middleware.ts              # Next.js middleware
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
└── next.config.ts             # Next.js config
```

## 🔍 **Component Patterns and Usage**

### Authentication Components

**Location**: `components/`

```typescript
// Login Form - components/login-form.tsx
export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  
  const handleSubmit = async (formData: FormData) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
    
    if (!error) {
      router.push('/protected');
    }
  };
  
  return (
    <form action={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

**Usage Pattern**:
- Server Actions for form submission
- Client-side navigation with `useRouter`
- Supabase client for authentication
- Error state management

### BPMN Components

**Location**: `components/bpmn/`

```typescript
// BPMN Editor - components/bpmn/BpmnEditor.tsx
'use client';
import { useEffect, useRef, forwardRef } from 'react';

export interface BpmnEditorHandle {
  save: () => Promise<string>;
}

const BpmnEditor = forwardRef<BpmnEditorHandle, BpmnEditorProps>(
  ({ xml }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const modelerRef = useRef<any>(null);
    
    useEffect(() => {
      (async () => {
        const { default: Modeler } = await import('bpmn-js/lib/Modeler');
        modelerRef.current = new Modeler({ container: containerRef.current });
        await modelerRef.current.importXML(xml);
      })();
    }, [xml]);
    
    return <div ref={containerRef} className="h-full w-full" />;
  }
);
```

**Usage Pattern**:
- Dynamic imports for bpmn-js (client-side only)
- Ref forwarding for imperative API
- Proper cleanup in useEffect
- Error handling for XML import

### UI Components (shadcn/ui)

**Location**: `components/ui/`

```typescript
// Button - components/ui/button.tsx
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "default" | "sm";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

**Usage Pattern**:
- Class Variance Authority (CVA) for variants
- Tailwind CSS for styling
- Ref forwarding for DOM access
- TypeScript for props validation

## 🔐 **Authentication Flow Reference**

### Server-Side Authentication

**Location**: `lib/supabase/server.ts`

```typescript
export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

### Protected Route Pattern

**Location**: `app/protected/page.tsx`

```typescript
export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  
  if (error || !data?.claims) {
    redirect("/auth/login");
  }
  
  // Component logic here
}
```

### Middleware Authentication

**Location**: `middleware.ts`

```typescript
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

## 🌐 **API Patterns Reference**

### GET Endpoint Pattern

**Location**: `app/api/process/[id]/bpmn/route.ts`

```typescript
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  // TODO: Fetch from database
  const bpmnXml = getSampleBpmnXml();
  
  return new NextResponse(bpmnXml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
```

### Client-Side API Call Pattern

**Location**: `components/bpmn/BpmnPanel.tsx`

```typescript
useEffect(() => {
  const loadBpmn = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/process/${processId}/bpmn`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const xml = await response.text();
      setXml(xml);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load BPMN');
    } finally {
      setLoading(false);
    }
  };
  
  loadBpmn();
}, [processId]);
```

## 🎨 **Styling and Theming**

### Tailwind Configuration

**Location**: `tailwind.config.ts`

```typescript
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... more colors
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### CSS Variables

**Location**: `app/globals.css`

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* ... more variables */
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode variables */
  }
}
```

### Component Styling Pattern

```typescript
// Using cn() utility for class merging
import { cn } from "@/lib/utils";

export function MyComponent({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2", // base classes
        "hover:bg-accent", // state classes
        "dark:bg-slate-800", // dark mode classes
        className // allow override
      )}
      {...props}
    />
  );
}
```

## 📊 **Data Patterns**

### Mock Data Pattern

**Location**: `app/protected/page.tsx`

```typescript
const mockProcesses = [
  {
    id: 1,
    title: "Kundenregistrierung",
    description: "Vollständiger Prozess zur Registrierung neuer Kunden",
    status: "Aktiv",
    lastUpdated: "2024-01-15",
    author: "Maria Schmidt",
    tags: ["Vertrieb", "Onboarding"]
  },
  // ... more mock data
];
```

### Supabase Query Pattern

```typescript
// Server Component Query
export default async function ProcessList() {
  const supabase = await createClient();
  const { data: processes, error } = await supabase
    .from('processes')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching processes:', error);
    return <div>Error loading processes</div>;
  }
  
  return (
    <div>
      {processes.map(process => (
        <ProcessCard key={process.id} process={process} />
      ))}
    </div>
  );
}
```

## 🔧 **Utility Functions**

### Class Name Utility

**Location**: `lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

### Environment Check

```typescript
// Check if environment variables are set
if (!hasEnvVars) {
  return <EnvVarWarning />;
}
```

## 🚀 **Development Patterns**

### Form Handling Pattern

```typescript
// Server Action Pattern
async function handleSubmit(formData: FormData) {
  'use server';
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    redirect('/auth/login?error=Invalid credentials');
  }
  
  redirect('/protected');
}
```

### Error Handling Pattern

```typescript
// Component Error Boundary
'use client';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Loading Pattern

```typescript
// Loading UI
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
}
```

## 🎯 **Common Tasks Quick Reference**

### Adding a New Page
1. Create file in `app/` directory
2. Export default React component
3. Add layout.tsx if needed
4. Update navigation links

### Adding a New Component
1. Create file in `components/` directory
2. Use TypeScript for props
3. Follow naming convention (PascalCase)
4. Export component and types

### Adding a New API Route
1. Create `route.ts` in `app/api/` directory
2. Export HTTP method functions (GET, POST, etc.)
3. Handle authentication if needed
4. Return NextResponse

### Adding Authentication to Route
1. Import `createClient` from `lib/supabase/server`
2. Check user session
3. Redirect to login if not authenticated
4. Proceed with protected logic

### Working with BPMN
1. Use dynamic imports for bpmn-js
2. Handle client-side only rendering
3. Implement proper cleanup
4. Add error boundaries

## 🔍 **Debugging and Troubleshooting**

### Common Issues and Solutions

1. **BPMN Not Loading**
   - Check if component is client-side (`'use client'`)
   - Verify XML format is valid
   - Check browser console for errors

2. **Authentication Issues**
   - Verify environment variables are set
   - Check Supabase dashboard for user status
   - Ensure middleware is running

3. **Styling Issues**
   - Check Tailwind classes are valid
   - Verify CSS variables are defined
   - Check component inheritance

4. **API Errors**
   - Check Network tab in DevTools
   - Verify API route exists
   - Check server logs

### Development Tools

- **Browser DevTools**: Client-side debugging
- **Next.js DevTools**: Server-side debugging
- **Supabase Dashboard**: Database and auth monitoring
- **Tailwind CSS IntelliSense**: Class name suggestions

This reference guide should help you navigate the codebase efficiently and understand the patterns used throughout the application. Keep this handy while developing features or debugging issues.