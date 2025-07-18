'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

interface BpmnEditorProps {
  xml: string;
}

export interface BpmnEditorHandle {
  save: () => Promise<string>;
}

const BpmnEditor = forwardRef<BpmnEditorHandle, BpmnEditorProps>(({ xml }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<import('bpmn-js/lib/Modeler').default | null>(null);

  useImperativeHandle(ref, () => ({
    async save() {
      if (!modelerRef.current) {
        throw new Error('Modeler not initialized');
      }
      const { xml: updatedXml } = await modelerRef.current.saveXML({ format: true });
      return updatedXml;
    },
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    (async () => {
      const { default: Modeler } = await import('bpmn-js/lib/Modeler');
      modelerRef.current = new Modeler({ container: containerRef.current });

      try {
        await modelerRef.current.importXML(xml.trim());
        modelerRef.current.get('canvas').zoom('fit-viewport');
      } catch (err) {
        console.error('Modeler import failed', err);
      }
    })();

    return () => {
      modelerRef.current?.destroy();
      // Ensure any DOM nodes added by the previous modeler (palette, overlays, etc.) are removed
      const container = containerRef.current;
      if (container) {
        container.innerHTML = '';
      }
      modelerRef.current = null;
    };
  }, [xml]);

  return <div ref={containerRef} className="h-full w-full" />;
});

BpmnEditor.displayName = 'BpmnEditor';

export default BpmnEditor;
