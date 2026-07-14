import React from 'react';
import { Meal } from '../types';
import { Plus, Utensils } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  meals: Meal[];
  onAddMeal: () => void;
}

export function Dashboard({ meals, onAddMeal }: DashboardProps) {
  const totals = meals.reduce(
    (acc, meal) => {
      acc.calories += meal.calories;
      acc.protein += meal.protein;
      acc.fat += meal.fat;
      acc.carbs += meal.carbs;
      return acc;
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const goalCalories = 2000;
  const goalProtein = 160;
  const goalCarbs = 220;
  const goalFat = 70;

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-900 font-sans min-h-screen">
      <nav className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">N</div>
          <span className="text-xl font-bold tracking-tight text-slate-800">NutriScan<span className="text-emerald-500 underline decoration-2 underline-offset-4">AI</span></span>
        </div>
      </nav>

      <main className="flex-1 p-4 flex flex-col gap-4 pb-28">
        
        {/* DAILY SUMMARY (Bento Item) */}
        <section className="bg-emerald-50 rounded-3xl border border-emerald-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-emerald-900">Podsumowanie Dnia</h3>
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-[10px] text-emerald-700 uppercase font-bold">Zjedzone</p>
                <p className="text-xl font-black text-emerald-900">{Math.round(totals.calories)} <span className="text-xs font-normal">kcal</span></p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-emerald-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Białko</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold">{Math.round(totals.protein)}</span><span className="text-[10px] text-slate-400">/ {goalProtein}g</span>
              </div>
              <div className="w-full h-1 bg-emerald-100 rounded-full mt-2"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (totals.protein / goalProtein) * 100)}%` }}></div></div>
            </div>
            
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-emerald-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Węgle</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold">{Math.round(totals.carbs)}</span><span className="text-[10px] text-slate-400">/ {goalCarbs}g</span>
              </div>
              <div className="w-full h-1 bg-blue-100 rounded-full mt-2"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (totals.carbs / goalCarbs) * 100)}%` }}></div></div>
            </div>
            
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-emerald-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Tłuszcze</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold">{Math.round(totals.fat)}</span><span className="text-[10px] text-slate-400">/ {goalFat}g</span>
              </div>
              <div className="w-full h-1 bg-amber-100 rounded-full mt-2"><div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (totals.fat / goalFat) * 100)}%` }}></div></div>
            </div>

            <div className="bg-white p-3 rounded-2xl shadow-sm border border-emerald-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Woda</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold">1.5</span><span className="text-[10px] text-slate-400">/ 2.5L</span>
              </div>
              <div className="w-full h-1 bg-sky-100 rounded-full mt-2"><div className="h-full bg-sky-500 w-[60%] rounded-full"></div></div>
            </div>
          </div>
        </section>

        {/* RECENT HISTORY (Bento Item) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Historia Posiłków</h3>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">{meals.length}</span>
          </div>
          
          {meals.length === 0 ? (
            <div className="text-center py-8 px-4 flex flex-col items-center justify-center flex-1">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                <Utensils className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm">Brak posiłków dzisiaj</p>
            </div>
          ) : (
            <div className="space-y-3">
              {meals.map((meal, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={meal.id} 
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-600">
                     <Utensils className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{meal.dishName}</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {Math.round(meal.calories)} kcal
                    </p>
                  </div>
                  <span className="text-emerald-500 text-xs">●</span>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6 pointer-events-none">
        <button
          onClick={onAddMeal}
          className="pointer-events-auto bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors w-full max-w-[calc(100%-3rem)] py-4 rounded-xl flex items-center justify-center gap-2 font-bold"
        >
          <Plus className="w-5 h-5" />
          Zrób Zdjęcie
        </button>
      </div>
    </div>
  );
}
