import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API router
  app.post("/api/listing-craft", async (req, res) => {
    try {
      const { productInfo } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `作为一位资深的跨境电商运营（如Etsy、Amazon），请根据以下产品信息，生成一个高转化率的商品Listing。\n产品信息：${productInfo}\n\n请严格返回以下4部分结构，并使用Markdown格式：\n1. 吸引人的标题（Title）\n2. 高频搜索关键词（Tags/Keywords）\n3. 详细且带有感情色彩的商品描述（Description）\n4. 五大卖点（Bullet Points，清晰分点）`,
      });
      res.json({ success: true, text: response.text });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express v4, we use * 
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
