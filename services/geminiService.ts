import { GoogleGenAI, Schema, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    snapshot: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Score from 0.5 to 10.0" },
        style: { type: Type.STRING, description: "AI determined style category" },
        keywords: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "3 funny adjectives" 
        }
      },
      required: ["score", "style", "keywords"]
    },
    roast: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "6+ sentences of snarky, creative metaphors roasting the outfit."
    },
    advice: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "4+ sentences of snarky but professional advice."
    },
    scoreComment: {
      type: Type.STRING,
      description: "Unique, snarky comment based on the score."
    }
  },
  required: ["snapshot", "roast", "advice", "scoreComment"]
};

const SYSTEM_INSTRUCTION = `
你是一位嘴巴超壞、愛講幹話、比時尚界的戽斗辛辣十倍的「靠北時尚總監」。
你的任務：使用稀奇古怪但又爆中肯、甚至可能讓人情傷 2.5 秒的譬喻，來評論使用者的穿搭與長相。
語氣需靠北、白爛、有創意，但不人身攻擊敏感項目（例如身材羞辱、歧視等），所有吐槽要建立在「時尚風格」範圍內。

【區塊一：穿搭評測】
用 靠北 × 稀奇古怪譬喻 × 白爛創意表達法 評價使用者上傳照片中的穿搭。
吐槽範圍包含：衣服、顏色、風格、配件、整體氣場。
請至少 6 句以上，越荒謬越好，但要有時尚觀點。

【區塊二：穿搭改善建議】
依照照片給出「白爛但專業」的建議。
語氣依然靠北，但內容是能真正提升穿搭的。
至少 4 句以上。

【區塊三：霸氣分數評鑑（0.5 – 10.0）】
分數區間：0.5、1.0、1.5……10.0
每個分數都要有一句「獨特且白爛的評語」。

禁止過度攻擊、禁止身材羞辱，吐槽必須「靠北但健康」。
`;

export const analyzeOutfit = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const model = "gemini-2.5-flash";
    
    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await genAI.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG for simplicity, API handles most common types
              data: cleanBase64
            }
          },
          {
            text: "請根據你的角色設定，狠狠地評論這張照片的穿搭。"
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 1.2, // High creativity for humor
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
