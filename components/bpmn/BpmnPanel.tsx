'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Save, Edit, X, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import type { BpmnEditorHandle } from './BpmnEditor';

const BpmnViewer = dynamic(() => import('./BpmnViewer'), { ssr: false });
const BpmnEditor = dynamic(() => import('./BpmnEditor'), { ssr: false });

interface Props {
  processId: string;
}

export default function BpmnPanel({ processId }: Props) {
  const [xml, setXml] = useState<string | null>(null);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const editorRef = useRef<BpmnEditorHandle>(null);

  // load diagram on mount / id change
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/process/${processId}/bpmn`);
        const raw = await res.text();
        setXml(raw.replace(/^\uFEFF/, '').trim());
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [processId]);

  async function handleSave() {
    if (!editorRef.current) return;
    setStatus('saving');
    try {
      const updatedXml = await editorRef.current.save();
      const res = await fetch(`/api/process/${processId}/bpmn`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/xml' },
        body: updatedXml,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000); // Reset status after 2s
      setMode('view');
      setXml(updatedXml);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  if (!xml) return <div className="h-[600px] flex items-center justify-center">Lade...</div>;

  return (
    <div className="flex flex-col h-full space-y-2 min-h-0">
      <div className="flex items-center gap-2 h-9">
        {mode === 'view' ? (
          <Button size="sm" onClick={() => setMode('edit')}>
            <Edit size={16} className="mr-2" />
            Bearbeiten
          </Button>
        ) : (
          <>
            <Button size="sm" onClick={handleSave} disabled={status === 'saving'}>
              {status === 'saving' ? (
                <Loader size={16} className="mr-2 animate-spin" />
              ) : (
                <Save size={16} className="mr-2" />
              )}
              Speichern
            </Button>
            <Button size="sm" variant="outline" onClick={() => setMode('view')}>
              <X size={16} className="mr-2" />
              Abbrechen
            </Button>
          </>
        )}
        {status === 'saved' && <span className="flex items-center text-xs text-green-600"><CheckCircle size={14} className="mr-1" /> Gespeichert</span>}
        {status === 'error' && <span className="flex items-center text-xs text-destructive"><AlertTriangle size={14} className="mr-1" /> Fehler</span>}
      </div>
      <div className="h-[calc(100vh-12rem)] w-full border rounded-md overflow-hidden">
        {mode === 'view' ? (
          <BpmnViewer xml={xml} />
        ) : (
          <BpmnEditor ref={editorRef} xml={xml} />
        )}
      </div>
    </div>
  );
}
