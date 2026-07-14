import React, { useState } from 'react';
import { AnalysisResult, Meal } from '../types';
import { Check, X, ChevronRight, Edit2 } from 'lucide-react';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  imagePrefix: string;
  imageBase64: string;
  onSave: (meal: Meal) => void;
  onCancel: () => void;
}

export function AnalysisResultView({ result, imagePrefix, imageBase64, onSave, onCancel }: AnalysisResultViewProps) {
  const [editedResult, setEditedResult] = useState<AnalysisResult>(result);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave({
      ...editedResult,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...editedResult.ingredients];
    newIngredients[index] = value;
    setEditedResult({ ...editedResult, ingredients: newIngredients });
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-900 font-sans min-h-screen">
      <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-10 border-b border-slate-200 shadow-sm">
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 rounded-full">
          <X className="w-5 h-5" />
        </button>
        <span className="font-semibold text-slate-800">Analiza posiłku</span>
        <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full font-semibold text-sm">
          {isEditing ? 'Gotowe' : 'Edytuj'}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-28">
        
        {/* SCANNER PREVIEW */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="relative h-64 bg-slate-100">
            <img 
              src={`data:${imagePrefix};base64,${imageBase64}`} 
              alt="Food" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-6">
              <div className="p-4 bg-white/90 backdrop-blur rounded-2xl text-center shadow-xl w-full">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Analiza AI</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedResult.dishName}
                    onChange={(e) => setEditedResult({...editedResult, dishName: e.target.value})}
                    className="bg-white border border-slate-200 text-slate-900 text-center px-3 py-1.5 rounded-lg w-full font-bold text-lg focus:outline-none focus:border-emerald-500"
                  />
                ) : (
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{editedResult.dishName}</h3>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* MACRO BREAKDOWN */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-bold text-slate-700">Szacowane Makro</h3>
            <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-full text-slate-500 font-bold">PROGNOZA</span>
          </div>
          <div className="flex justify-around items-end gap-2">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 bg-emerald-100 rounded-full relative h-24 overflow-hidden">
                <div className="absolute bottom-0 w-full bg-emerald-500 rounded-full transition-all duration-500" style={{ height: `${Math.min(100, (editedResult.protein / 50) * 100)}%` }}></div>
              </div>
              {isEditing ? (
                <div className="flex items-center text-xs font-bold text-slate-500"><span className="mr-1">B:</span><input type="number" value={editedResult.protein} onChange={e => setEditedResult({...editedResult, protein: Number(e.target.value)})} className="w-8 text-center bg-slate-50 border border-slate-200 rounded px-1 py-0.5" /></div>
              ) : (
                <span className="text-xs font-bold text-slate-500">B: {editedResult.protein}g</span>
              )}
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 bg-blue-100 rounded-full relative h-24 overflow-hidden">
                <div className="absolute bottom-0 w-full bg-blue-500 rounded-full transition-all duration-500" style={{ height: `${Math.min(100, (editedResult.carbs / 80) * 100)}%` }}></div>
              </div>
              {isEditing ? (
                <div className="flex items-center text-xs font-bold text-slate-500"><span className="mr-1">W:</span><input type="number" value={editedResult.carbs} onChange={e => setEditedResult({...editedResult, carbs: Number(e.target.value)})} className="w-8 text-center bg-slate-50 border border-slate-200 rounded px-1 py-0.5" /></div>
              ) : (
                <span className="text-xs font-bold text-slate-500">W: {editedResult.carbs}g</span>
              )}
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 bg-amber-100 rounded-full relative h-24 overflow-hidden">
                <div className="absolute bottom-0 w-full bg-amber-500 rounded-full transition-all duration-500" style={{ height: `${Math.min(100, (editedResult.fat / 40) * 100)}%` }}></div>
              </div>
              {isEditing ? (
                <div className="flex items-center text-xs font-bold text-slate-500"><span className="mr-1">T:</span><input type="number" value={editedResult.fat} onChange={e => setEditedResult({...editedResult, fat: Number(e.target.value)})} className="w-8 text-center bg-slate-50 border border-slate-200 rounded px-1 py-0.5" /></div>
              ) : (
                <span className="text-xs font-bold text-slate-500">T: {editedResult.fat}g</span>
              )}
            </div>
            
            <div className="flex flex-col items-center mb-5 ml-2">
              {isEditing ? (
                <input type="number" value={editedResult.calories} onChange={e => setEditedResult({...editedResult, calories: Number(e.target.value)})} className="w-16 text-center text-2xl font-black text-slate-800 bg-slate-50 border border-slate-200 rounded mb-1 px-1" />
              ) : (
                <span className="text-4xl tracking-tighter font-black text-slate-800">{editedResult.calories}</span>
              )}
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">kcal</span>
            </div>
          </div>
        </section>

        {/* INGREDIENTS & ADJUSTMENTS */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4 flex justify-between items-center">
            Składniki i porcja
            {isEditing && <span className="text-xs text-emerald-500 font-medium">Tryb edycji</span>}
          </h3>
          <div className="space-y-3">
            {editedResult.ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 w-full">
                  <span className="text-lg">🥣</span>
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={ing}
                        onChange={(e) => handleIngredientChange(idx, e.target.value)}
                        className="font-semibold text-sm bg-white border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-emerald-500 w-full text-slate-800"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800">{ing}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RECIPE STEPS */}
        <section className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Prosty Przepis</h3>
          <div className="space-y-3">
            {editedResult.recipeSteps.map((step, idx) => (
              <p key={idx} className="text-xs leading-relaxed opacity-90 text-slate-300">
                <span className="font-bold text-emerald-400 mr-2">{idx + 1}.</span> 
                {step}
              </p>
            ))}
          </div>
        </section>

      </main>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6 pointer-events-none">
        <button
          onClick={handleSave}
          className="pointer-events-auto bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors w-full max-w-[calc(100%-3rem)] py-4 rounded-xl flex items-center justify-center gap-2 font-bold"
        >
          <Check className="w-5 h-5" />
          Zapisz Posiłek
        </button>
      </div>
    </div>
  );
}
