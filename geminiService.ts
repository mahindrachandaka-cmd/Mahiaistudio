import { GoogleGenAI, Type, Modality } from "@google/genai";

/**
 * Robust API Instance Creator
 * Checks multiple locations for the API Key (Environment, Shim, or Hardcoded Fallback)
 */
const createAIInstance = () => {
  // Check common environment variable locations
  const apiKey = 
    process.env.API_KEY || 
    (window as any).process?.env?.API_KEY ||
    (import.meta as any).env?.VITE_API_KEY; // Support for Vite-based builds
  
  if (!apiKey) {
    console.error("MAHI STUDIO CRITICAL: No API_KEY found in Environment Variables.");
    // For hosting on Netlify, you MUST add API_KEY in the Site Settings dashboard.
  }

  return new GoogleGenAI({ apiKey: apiKey || "" });
};

/**
 * Universal Wrapper for Gemini Calls to prevent silent failures
 */
async function callGemini(action: (ai: GoogleGenAI) => Promise<any>) {
  const ai = createAIInstance();
  try {
    return await action(ai);
  } catch (error: any) {
    console.error("Mahi Studio API Call Failed:", error);
    // Provide user-friendly error messages for common issues
    if (error.message?.includes("API key not valid")) {
      throw new Error("Invalid API Key. Please check your AI Studio settings.");
    }
    if (error.message?.includes("quota")) {
      throw new Error("API Limit Reached. Please try again later.");
    }
    throw error;
  }
}

export const searchGroundedData = async (query: string, context: string) => {
  return callGemini(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${context}: ${query}. Provide factual data with links.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  });
};

export const generateAISpeech = async (text: string, voiceName: string = 'Zephyr'): Promise<string | null> => {
  return callGemini(async (ai) => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  });
};

export const generateAIResponse = async (prompt: string, systemInstruction: string): Promise<string> => {
  try {
    return await callGemini(async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction }
      });
      return response.text || "";
    });
  } catch (err: any) {
    return `Protocol Error: ${err.message}`;
  }
};

export const generateAIReasoning = async (prompt: string, systemInstruction: string) => {
  return callGemini(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        systemInstruction, 
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    return { text: response.text || "" };
  });
};

export const analyzeCropImage = async (base64: string) => {
  return callGemini(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { 
        parts: [
          { inlineData: { data: base64, mimeType: 'image/jpeg' } }, 
          { text: "Analyze this crop image for diseases. Provide organic solutions." }
        ] 
      }
    });
    return response.text || "";
  });
};

export const generateAIImage = async (prompt: string): Promise<string | null> => {
  return callGemini(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    const imgPart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    return imgPart ? `data:image/png;base64,${imgPart.inlineData.data}` : null;
  });
};

export const generateWebsiteCode = async (prompt: string): Promise<string> => {
  return callGemini(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "Create a single-file high-fidelity HTML/CSS/JS solution. No markdown, just code."
      }
    });
    return response.text || "";
  });
};

export const refineWebsiteCode = async (code: string, refinement: string): Promise<string> => {
  return callGemini(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Code:\n${code}\n\nRefinement: ${refinement}`,
      config: { systemInstruction: "Refine code based on request." }
    });
    return response.text || "";
  });
};

export const simulateAI = async (prompt: string, params: { temperature: number, topP: number }): Promise<string> => {
  return callGemini(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: params.temperature, topP: params.topP }
    });
    return response.text || "";
  });
};

export const evaluateEthics = async (text: string): Promise<string> => {
  return callGemini(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Evaluate text for bias: ${text}`,
    });
    return response.text || "";
  });
};

export const generateMetaCognitiveResponse = async (query: string) => {
  return callGemini(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: query,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            critique: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            uncertainty_reason: { type: Type.STRING },
          },
          required: ['answer', 'critique', 'confidence', 'uncertainty_reason']
        }
      }
    });
    return JSON.parse(response.text || "{}");
  });
};

export const generatePerspectives = async (query: string) => {
  return callGemini(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            Scientist: { type: Type.STRING },
            Philosopher: { type: Type.STRING },
            Artist: { type: Type.STRING },
            Skeptic: { type: Type.STRING },
          },
          required: ['Scientist', 'Philosopher', 'Artist', 'Skeptic']
        }
      }
    });
    return JSON.parse(response.text || "{}");
  });
};

export const predictCausalChain = async (action: string) => {
  return callGemini(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: action,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            short_term: { type: Type.ARRAY, items: { type: Type.STRING } },
            long_term: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['short_term', 'long_term']
        }
      }
    });
    return JSON.parse(response.text || "{}");
  });
};

export const generateTemporalResponses = async (query: string) => {
  return callGemini(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            'Today': { type: Type.STRING },
            '5 Years Later': { type: Type.STRING },
            '20 Years Later': { type: Type.STRING },
            '50 Years Later': { type: Type.STRING },
          },
          required: ['Today', '5 Years Later', '20 Years Later', '50 Years Later']
        }
      }
    });
    return JSON.parse(response.text || "{}");
  });
};

export const generateMedicalAnalysis = async (symptoms: string) => {
  return callGemini(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: symptoms,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primary_hypothesis: { type: Type.STRING },
            confidence_level: { type: Type.INTEGER },
            reasoning_path: { type: Type.ARRAY, items: { type: Type.STRING } },
            doubt_factors: { type: Type.ARRAY, items: { type: Type.STRING } },
            self_limitation: { type: Type.STRING },
            recommended_specialist: { type: Type.STRING },
          },
          required: ['primary_hypothesis', 'confidence_level', 'reasoning_path', 'doubt_factors', 'self_limitation', 'recommended_specialist']
        }
      }
    });
    return JSON.parse(response.text || "{}");
  });
};

export const connectLiveSession = (callbacks: any, systemInstruction: string) => {
  const ai = createAIInstance();
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      systemInstruction,
    },
  });
};