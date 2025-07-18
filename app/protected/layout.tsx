import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="relative w-full max-w-5xl flex items-center justify-between p-3 px-5 text-sm">
            {/* Left: logo */}
            <div className="flex items-center font-semibold">
              <Link href="/">processio</Link>
            </div>
            {/* Center: primary nav links */}
            <div className="absolute left-1/2 -translate-x-1/2 flex gap-5 items-center font-medium">
              <Link href="/">Home</Link>
              <Link href="/protected">Dashboard</Link>
            </div>
            <div className="flex items-center gap-4">
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
              <ThemeSwitcher />
            </div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-7xl px-2 py-5">
          {children}
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://cloud-solution.ch"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Cloud Solution GmbH
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
