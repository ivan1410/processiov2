import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Edit, Save, FileText, Calendar, User, Tag, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
    <div className="flex-1 w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/protected">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Zurück zur Übersicht
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{process.title}</h1>
          <p className="text-muted-foreground">{process.description}</p>
        </div>
        <Button variant="outline" size="sm">
          <Edit size={16} className="mr-2" />
          Bearbeiten
        </Button>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Left Side - Process Details */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Prozess-Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge 
                      variant={process.status === 'Aktiv' ? 'default' : 
                              process.status === 'In Bearbeitung' ? 'secondary' : 'outline'}
                    >
                      {process.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Version</Label>
                  <p className="text-sm text-muted-foreground mt-1">{process.version}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <User size={14} />
                    Autor
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">{process.author}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Abteilung</Label>
                  <p className="text-sm text-muted-foreground mt-1">{process.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Calendar size={14} />
                    Erstellt am
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">{process.createdAt}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Zuletzt aktualisiert</Label>
                  <p className="text-sm text-muted-foreground mt-1">{process.lastUpdated}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-1">
                  <Tag size={14} />
                  Tags
                </Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {process.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Beschreibung</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={process.detailedDescription}
                placeholder="Detaillierte Beschreibung des Prozesses..."
                className="min-h-[200px] resize-none"
                readOnly
              />
              <div className="flex justify-end mt-4">
                <Button size="sm">
                  <Save size={16} className="mr-2" />
                  Speichern
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Process Steps (Future) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity size={20} />
                Prozessschritte
              </CardTitle>
              <CardDescription>
                Hier werden die einzelnen Schritte des Prozesses angezeigt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity size={48} className="mx-auto mb-4 opacity-50" />
                <p>Prozessschritte werden hier angezeigt</p>
                <p className="text-sm">Integration in Entwicklung</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Viewer/Editor */}
        <div className="space-y-6">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Prozess-Visualisierung</CardTitle>
              <CardDescription>
                BPMN-Viewer (read-only, Milestone&nbsp;1)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {/* BPMN viewer / editor panel */}
              <BpmnPanel processId={params.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
