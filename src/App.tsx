import { useState, useEffect } from 'react';
import { Meal, AnalysisResult } from './types';
import { Dashboard } from './components/Dashboard';
import { CameraView } from './components/CameraView';
import { AnalysisResultView } from './components/AnalysisResultView';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

type ViewState = 'dashboard' | 'camera' | 'analysis';

export default function App() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    result: AnalysisResult;
    base64: string;
    mimeType: string;
  } | null>(null);

  useEffect(() => {
    const savedMeals = localStorage.getItem('meals');
    if (savedMeals) {
      try {
        setMeals(JSON.parse(savedMeals));
      } catch (e) {
        console.error("Failed to load meals", e);
      }
    }
  }, []);

  const saveMeals = (newMeals: Meal[]) => {
    setMeals(newMeals);
    localStorage.setItem('meals', JSON.stringify(newMeals));
  };

  const handleImageSelected = async (base64: string, mimeType: string) => {
    setIsAnalyzing(true);
    setView('analysis');
    
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze food');
      }

      const result: AnalysisResult = await response.json();
      setCurrentAnalysis({ result, base64, mimeType });
    } catch (error) {
      console.error(error);
      alert('Nie udało się przeanalizować zdjęcia. Spróbuj ponownie.');
      setView('camera');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 overflow-hidden font-sans">
      <div className="max-w-md mx-auto min-h-screen bg-white relative shadow-2xl">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <Dashboard 
                meals={meals} 
                onAddMeal={() => setView('camera')} 
              />
            </motion.div>
          )}

          {view === 'camera' && (
            <motion.div 
              key="camera"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-50"
            >
              <CameraView 
                onCancel={() => setView('dashboard')}
                onImageSelected={handleImageSelected}
              />
            </motion.div>
          )}

          {view === 'analysis' && isAnalyzing && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 text-center"
            >
              <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-6" />
              <h2 className="text-xl font-bold text-white mb-2">Analizuję posiłek...</h2>
              <p className="text-slate-400 text-sm max-w-[250px]">Sztuczna inteligencja rozpoznaje składniki i szacuje kalorie.</p>
            </motion.div>
          )}

          {view === 'analysis' && !isAnalyzing && currentAnalysis && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 z-40 bg-white"
            >
              <AnalysisResultView 
                result={currentAnalysis.result}
                imageBase64={currentAnalysis.base64}
                imagePrefix={currentAnalysis.mimeType}
                onSave={(meal) => {
                  saveMeals([...meals, meal]);
                  setView('dashboard');
                  setCurrentAnalysis(null);
                }}
                onCancel={() => setView('dashboard')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
