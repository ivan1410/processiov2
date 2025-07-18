import { useEffect, useRef } from "react";

// Import BPMN-JS default styling
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";

/**
 * Basic BPMN viewer that renders a hard-coded sample diagram.
 * This is Milestone 1: foundational viewer setup (static XML, no persistence).
 */
interface BpmnViewerProps {
  xml?: string;
}

// fallback xml constant outside component
const sampleFallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/spec/BPMN/20100524/MODEL" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Fallback_Defs" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="P_Fallback" isExecutable="false">
    <bpmn:startEvent id="SE_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="Diag_1">
    <bpmndi:BPMNPlane id="Plane_1" bpmnElement="P_Fallback">
      <bpmndi:BPMNShape id="SE_1_di" bpmnElement="SE_1">
        <dc:Bounds x="100" y="100" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

export default function BpmnViewer({ xml }: BpmnViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run only in the browser
    if (!containerRef.current) return;

    let viewer: import('bpmn-js/dist/bpmn-viewer.development.js').default | null = null;

    (async () => {
      const { default: BpmnJS } = await import(
        /* webpackChunkName: "bpmn-viewer" */ "bpmn-js/dist/bpmn-viewer.development.js"
      );

      viewer = new BpmnJS({ container: containerRef.current });

      // Use provided xml or fallback to minimal sample diagram
      const diagramXml =
        xml ?? `<?xml version="1.0" encoding="UTF-8"?>
      <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
        <bpmn:process id="Process_1" isExecutable="false">
          <bpmn:startEvent id="StartEvent_1"/>
        </bpmn:process>
        <bpmndi:BPMNDiagram id="BPMNDiagram_1">
          <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
            <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
              <dc:Bounds xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" x="100" y="100" width="36" height="36" />
            </bpmndi:BPMNShape>
          </bpmndi:BPMNPlane>
        </bpmndi:BPMNDiagram>
      </bpmn:definitions>`;

      try {
        await viewer.importXML(diagramXml.trim());
        viewer.get("canvas").zoom("fit-viewport");
      } catch (err) {
        console.error("Failed to render provided BPMN. First 200 chars:", diagramXml.slice(0,200));
        console.error("Falling back to sample", err);
        try {
          await viewer.importXML(sampleFallbackXml.trim());
          viewer.get("canvas").zoom("fit-viewport");
        } catch (innerErr) {
          console.error("Fallback also failed", innerErr);
        }
      }
    })();

    // Cleanup on unmount
    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, [xml]);

  return <div className="h-full w-full" ref={containerRef} />;
}
