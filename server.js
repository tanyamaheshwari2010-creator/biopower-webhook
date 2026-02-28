const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: "YOUR_OPENAI_API_KEY"
});

app.post("/webhook", async (req, res) => {
  const userMessage = req.body.queryResult.queryText;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for a biopower plant. Answer in a simple, professional way."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 200
    });

    const reply = completion.choices[0].message.content;

    res.json({
      fulfillmentText: reply
    });

  } catch (error) {
    res.json({
      fulfillmentText: "Sorry, I couldn't process your request at the moment."
    });
  }
});

app.listen(3000, () => {
  console.log("Webhook server running on port 3000");
});