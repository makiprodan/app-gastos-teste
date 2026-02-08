"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Registra o service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registrado:", registration);
        })
        .catch((error) => {
          console.error("Erro ao registrar Service Worker:", error);
        });
    }

    // Captura o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Mostra o prompt apenas em mobile e se não foi instalado
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;

      if (isMobile && !isStandalone) {
        // Aguarda 5 segundos antes de mostrar o prompt
        setTimeout(() => setShowPrompt(true), 5000);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Detecta mudanças no status de conexão
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Define status inicial
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWA instalado");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Guarda no localStorage que o usuário dispensou
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  // Verifica se já foi dispensado anteriormente
  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissed) {
      setShowPrompt(false);
    }
  }, []);

  return (
    <>
      {/* Prompt de instalação */}
      {showPrompt && deferredPrompt && (
        <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
          <div className="rounded-lg border bg-card p-4 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold">Instalar Gastei</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Adicione à tela inicial para acesso rápido e uso offline
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="h-6 w-6 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={handleInstallClick}
                className="flex-1"
                size="sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Instalar
              </Button>
              <Button onClick={handleDismiss} variant="outline" size="sm">
                Agora não
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Aviso de modo offline */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 px-4 py-2 text-center text-sm font-medium text-yellow-950">
          Você está offline. Exibindo dados da última sincronização.
        </div>
      )}
    </>
  );
}
