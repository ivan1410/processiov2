import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Search, Grid3X3, List, Plus, FileText, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock data for demonstration - replace with real data later
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
  {
    id: 2,
    title: "Rechnungsstellung",
    description: "Automatisierter Prozess für die monatliche Rechnungsstellung",
    status: "In Bearbeitung",
    lastUpdated: "2024-01-14",
    author: "Thomas Weber",
    tags: ["Finanzen", "Automatisierung"]
  },
  {
    id: 3,
    title: "Mitarbeiter Onboarding",
    description: "Schritt-für-Schritt Anleitung für neue Mitarbeiter",
    status: "Aktiv",
    lastUpdated: "2024-01-13",
    author: "Anna Müller",
    tags: ["HR", "Onboarding"]
  },
  {
    id: 4,
    title: "Qualitätskontrolle",
    description: "Standardprozess für die Qualitätsprüfung von Produkten",
    status: "Entwurf",
    lastUpdated: "2024-01-12",
    author: "Klaus Fischer",
    tags: ["Qualität", "Produktion"]
  }
];

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const user = data.claims;

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* Header with German greeting */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Willkommen zurück, {user.email?.split('@')[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Verwalten Sie Ihre Geschäftsprozesse effizient und übersichtlich
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Neuer Prozess
          </Button>
        </div>

        {/* Search and View Toggle */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Prozesse durchsuchen..."
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button variant="ghost" size="sm" className="bg-background shadow-sm">
              <Grid3X3 size={16} />
            </Button>
            <Button variant="ghost" size="sm">
              <List size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Process Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProcesses.map((process) => (
          <Link key={process.id} href={`/protected/process/${process.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={20} className="text-primary" />
                    <CardTitle className="text-lg">{process.title}</CardTitle>
                  </div>
                  <Badge 
                    variant={process.status === 'Aktiv' ? 'default' : 
                            process.status === 'In Bearbeitung' ? 'secondary' : 'outline'}
                  >
                    {process.status}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {process.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1 mb-3">
                  {process.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User size={12} />
                    {process.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {process.lastUpdated}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State (when no processes) */}
      {mockProcesses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Noch keine Prozesse vorhanden</h3>
          <p className="text-muted-foreground mb-4">
            Erstellen Sie Ihren ersten Geschäftsprozess, um loszulegen
          </p>
          <Button>
            <Plus size={16} className="mr-2" />
            Ersten Prozess erstellen
          </Button>
        </div>
      )}
    </div>
  );
}
