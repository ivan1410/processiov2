"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  MessageSquare, 
  Clock, 
  Shield, 
  Zap, 
  CreditCard, 
  FileText, 
  HelpCircle, 
  Play,
  Video,
  BookOpen,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { useState } from "react";

// FAQ Categories
const faqCategories = [
  {
    id: "basics",
    title: "Grundlagen",
    icon: BookOpen,
    description: "Alles was Sie über processio wissen müssen",
    questions: [
      {
        question: "Was ist processio und wie funktioniert es?",
        answer: "processio ist eine innovative Plattform, die Ihnen hilft, Geschäftsprozesse durch einfache Sprachbeschreibungen zu dokumentieren. Sie sprechen einfach über Ihren Prozess, und unsere KI wandelt diese Beschreibung in strukturierte Prozessdokumentation und visuelle Flussdiagramme um."
      },
      {
        question: "Für wen ist processio geeignet?",
        answer: "processio ist ideal für KMUs, Selbstständige, Teamleiter, HR-Manager, Qualitätsbeauftragte und alle, die ihre Arbeitsabläufe dokumentieren und optimieren möchten – ohne technische Vorkenntnisse."
      },
      {
        question: "Brauche ich technische Vorkenntnisse?",
        answer: "Nein, überhaupt nicht! processio wurde speziell so entwickelt, dass jeder es nutzen kann. Sie müssen nur sprechen können – den Rest erledigt unsere KI für Sie."
      },
      {
        question: "In welchen Sprachen ist processio verfügbar?",
        answer: "processio ist vollständig auf Deutsch verfügbar. Wir unterstützen auch Englisch und arbeiten an weiteren Sprachen. Die KI kann auch mehrsprachige Prozesse verstehen und dokumentieren."
      }
    ]
  },
  {
    id: "usage",
    title: "Verwendung",
    icon: Users,
    description: "So nutzen Sie processio optimal",
    questions: [
      {
        question: "Wie erstelle ich meinen ersten Prozess?",
        answer: "Ganz einfach: Melden Sie sich an, klicken Sie auf 'Neuer Prozess', geben Sie einen Titel ein und beschreiben Sie den Prozess, als würden Sie einem neuen Mitarbeiter erklären, wie er funktioniert. Die KI erstellt automatisch eine strukturierte Dokumentation."
      },
      {
        question: "Wie detailliert sollte meine Beschreibung sein?",
        answer: "Je detaillierter, desto besser! Erklären Sie jeden Schritt, erwähnen Sie Verantwortlichkeiten, Zeitrahmen und mögliche Ausnahmen. Stellen Sie sich vor, Sie erklären den Prozess jemandem, der ihn noch nie gemacht hat."
      },
      {
        question: "Kann ich bestehende Dokumente hochladen?",
        answer: "Ja! Sie können PDF-Dokumente, Sprachdateien und andere Prozessdokumente hochladen. Die KI analysiert diese und erstellt daraus strukturierte Prozessdokumentation."
      },
      {
        question: "Wie kann ich Prozesse mit meinem Team teilen?",
        answer: "Prozesse können einfach mit Ihrem Team geteilt werden. Sie können Links generieren, Prozesse exportieren oder direkt in Ihr bestehendes Dokumentationssystem integrieren."
      },
      {
        question: "Kann ich die generierten Prozesse bearbeiten?",
        answer: "Absolut! Alle generierten Prozesse können nachbearbeitet werden. Sie können Schritte hinzufügen, entfernen oder modifizieren, um sie perfekt an Ihre Bedürfnisse anzupassen."
      }
    ]
  },
  {
    id: "business",
    title: "Für Unternehmen",
    icon: Shield,
    description: "Informationen für Geschäftsinhaber und Führungskräfte",
    questions: [
      {
        question: "Wie hilft processio meinem Unternehmen?",
        answer: "processio reduziert den Zeitaufwand für Prozessdokumentation um bis zu 80%, standardisiert Arbeitsabläufe, sichert Wissen vor Personalwechseln und identifiziert Optimierungspotenziale. Das Ergebnis: effizientere Abläufe und weniger Abhängigkeit von einzelnen Mitarbeitern."
      },
      {
        question: "Welche Arten von Prozessen kann ich dokumentieren?",
        answer: "Praktisch alle Geschäftsprozesse: Mitarbeiter-Onboarding, Kundenbetreuung, Qualitätssicherung, Rechnungsstellung, Vertriebsprozesse, Produktentwicklung, Compliance-Verfahren und viele mehr."
      },
      {
        question: "Wie stelle ich sicher, dass meine Mitarbeiter die Prozesse befolgen?",
        answer: "processio erstellt klare, verständliche Prozessdokumentation mit visuellen Flussdiagrammen. Diese sind so einfach zu verstehen, dass die Einhaltung natürlich wird. Sie können auch Checklisten und Erinnerungen integrieren."
      },
      {
        question: "Kann processio bei Audits und Compliance helfen?",
        answer: "Ja! processio erstellt professionelle Prozessdokumentation, die Auditoren und Compliance-Anforderungen gerecht wird. Sie können nachweisen, dass Ihre Prozesse definiert, dokumentiert und befolgt werden."
      },
      {
        question: "Wie schnell sehe ich erste Ergebnisse?",
        answer: "Sofort! Innerhalb von Minuten nach der Beschreibung Ihres ersten Prozesses erhalten Sie eine vollständige Dokumentation. Die ersten Effizienzgewinne werden Sie bereits nach wenigen Tagen bemerken."
      }
    ]
  },
  {
    id: "technical",
    title: "Technisches",
    icon: Zap,
    description: "Sicherheit, Integration und technische Details",
    questions: [
      {
        question: "Wie sicher sind meine Daten?",
        answer: "Ihre Daten werden nach höchsten Schweizer Standards geschützt. Wir verwenden Ende-zu-Ende-Verschlüsselung, regelmäßige Sicherheitsaudits und hosten alle Daten in der Schweiz. Ihre Prozesse bleiben Ihr Eigentum."
      },
      {
        question: "Kann ich processio in bestehende Tools integrieren?",
        answer: "Ja! processio bietet APIs und Integrationen für gängige Business-Tools wie Microsoft Teams, Slack, SharePoint und viele mehr. Kontaktieren Sie uns für spezifische Integrationsanfragen."
      },
      {
        question: "Was passiert mit meinen Daten, wenn ich den Service beende?",
        answer: "Sie können jederzeit alle Ihre Daten vollständig exportieren. Wir behalten keine Kopien und löschen alle Ihre Informationen nach der Kündigung gemäß unseren Datenschutzbestimmungen."
      },
      {
        question: "Gibt es eine Offline-Version?",
        answer: "Derzeit ist processio ein Cloud-Service. Wir arbeiten an einer Offline-Version für Unternehmen mit speziellen Sicherheitsanforderungen. Kontaktieren Sie uns für weitere Informationen."
      }
    ]
  },
  {
    id: "pricing",
    title: "Preise & Pläne",
    icon: CreditCard,
    description: "Alles über unsere Preisgestaltung",
    questions: [
      {
        question: "Wie viel kostet processio?",
        answer: "processio bietet verschiedene Preispläne für unterschiedliche Bedürfnisse. Beginnen Sie kostenlos mit unserem Starter-Plan und upgraden Sie bei Bedarf. Detaillierte Preise finden Sie auf unserer Preisseite."
      },
      {
        question: "Gibt es eine kostenlose Testphase?",
        answer: "Ja! Sie können processio völlig kostenlos testen. Unser Starter-Plan ist dauerhaft kostenlos und beinhaltet alle Grundfunktionen für kleine Teams."
      },
      {
        question: "Welche Zahlungsmethoden akzeptieren Sie?",
        answer: "Wir akzeptieren alle gängigen Kreditkarten, SEPA-Lastschrift und Banküberweisungen. Für Geschäftskunden bieten wir auch Rechnungsstellung an."
      },
      {
        question: "Kann ich jederzeit kündigen?",
        answer: "Ja, Sie können jederzeit kündigen. Es gibt keine Vertragslaufzeiten oder Kündigungsfristen. Sie zahlen nur für die Zeit, die Sie den Service nutzen."
      }
    ]
  },
  {
    id: "support",
    title: "Support",
    icon: MessageSquare,
    description: "Hilfe und Unterstützung",
    questions: [
      {
        question: "Wie erreiche ich den Support?",
        answer: "Unser Support-Team ist per E-Mail, Chat und Telefon erreichbar. Premium-Kunden erhalten priority Support mit garantierten Antwortzeiten."
      },
      {
        question: "Bieten Sie Schulungen an?",
        answer: "Ja! Wir bieten Online-Schulungen, Webinare und individuelle Trainings für Ihr Team an. Kontaktieren Sie uns für ein maßgeschneidertes Schulungsprogramm."
      },
      {
        question: "Gibt es eine Community oder Forum?",
        answer: "Ja, wir haben eine aktive Community von processio-Nutzern, die Tipps, Best Practices und Erfahrungen teilen. Der Zugang ist für alle registrierten Nutzer kostenlos."
      },
      {
        question: "Wie oft wird processio aktualisiert?",
        answer: "Wir veröffentlichen regelmäßig Updates mit neuen Funktionen und Verbesserungen. Alle Updates sind kostenlos und werden automatisch bereitgestellt."
      }
    ]
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

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
            <Link href="/faq" className="hover:text-primary transition-colors text-primary">FAQ</Link>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild size="sm">
              <Link href="/protected">Anmelden</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full py-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Häufig gestellte Fragen</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8">
            Finden Sie schnell Antworten auf Ihre Fragen zu processio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/protected">Kostenlos starten</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="mailto:support@processio.ch">Kontakt aufnehmen</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Video Tutorials Section */}
      <section className="w-full py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Video className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Video-Tutorials</h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Lernen Sie processio mit unseren Schritt-für-Schritt Anleitungen kennen
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Erste Schritte</CardTitle>
                <CardDescription>
                  Lernen Sie die Grundlagen von processio kennen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="mb-4">Bald verfügbar</Badge>
                <p className="text-sm text-muted-foreground">
                  Eine komplette Einführung in processio - von der Anmeldung bis zum ersten Prozess
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Prozesse erstellen</CardTitle>
                <CardDescription>
                  Schritt-für-Schritt Anleitung zur Prozesserstellung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="mb-4">Bald verfügbar</Badge>
                <p className="text-sm text-muted-foreground">
                  Erfahren Sie, wie Sie effektive Prozessbeschreibungen erstellen
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Team-Zusammenarbeit</CardTitle>
                <CardDescription>
                  Prozesse mit Ihrem Team teilen und gemeinsam bearbeiten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="mb-4">Bald verfügbar</Badge>
                <p className="text-sm text-muted-foreground">
                  Best Practices für die Zusammenarbeit mit processio
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="w-full py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Fragen & Antworten</h2>
            <p className="text-muted-foreground text-lg">
              Wählen Sie eine Kategorie oder durchsuchen Sie alle Fragen
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {faqCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="w-full justify-center">
                    {category.questions.length} Fragen
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-8">
            {faqCategories.map((category) => (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <category.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">{category.title}</h3>
                </div>
                
                <div className="space-y-3">
                  {category.questions.map((faq, index) => {
                    const itemId = `${category.id}-${index}`;
                    const isOpen = openItems.includes(itemId);
                    
                    return (
                      <Card key={itemId} className="overflow-hidden">
                        <Collapsible open={isOpen} onOpenChange={() => toggleItem(itemId)}>
                          <CollapsibleTrigger className="w-full">
                            <CardHeader className="hover:bg-muted/50 transition-colors">
                              <div className="flex items-center justify-between w-full text-left">
                                <CardTitle className="text-lg font-medium">
                                  {faq.question}
                                </CardTitle>
                                {isOpen ? (
                                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              <p className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </p>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Haben Sie noch Fragen?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Unser Support-Team hilft Ihnen gerne weiter
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="mailto:support@processio.ch">E-Mail Support</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/protected">Kostenlos testen</Link>
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
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}