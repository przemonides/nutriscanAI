export interface NutritionalInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface AnalysisResult extends NutritionalInfo {
  dishName: string;
  ingredients: string[];
  recipeSteps: string[];
}

export interface Meal extends AnalysisResult {
  id: string;
  timestamp: number;
}
