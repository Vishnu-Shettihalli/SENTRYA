import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ScamAnalysisResult {
  isScam: boolean;
  riskLevel: "low" | "medium" | "high";
  explanation: string;
  detectedKeywords: string[];
  recommendedAction: string;
}

export const analyzeScam = async (content: string): Promise<ScamAnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: `Analyze the following communication (Call transcript or SMS) for potential scams targeting rural banking users in India. 
    Content: "${content}"
    
    Look for:
    - Urgency or threats (KYC expiry, account block)
    - Requests for sensitive info (OTP, PIN, CVV)
    - Unrealistic promises (Lottery, rewards)
    - Impersonation of bank officials
    
    Return the analysis in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isScam: { type: Type.BOOLEAN },
          riskLevel: { type: Type.STRING, enum: ["low", "medium", "high"] },
          explanation: { type: Type.STRING },
          detectedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendedAction: { type: Type.STRING },
        },
        required: ["isScam", "riskLevel", "explanation", "detectedKeywords", "recommendedAction"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export interface IntentVerificationResult {
  isRisky: boolean;
  riskScore: number;
  explanation: string;
  followUpQuestions: string[];
}

export const verifyIntent = async (
  transactionDetails: { amount: number; receiver: string },
  userAnswers: string[]
): Promise<IntentVerificationResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: `Evaluate the risk of a transaction based on user intent.
    Transaction: Sending ₹${transactionDetails.amount} to ${transactionDetails.receiver}.
    User's answers to verification questions: ${userAnswers.join(", ")}
    
    Determine if the user is being coerced or tricked.
    Return the analysis in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isRisky: { type: Type.BOOLEAN },
          riskScore: { type: Type.NUMBER, description: "0-100 score" },
          explanation: { type: Type.STRING },
          followUpQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["isRisky", "riskScore", "explanation", "followUpQuestions"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const getChatResponse = async (message: string, history: any[] = []) => {
  const chat = ai.chats.create({
    model: "gemini-1.5-flash",
    config: {
      systemInstruction: "You are SENTRYA AI, a helpful and protective banking assistant for rural Indian users. Your goal is to explain banking safety, identify scams, and help users navigate the app in simple language. Support multiple Indian languages (Hindi, Kannada, Telugu, Tamil). IMPORTANT: Always respond in the SAME language the user uses. Keep responses extremely concise and fast.",
    },
    history: history,
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};

export const generateSpeech = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("Speech generation failed:", error);
    return null;
  }
};
