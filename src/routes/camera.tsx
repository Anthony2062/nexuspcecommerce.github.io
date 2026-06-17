import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, Upload, MapPin, Clock, X } from "lucide-react";
import { Header } from "@/components/Header";
import { nearestCity } from "@/lib/geo";

export const Route = createFileRoute("/camera")({
  head: () => ({
    meta: [
      { title: "Câmera & Localização — Nexus PC" },
      {
        name: "description",
        content:
          "Capture uma foto pela câmera ou envie um arquivo e registre data, hora e localização GPS.",
      },
    ],
  }),
  component: CameraPage,
});

function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [streaming, setStreaming] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [datetime, setDatetime] = useState("Aguardando captura…");
  const [location, setLocation] = useState("Carregando GPS…");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Pré-carrega o GPS ao abrir a página
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation("Geolocalização não suportada.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocation("GPS pronto.");
      },
      () => setLocation("Erro ao iniciar GPS (verifique as permissões)."),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function stampMetadata(current?: { lat: number; lon: number } | null) {
    setDatetime(new Date().toLocaleString("pt-BR"));
    const c = current ?? coords;
    if (c) {
      const near = nearestCity(c.lat, c.lon);
      setLocation(
        `Lat ${c.lat.toFixed(6)} | Long ${c.lon.toFixed(6)} — próximo a ${near.city.name}/${near.city.uf}`,
      );
    } else if ("geolocation" in navigator) {
      setLocation("Buscando coordenadas em tempo real…");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const nc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          setCoords(nc);
          stampMetadata(nc);
        },
        () => setLocation("Não foi possível obter a localização."),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    }
  }

  async function openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStreaming(true);
    } catch {
      alert(
        "Erro ao acessar a câmera. Certifique-se de estar usando HTTPS e de permitir o acesso.",
      );
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStreaming(false);
  }

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPreview(canvas.toDataURL("image/png"));
    stampMetadata();
    stopCamera();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    stampMetadata();
  }

  return (
    <div className="min-h-screen">
      <Header />
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-extrabold">
          Câmera & <span className="text-gold">Localização</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tire uma foto ou envie um arquivo. Registramos automaticamente a data,
          a hora e a sua localização GPS.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-md border border-gold/40 bg-secondary/40 px-4 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-secondary"
          >
            <Upload className="h-4 w-4" /> Enviar foto
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            className="hidden"
          />
          {streaming ? (
            <>
              <button
                onClick={capture}
                className="flex items-center gap-2 rounded-md bg-gradient-gold px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-gold"
              >
                <Camera className="h-4 w-4" /> Capturar
              </button>
              <button
                onClick={stopCamera}
                className="flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" /> Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={openCamera}
              className="flex items-center gap-2 rounded-md bg-gradient-gold px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-gold"
            >
              <Camera className="h-4 w-4" /> Tirar foto
            </button>
          )}
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-black/40">
          <video
            ref={videoRef}
            playsInline
            className={`w-full ${streaming ? "block" : "hidden"}`}
          />
          {!streaming && preview && (
            <img src={preview} alt="Pré-visualização" className="w-full" />
          )}
          {!streaming && !preview && (
            <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
              Nenhuma imagem selecionada
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="mt-6 space-y-2 rounded-xl border border-border bg-card p-5">
          <p className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gold" />
            <span className="font-semibold">Data/Hora:</span>
            <span className="text-muted-foreground">{datetime}</span>
          </p>
          <p className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gold" />
            <span className="font-semibold">Localização:</span>
            <span className="text-muted-foreground">{location}</span>
          </p>
        </div>
      </section>
    </div>
  );
}