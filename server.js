require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
    res.send("Omni AI server is running 🚀");
});

// 🤖 Chat route
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    {
                        role: "system",
                        content: "You are Omni AI, a helpful assistant and tutor. Explain clearly and simply."
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ]
            })
        });

        const data = await response.json();

        if (!data.choices || !data.choices[0]) {
            return res.status(500).json({
                error: "Invalid response from AI",
                raw: data
            });
        }

        res.json({
            reply: data.choices[0].message.content
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});