import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Edit, Save, FileText, Calendar, User, Tag, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import BpmnPanel from "@/components/bpmn/BpmnPanel";

// Mock data - replace with real data later
const mockProcesses = [
  {
    id: 1,
    title: "Kundenregistrierung",
    description: "Vollständiger Prozess zur Registrierung neuer Kunden",
    detailedDescription: "Dieser Prozess beschreibt die vollständige Registrierung neuer Kunden in unserem System. Er umfasst die Datenerfassung, Validierung, Dokumentenprüfung und finale Freischaltung des Kundenkontos. Der Prozess ist darauf ausgelegt, eine nahtlose Erfahrung für neue Kunden zu gewährleisten und gleichzeitig alle regulatorischen Anforderungen zu erfüllen.",
    status: "Aktiv",
    lastUpdated: "2024-01-15",
    author: "Maria Schmidt",
    tags: ["Vertrieb", "Onboarding"],
    createdAt: "2024-01-10",
    version: "1.2",
    department: "Vertrieb"
  },
  {
    id: 2,
    title: "Rechnungsstellung",
    description: "Automatisierter Prozess für die monatliche Rechnungsstellung",
    detailedDescription: "Automatisierter Workflow für die monatliche Rechnungsstellung an alle Kunden. Dieser Prozess umfasst die Datensammlung aus verschiedenen Systemen, Rechnungserstellung, Validierung und Versand. Der Prozess läuft vollautomatisch und benötigt nur bei Ausnahmen manuellen Eingriff.",
    status: "In Bearbeitung",
    lastUpdated: "2024-01-14",
    author: "Thomas Weber",
    tags: ["Finanzen", "Automatisierung"],
    createdAt: "2024-01-05",
    version: "2.1",
    department: "Finanzen"
  },
  {
    id: 3,
    title: "Mitarbeiter Onboarding",
    description: "Schritt-für-Schritt Anleitung für neue Mitarbeiter",
    detailedDescription: "Umfassender Onboarding-Prozess für neue Mitarbeiter, der alle notwendigen Schritte von der Vertragsunterzeichnung bis zur vollständigen Integration in das Team abdeckt. Beinhaltet IT-Setup, Schulungen, Einführungsgespräche und Mentoring-Programme.",
    status: "Aktiv",
    lastUpdated: "2024-01-13",
    author: "Anna Müller",
    tags: ["HR", "Onboarding"],
    createdAt: "2024-01-01",
    version: "1.0",
    department: "Personal"
  },
  {
    id: 4,
    title: "Qualitätskontrolle",
    description: "Standardprozess für die Qualitätsprüfung von Produkten",
    detailedDescription: "Standardisierter Qualitätskontrollprozess für alle Produkte vor der Auslieferung. Umfasst visuelle Inspektion, Funktionstests, Dokumentation und Freigabe. Der Prozess gewährleistet gleichbleibend hohe Qualität und Kundenzufriedenheit.",
    status: "Entwurf",
    lastUpdated: "2024-01-12",
    author: "Klaus Fischer",
    tags: ["Qualität", "Produktion"],
    createdAt: "2024-01-08",
    version: "0.9",
    department: "Produktion"
  }
];

interface ProcessDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProcessDetailPage({ params }: ProcessDetailPageProps) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Find the process by ID
  const process = mockProcesses.find(p => p.id === parseInt(params.id));
  
  if (!process) {
    redirect("/protected");
  }

  return (
    <div className="fixed inset-0 pt-16 flex">
      {/* Left Side - Process Details */}
      <div className="w-1/2 bg-background border-r overflow-y-auto">
        <div className="p-4 space-y-3">
          {/* Header - Compact */}
          <div className="flex items-center justify-between border-b pb-3">
            <Link href="/protected">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Zurück
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Edit size={16} className="mr-2" />
              Bearbeiten
            </Button>
          </div>
          
          {/* Title Section - Compact */}
          <div className="pb-3">
            <h1 className="text-xl font-bold leading-tight">{process.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{process.description}</p>
          </div>
          
          {/* Compact Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={process.status === 'Aktiv' ? 'default' : 
                          process.status === 'In Bearbeitung' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {process.status}
                </Badge>
                <span className="text-xs text-muted-foreground">v{process.version}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User size={12} />
                <span>{process.author}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={12} />
                <span>{process.createdAt}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Abteilung:</span> {process.department}
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Aktualisiert:</span> {process.lastUpdated}
              </div>
              <div className="flex flex-wrap gap-1">
                {process.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Description - Compact */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText size={14} />
              <span className="text-sm font-medium">Beschreibung</span>
            </div>
            <Textarea
              value={process.detailedDescription}
              placeholder="Detaillierte Beschreibung des Prozesses..."
              className="min-h-[120px] resize-none text-sm"
              readOnly
            />
            <div className="flex justify-end">
              <Button size="sm" variant="ghost">
                <Save size={14} className="mr-2" />
                Speichern
              </Button>
            </div>
          </div>

          {/* Process Steps - Compact */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity size={14} />
              <span className="text-sm font-medium">Prozessschritte</span>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <Activity size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs text-muted-foreground">Prozessschritte werden hier angezeigt</p>
              <p className="text-xs text-muted-foreground mt-1">Integration in Entwicklung</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - BPMN Viewer - FULL WIDTH */}
      <div className="flex-1 bg-background">
        <div className="h-full p-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Prozess-Visualisierung</CardTitle>
              <CardDescription>
                BPMN-Viewer (read-only, Milestone&nbsp;1)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <BpmnPanel processId={params.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
