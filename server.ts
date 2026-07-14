import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON with a larger limit for images
  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini API
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // API Routes
  app.post("/api/analyze-food", async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;

      if (!imageBase64 || !mimeType) {
        res.status(400).json({ error: "Missing image data or mimeType" });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
         res.status(500).json({ error: "Brak klucza API Gemini" });
         return;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: "Przeanalizuj to zdjęcie jedzenia. Rozpoznaj potrawę, wymień prawdopodobne składniki, podaj prosty przepis krok po kroku oraz oszacuj kalorie i makroskładniki (białko, tłuszcze, węglowodany). Pamiętaj, że wartości odżywcze to tylko szacunki dla standardowej porcji. Zwróć dane w formacie JSON zgodnym ze schematem.",
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              dishName: {
                type: Type.STRING,
                description: "Nazwa rozpoznanej potrawy (np. Jajecznica z boczkiem, Pizza Margherita).",
              },
              ingredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista głównych rozpoznanych składników z podaniem ich przybliżonych ilości, jeśli możliwe.",
              },
              recipeSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Krótkie, proste kroki przepisu na przygotowanie tej potrawy.",
              },
              calories: {
                type: Type.NUMBER,
                description: "Szacowana liczba kilokalorii (kcal) dla porcji ze zdjęcia.",
              },
              protein: {
                type: Type.NUMBER,
                description: "Szacowana ilość białka w gramach.",
              },
              fat: {
                type: Type.NUMBER,
                description: "Szacowana ilość tłuszczu w gramach.",
              },
              carbs: {
                type: Type.NUMBER,
                description: "Szacowana ilość węglowodanów w gramach.",
              },
            },
            required: ["dishName", "ingredients", "recipeSteps", "calories", "protein", "fat", "carbs"],
          },
        },
      });

      if (!response.text) {
        throw new Error("Pusta odpowiedź z modelu");
      }

      const data = JSON.parse(response.text);
      res.json(data);
    } catch (error) {
      console.error("Error analyzing food:", error);
      res.status(500).json({ error: "Wystąpił błąd podczas analizy obrazu." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
