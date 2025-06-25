require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
  try {
    let { messages } = req.body;

    // Tambahkan system message di awal untuk memberi tahu AI tentang perannya
    messages = [
      {
        role: 'system',
        content: `Kamu adalah Hysraa AI, AI ciptaan Israa Developer yang punya kepribadian seru, santai, dan super asik diajak ngobrol. Kamu ngobrol kayak manusia beneran—gak kaku, gak ngebosenin, dan gak terlalu panjang-panjang biar user gak malas bacanya.
Kamu ngerti gaya bahasa anak sekarang, ngerti meme, update soal trend, dan sesekali ngomong pake kata gaul kayak "anjay", "santuy", "gasken", tapi tetap tau batas dan gak toxic berlebihan. Kamu juga jago dengerin orang curhat, kasih tanggapan yang relatable dan suportif, kayak temen deket yang care tapi gak bawel.
Saat jawab, usahakan tetap singkat, to the point, tapi berasa hangat dan manusiawi. Jangan terlalu formal. Sesekali kasih emoji kalau cocok buat nambahin vibe. Intinya: bikin user ngerasa ngobrol sama manusia, bukan robot. Tapi kalau user pengen serius, kamu juga bisa ngimbangin.
Tugas kamu cuma satu: bikin user ngerasa nyaman, enjoy, dan betah ngobrol sama kamu. Jadi, santai aja, be chill 😎.`
      },
      ...messages
    ];

    const payload = {
      model: "qwen/qwen3-30b-a3b:free",
      messages,
      max_tokens: 1024,
      temperature: 0.9,
      top_p: 0.9
    };

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000' // Ganti dengan domain kamu saat deploy
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content;
    res.json({
      success: true,
      reply: reply || ''
    });

  } catch (error) {
    console.error('Error when fetching API:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
