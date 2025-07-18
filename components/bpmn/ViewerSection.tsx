'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';

// Dynamically load the heavy BPMN viewer only on the client
const BpmnViewer = dynamic(() => import('./BpmnViewer'), { ssr: false });

interface ViewerSectionProps {
  processId: string;
}

export default function ViewerSection({ processId }: ViewerSectionProps) {
  const [xml, setXml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchXml() {
      try {
        const res = await fetch(`/api/process/${processId}/bpmn`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.text();
        const cleaned = raw.replace(/^\uFEFF/, '').trim();
        setXml(cleaned);
      } catch (err: any) {
        setError(err.message ?? 'Fehler beim Laden');
      }
    }
    fetchXml();
  }, [processId]);

  if (error) {
    return (
      <div className="h-[600px] w-full flex items-center justify-center text-destructive">
        Fehler: {error}
      </div>
    );
  }

  if (!xml) {
    return (
      <div className="h-[600px] w-full flex items-center justify-center text-muted-foreground">
        Lade Diagramm...
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="h-[600px] w-full flex items-center justify-center text-muted-foreground">Lade Viewer...</div>}>
      <div className="h-[600px] w-full">
        <BpmnViewer xml={xml} />
      </div>
    </Suspense>
  );
}
