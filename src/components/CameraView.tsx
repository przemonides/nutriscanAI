import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, X, Upload } from 'lucide-react';

interface CameraViewProps {
  onCancel: () => void;
  onImageSelected: (base64: string, mimeType: string) => void;
}

export function CameraView({ onCancel, onImageSelected }: CameraViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Proszę wybrać plik graficzny.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const [prefix, base64] = result.split(',');
      const mimeType = prefix.match(/:(.*?);/)?.[1] || file.type;
      onImageSelected(base64, mimeType);
    };
    reader.onerror = () => {
      setError('Wystąpił błąd podczas wczytywania zdjęcia.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <header className="p-4 flex justify-between items-center text-white">
        <button onClick={onCancel} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <span className="font-medium tracking-wide">Dodaj Posiłek</span>
        <div className="w-10"></div> {/* Placeholder for balance */}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        <div className="text-center space-y-2 max-w-xs">
          <div className="mx-auto w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
            <Camera className="w-10 h-10 text-white/80" />
          </div>
          <h2 className="text-2xl font-bold text-white">Zrób zdjęcie</h2>
          <p className="text-white/60 text-sm">Prześlij zdjęcie swojego jedzenia, abyśmy mogli ocenić jego kaloryczność.</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <div className="w-full max-w-sm space-y-4 px-6">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
          >
            <Upload className="w-5 h-5" />
            Wybierz zdjęcie
          </button>
          
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </main>
    </div>
  );
}
