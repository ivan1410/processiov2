"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mic, MicOff, Upload, FileText, Play, Pause, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function NewProcessPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Fehler beim Zugriff auf das Mikrofon. Bitte überprüfen Sie die Berechtigung.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingTime(0);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerateWorkflow = async () => {
    if (!title.trim()) {
      alert('Bitte geben Sie einen Titel für den Prozess ein.');
      return;
    }

    if (!audioBlob && uploadedFiles.length === 0) {
      alert('Bitte nehmen Sie eine Sprachaufnahme auf oder laden Sie Dateien hoch.');
      return;
    }

    // TODO: Implement backend API call
    console.log('Workflow generation would be triggered here with:', {
      title,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      audioBlob,
      uploadedFiles
    });
    
    alert('Workflow-Generierung wird implementiert. Dies ist ein Platzhalter für die Backend-Integration.');
  };

  const tagsList = tags.split(',').map(tag => tag.trim()).filter(Boolean);

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/protected">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} />
            Zurück
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Neuer Prozess</h1>
          <p className="text-muted-foreground mt-1">
            Erstellen Sie einen neuen Geschäftsprozess durch Sprache oder Dokumente
          </p>
        </div>
      </div>

      {/* Process Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Prozess-Details
          </CardTitle>
          <CardDescription>
            Geben Sie grundlegende Informationen zu Ihrem Prozess ein
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titel des Prozesses *</Label>
            <Input
              id="title"
              placeholder="z.B. Kundenregistrierung, Rechnungsstellung, etc."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional)</Label>
            <Input
              id="tags"
              placeholder="z.B. Vertrieb, Onboarding, Finanzen (getrennt durch Komma)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            {tagsList.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tagsList.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic size={20} />
            Prozess-Inhalt
          </CardTitle>
          <CardDescription>
            Beschreiben Sie Ihren Prozess durch Sprache oder laden Sie Dokumente hoch
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Tipp</p>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Beschreiben Sie Ihren Prozess so, als würden Sie einem neuen Mitarbeiter erklären, wie er funktioniert. 
                  Je detaillierter Sie sind, desto besser wird das Ergebnis.
                </p>
              </div>
            </div>
          </div>

          {/* Voice Recording Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Sprachaufnahme</Label>
              {isRecording && (
                <Badge variant="destructive" className="animate-pulse">
                  Aufnahme läuft • {formatTime(recordingTime)}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  className="flex items-center gap-2"
                  disabled={audioBlob !== null}
                >
                  <Mic size={18} />
                  Aufnahme starten
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <MicOff size={18} />
                  Aufnahme beenden
                </Button>
              )}
              
              {audioUrl && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={togglePlayback}
                    variant="outline"
                    size="sm"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Aufnahme ({formatTime(recordingTime)})
                  </span>
                  <Button
                    onClick={deleteRecording}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </div>

            {audioUrl && (
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            )}
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Oder Dateien hochladen</Label>
            <div className="flex gap-4">
              <div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Upload size={18} />
                  Sprachdatei
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              
              <div>
                <Button
                  onClick={() => pdfInputRef.current?.click()}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FileText size={18} />
                  PDF Dokument
                </Button>
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Hochgeladene Dateien:</Label>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </Badge>
                      </div>
                      <Button
                        onClick={() => removeFile(index)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerateWorkflow}
          size="lg"
          className="text-lg px-8 py-6"
          disabled={!title.trim() || (!audioBlob && uploadedFiles.length === 0)}
        >
          Workflow generieren
        </Button>
      </div>
    </div>
  );
}