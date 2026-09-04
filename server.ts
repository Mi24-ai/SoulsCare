import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialization helper for Gemini
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Health
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "Souls Care Mental Wellness API" });
});

// AI Companion Chat Endpoint
app.post("/api/chat/companion", async (req: Request, res: Response) => {
  try {
    const { messages, tone = "empathetic", userContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGeminiClient();

    // Fallback if no API key configured
    if (!ai) {
      const lastMsg = messages[messages.length - 1]?.content || "";
      return res.json({
        reply: `Halo! Aku Aria, teman setia Souls Care-mu. Aku mendengar apa yang kamu ceritakan: "${lastMsg.slice(0, 50)}...". Ingat ya, apa yang kamu rasakan itu valid. Tarik napas perlahan, kamu tidak sendirian menghadapi ini semua. Ada hal spesifik yang ingin kita urai bersama hari ini? 🌿`,
        sentiment: "supportive",
        suggestedExercise: "breathing",
      });
    }

    const toneInstructions: Record<string, string> = {
      empathetic: "Gaya bicara hangat, santai khas Gen Z Indonesia yang sopan dan sangat validatif (menggunakan 'kamu-aku', kata-kata menenangkan, non-judgmental, tidak menggurui).",
      solution: "Gaya bicara praktis, mindful, memberikan langkah kecil (baby steps) yang mudah dicoba untuk mengurai overthinking atau kecemasan.",
      reflective: "Gaya bicara reflektif seperti journaling buddy, menanyakan pertanyaan terbuka yang memantik kesadaran diri.",
    };

    const systemInstruction = `Kamu adalah 'Aria', AI Mental Wellness Companion di platform 'Souls Care' (aplikasi kesehatan mental terjangkau untuk Gen Z Indonesia).
Tujuanmu:
1. Memberikan ruang aman (safe space) 24/7 yang hangat, suportif, empatik, dan bebas stigma.
2. Validasi emosi pengguna terlebih dahulu sebelum memberikan saran. Jangan pernah menyepelekan rasa cemas, lelah, burnout kampus/kerja, atau masalah relasi.
3. Gunakan bahasa Indonesia yang natural, hangat, ramah Gen Z (kata sapaan 'kamu', sesekali istilah relatable seperti overthinking, burnout, healing, recharging energi tanpa berlebihan).
4. Berikan teknik grounding sederhana (seperti 4-7-8 breathing, 5-4-3-2-1 senses) jika pengguna merasa panik atau kewalahan.
5. PENTING (Protokol Keselamatan): Jika pengguna menyatakan keinginan menyakiti diri sendiri atau krisis ekstrem, sampaikan rasa peduli mendalam dengan tenang, dan sarankan segera menghubungi saluran darurat (Kemenkes Sejiwa 119 ext 8, atau hotline Into The Light Indonesia), serta sarankan booking konselor berlisensi di Souls Care.
6. Catatan: Kamu adalah pendamping emosional AI, bukan pengganti psikolog klinis berlisensi untuk diagnosis medis.

${toneInstructions[tone] || toneInstructions.empathetic}
${userContext ? `Konteks Pengguna: ${JSON.stringify(userContext)}` : ""}`;

    // Format chat history for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const replyText = response.text || "Aku di sini mendengarkanmu. Ceritakan pelan-pelan ya...";

    // Determine suggestion tag
    let suggestedExercise: string | undefined;
    const lowerReply = replyText.toLowerCase();
    if (lowerReply.includes("napas") || lowerReply.includes("breathing") || lowerReply.includes("tarik napas")) {
      suggestedExercise = "breathing";
    } else if (lowerReply.includes("grounding") || lowerReply.includes("panca indera")) {
      suggestedExercise = "grounding";
    } else if (lowerReply.includes("tulis") || lowerReply.includes("jurnal")) {
      suggestedExercise = "journal";
    } else if (lowerReply.includes("konseling") || lowerReply.includes("psikolog")) {
      suggestedExercise = "counseling";
    }

    return res.json({
      reply: replyText,
      suggestedExercise,
    });
  } catch (error: any) {
    console.error("AI Companion error:", error);
    return res.status(500).json({
      error: "Terjadi gangguan saat menghubungkan ke Aria AI. Silakan coba lagi.",
      details: error?.message,
    });
  }
});

// AI Journal Reflection Endpoint
app.post("/api/ai/journal-reflect", async (req: Request, res: Response) => {
  try {
    const { entry, mood, gratitude } = req.body;

    if (!entry) {
      return res.status(400).json({ error: "Journal entry is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        summary: "Jurnalmu menunjukkan refleksi diri yang jujur dan berani.",
        emotionalInsights: [
          "Kamu berhasil mengenali pemicu rasa lelah dan tidak menyangkal perasaanmu.",
          "Fokus pada langkah kecil hari ini akan membantumu mengurai beban pikiran.",
        ],
        affirmation: "Setiap langkah kecil yang kamu ambil hari ini sudah lebih dari cukup. Kamu berharga apa adanya.",
        sentimentScore: 0.75,
      });
    }

    const prompt = `Analisis tulisan jurnal kesehatan mental berikut dari pengguna Gen Z:
Mood saat ini: ${mood || "Netral"}
Hal yang disyukuri: ${gratitude || "Belum diisi"}
Isi Jurnal:
"""${entry}"""

Berikan output dalam format JSON dengan struktur:
{
  "summary": "Ringkasan hangat 1-2 kalimat mengenai apa yang dialami pengguna",
  "emotionalInsights": ["Poin reflektif 1 mengenai pola emosi / kekuatan internal pengguna", "Poin reflektif 2 saran mindful sederhana"],
  "affirmation": "Kalimat afirmasi positif personal yang menenangkan jiwa",
  "sentimentScore": 0.8 (angka antara 0.1 sangat tertekan hingga 1.0 sangat positif)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err: any) {
    console.error("Journal reflection error:", err);
    return res.status(500).json({
      error: "Gagal menganalisis jurnal",
      details: err?.message,
    });
  }
});

// AI Sliding-Scale Financial Subsidy Evaluator Endpoint
app.post("/api/ai/sliding-scale-assessment", async (req: Request, res: Response) => {
  try {
    const { occupation, monthlyIncomeRange, livingCondition, financialStrainNote, partnerCode } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Rule-based fallback
      let tier = "Standard";
      let subsidyPercent = 0;
      let reason = "Evaluasi standar berdasarkan data profil.";

      if (partnerCode && partnerCode.trim().length > 0) {
        tier = "Institutional Partner";
        subsidyPercent = 100;
        reason = "Kemitraan institusi / beasiswa kampus terverifikasi.";
      } else if (occupation === "Mahasiswa" || occupation === "Pencari Kerja" || monthlyIncomeRange === "< Rp 1.500.000") {
        tier = "Beasiswa Jiwa (Subsidi Penuh)";
        subsidyPercent = 85;
        reason = "Memenuhi kriteria subsidi silang prioritas untuk mahasiswa dan pencari kerja.";
      } else if (monthlyIncomeRange === "Rp 1.500.000 - Rp 3.500.000") {
        tier = "Subsidi Peduli (Tier 2)";
        subsidyPercent = 50;
        reason = "Subsidi adaptif untuk pendapatan menengah-bawah.";
      }

      return res.json({
        tier,
        subsidyPercent,
        recommendedPricePerSession: Math.round(150000 * (1 - subsidyPercent / 100)),
        rationale: reason,
        perks: [
          "Akses tak terbatas AI Companion Aria",
          "Gratis 1x Konseling Profesional per bulan",
          "Subsidi asuransi mikro SoulProtect 50%",
        ],
      });
    }

    const prompt = `Evaluasi permohonan penyesuaian harga Sliding-Scale & Subsidi Silang untuk platform kesehatan mental Gen Z Souls Care.
Data Pengguna:
- Profesi/Status: ${occupation}
- Rentang Penghasilan / Uang Saku Bulanan: ${monthlyIncomeRange}
- Kondisi Tempat Tinggal: ${livingCondition}
- Catatan Beban Finansial: "${financialStrainNote || "Tidak ada catatan tambahan"}"
- Kode Kemitraan Kampus / CSR: ${partnerCode || "Tidak ada"}

Harga acuan konseling standar adalah Rp 150.000/sesi.
Tentukan tier subsidi yang adil, persentase subsidi (0%, 30%, 50%, 75%, 85%, atau 100%), harga rekomendasi per sesi, dan alasan empatik.

Kembalikan dalam JSON:
{
  "tier": "Nama Tier (cth: Beasiswa Jiwa Mahasiswa / Subsidi Peduli / Reguler Terjangkau / Mitra Kampus)",
  "subsidyPercent": 85,
  "recommendedPricePerSession": 22500,
  "rationale": "Penjelasan mengapa pengguna berhak mendapatkan tier ini dengan bahasa hangat dan suportif",
  "perks": ["Benefit 1", "Benefit 2", "Benefit 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err: any) {
    console.error("Sliding scale error:", err);
    return res.status(500).json({
      error: "Gagal menghitung sliding scale",
      details: err?.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Souls Care Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
