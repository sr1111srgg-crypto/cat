import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing json
  app.use(express.json());

  // Initialize Gemini API client if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // API endpoint to generate funny cat profile/identity
  app.post("/api/gemini/cat-profile", async (req, res) => {
    try {
      if (!ai) {
        // Fallback mock responses if API key is not configured, to keep app functional
        return res.json({
          funnyName: req.body.name || "胖虎 (Fat Tiger)",
          title: "三点起居注大总管 (3 AM Alarm Clock)",
          secretBackground: "白天是在阳台睡觉的普通家猫，晚上则是暗夜喵喵特工队（N.Y.A.）的王牌特工，曾成功从铲屎官手中解救了十五个纸箱。",
          traits: [
            "液体形态转换：能把自己塞进任何容器，包括咖啡杯。",
            "凌晨交响乐：喜欢在凌晨三点在主人的肚子上跑酷并高歌一曲。",
            "眼神杀手：擅长用极度鄙视的眼神盯着铲屎官，让其反省自己哪里做错了。"
          ],
          thoughts: [
            "铲屎的刚才呼吸了，他是不是想偷吃我的小鱼干？",
            "那个红点点……它又出现了，今天我一定要消灭它！",
            "纸箱才是猫生终极追求，那张五百块的猫窝简直是垃圾。",
            "愚蠢的人类，为什么一直在看那个发光的方块？",
            "我的碗里已经空了（指露出碗底直径1厘米的空白）！"
          ]
        });
      }

      const { name, breed, colors, eyeType, expression, accessories, personalityTraits } = req.body;

      const prompt = `Please generate a highly humorous, adorable, and creative cat personality profile.
      The cat has the following customized configurations:
      - Name: ${name || "Unnamed Cat"}
      - Breed: ${breed}
      - Primary Color: ${colors?.primary || "Default"}
      - Accent Color: ${colors?.secondary || "Default"}
      - Eye Expression: ${eyeType}
      - Mouth Expression: ${expression}
      - Accessories: ${accessories?.join(", ") || "None"}
      - Selected Core Habits: ${personalityTraits?.join(", ") || "None"}

      Generate a funny and cute profile in Chinese, tailored specifically to these attributes. Make it appealing to Gen Z/young people, self-deprecating, and hilarious.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a master cat whisperer and professional comedy writer who specializes in writing hilarious, cute, and witty descriptions for customized cartoon cats in Chinese.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              funnyName: { type: Type.STRING, description: "A funny, cute and creative Chinese nickname or alias based on their characteristics" },
              title: { type: Type.STRING, description: "A hilarious and formal professional job title or societal status (e.g., '首席纸箱质检员')" },
              secretBackground: { type: Type.STRING, description: "A short, extremely funny secret backstory or double life of this cat in Chinese (2-3 sentences)" },
              traits: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 3 bizarre, funny and incredibly specific traits or habits of this customized cat"
              },
              thoughts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 5 ultra-short, hilarious mental inner dialogues or thoughts (under 15 Chinese characters each) this cat thinks as it wanders around"
              }
            },
            required: ["funnyName", "title", "secretBackground", "traits", "thoughts"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response from Gemini API");
      }

      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate cat identity" });
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
