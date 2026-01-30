
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2, Send } from 'lucide-react';
import { Button } from './Button';
import { Product } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface StyleAdviceProps {
  product: Product | null;
}

export const StyleAdvice: React.FC<StyleAdviceProps> = ({ product }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const getAdvice = async () => {
    if (!product) return;
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a Gen Z Kenyan fashion stylist. Give a short, punchy, and trendy 2-sentence advice on how to style this thrifted item: "${product.name}" (${product.category}). Use some Kenyan slang like "luku", "piga luku", or "drip".`,
        config: {
            systemInstruction: "You are a cool Nairobi fashion icon. Keep it brief, high-energy, and modern.",
            temperature: 0.8
        }
      });
      setAdvice(response.text || "Couldn't get the vibes right now, fam. Try again!");
    } catch (error) {
      setAdvice("System's down. Too much drip?");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="mt-8 border-4 border-black bg-[#7B2CBF] p-6 text-white neo-shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-[#A3FF00]" />
        <h4 className="font-black uppercase italic">AI STYLE GURU</h4>
      </div>
      
      {advice ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <p className="font-bold text-lg leading-tight">"{advice}"</p>
          <Button variant="primary" size="sm" onClick={() => setAdvice('')}>ASK AGAIN</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="font-bold">Not sure how to rock this {product.name}?</p>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={getAdvice} 
            disabled={loading}
            fullWidth
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
            {loading ? "CONSULTING THE STREETS..." : "GET STYLING TIPS"}
          </Button>
        </div>
      )}
    </div>
  );
};
