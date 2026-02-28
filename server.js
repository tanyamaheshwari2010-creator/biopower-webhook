const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/webhook", async (req, res) => {
  console.log("✅ Webhook was called!");

  const userMessage = req.body.queryResult.queryText;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant for a biopower plant. Answer in a simple, professional way for non-technical users."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 200
    });

    const reply = completion.choices[0].message.content;

    console.log("✅ OpenAI reply generated");

    res.json({
      fulfillmentText: reply
    });

  } catch (error) {
    console.error("🔥 OpenAI Error:", error);

    res.json({
      fulfillmentText:
        "Sorry, I couldn't process your request at the moment."
    });
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});