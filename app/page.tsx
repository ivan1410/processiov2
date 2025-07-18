import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Users, FileText, Zap, BarChart3, Shield, Lightbulb } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="relative w-full max-w-6xl flex items-center justify-between p-3 px-5 text-sm">
          <div className="flex items-center font-semibold text-lg">
            <Link href="/">processio</Link>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 flex gap-6 items-center font-medium">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/protected" className="hover:text-primary transition-colors">Dashboard</Link>
          </div>
          {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6">BETA</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Sprechen statt Schreiben
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Verwandeln Sie Ihr Fachwissen in klare Prozessdokumentationen – ohne technische Vorkenntnisse
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6">
              Kostenlos starten
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Demo ansehen
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Keine technischen Vorkenntnisse erforderlich
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              Schweizer Qualität
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">So einfach funktioniert's</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <CardTitle>Erzählen Sie Ihren Prozess</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Beschreiben Sie einfach, wie der Prozess funktioniert – als würden Sie einem Kollegen erklären, wie etwas gemacht wird.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <CardTitle>KI wandelt um</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Die KI wandelt Ihre Worte in strukturierte Prozessschritte um, die Sie bei Bedarf anpassen können.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <CardTitle>Visualisieren und teilen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Generieren Sie automatisch Flussdiagramme und teilen Sie sie mit Ihrem Team oder integrieren Sie sie in Ihre Dokumentation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="w-full py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Kennen Sie diese Herausforderungen?</h2>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Seien wir ehrlich: Die meisten Unternehmen kämpfen mit denselben Problemen bei der Prozessdokumentation
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-500" />
                  Fehlende Dokumentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Die meisten Ihrer Prozesse existieren nur in den Köpfen Ihrer Mitarbeiter. Bei Personalwechseln geht wertvolles Wissen verloren.
                </p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  Wissensmonopole
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Einzelne Mitarbeiter sind Wissensträger für kritische Prozesse. Was passiert, wenn diese Person im Urlaub, krank oder gar nicht mehr im Unternehmen ist?
                </p>
              </CardContent>
            </Card>
            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  Zu zeitaufwändig
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Wer hat schon Zeit, stundenlang Prozesse zu dokumentieren? Die Tagesgeschäfte warten nicht, also wird die Dokumentation immer wieder aufgeschoben.
                </p>
              </CardContent>
            </Card>
            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  Komplizierte Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Klassische Prozess-Tools sind oft kompliziert, teuer und erfordern Spezialwissen. Kein Wunder, dass die Dokumentation nie zustande kommt.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Warum Unternehmen processio nutzen</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  Spart Zeit und Ressourcen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Reduzieren Sie den Zeitaufwand für die Prozessdokumentation um bis zu 80%. Mit processio erledigen Sie in Minuten, was früher Tage dauerte.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  Standardisiert Betriebsabläufe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  processio hilft Ihnen, einheitliche Arbeitsabläufe in allen Abteilungen zu schaffen und sorgt für konsistente Ergebnisse bei jedem Prozessdurchlauf.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  Liefert wertvolle Erkenntnisse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Identifizieren Sie Engpässe, Optimierungspotenziale und Automatisierungsmöglichkeiten durch datengestützte Prozessanalysen.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="w-full py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Praktische Anwendungsfälle für Ihr Unternehmen</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Einarbeitung neuer Mitarbeiter</CardTitle>
                <CardDescription>Ideal für: HR & Teamleiter</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Dokumentieren Sie Einarbeitungsprozesse, damit neue Mitarbeiter schneller produktiv werden können. Schaffen Sie Klarheit über Abläufe und reduzieren Sie die Einarbeitungszeit.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Qualitätssicherung & Prozessstandardisierung</CardTitle>
                <CardDescription>Ideal für: Operations Manager & Qualitätsbeauftragte</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stellen Sie sicher, dass wichtige Abläufe immer gleich ausgeführt werden. Definieren Sie klare Standards und fördern Sie einheitliche Ergebnisse in allen Abteilungen.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Wissenstransfer & Know-how-Sicherung</CardTitle>
                <CardDescription>Ideal für: Geschäftsführer & Abteilungsleiter</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Bewahren Sie wertvolles Fachwissen, bevor es durch Personalwechsel verloren geht. Wandeln Sie das Expertenwissen Ihrer Mitarbeiter in dokumentierte Prozesse um.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Audit & Compliance</CardTitle>
                <CardDescription>Ideal für: Compliance-Manager & Auditoren</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Dokumentieren Sie Ihre Prozesse für Audits und Compliance-Anforderungen. Zeigen Sie transparent, wie Ihre Abläufe funktionieren und wo Verantwortlichkeiten liegen.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Fangen Sie heute an, Ihre Prozesse zu verbessern</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Schließen Sie sich Hunderten von KMUs an, die mit processio bereits Zeit sparen und ihre Abläufe optimieren
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Kostenlos starten
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Mehr erfahren
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Mit Liebe gemacht</span>
              <span className="text-red-500">♥</span>
              <span>in der Schweiz</span>
            </div>
            <div className="flex items-center gap-8">
              <p className="text-sm text-muted-foreground">
                Powered by{" "}
                <a
                  href="https://cloud-solution.ch"
                  target="_blank"
                  className="font-medium hover:underline"
                  rel="noreferrer"
                >
                  Cloud Solution GmbH
                </a>
              </p>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
