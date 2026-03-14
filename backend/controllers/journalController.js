const Journal = require("../models/Journal");
const Sentiment = require("sentiment");
const axios = require("axios");
const sentiment = new Sentiment();


// Create journal entry
exports.analyzeEntry = async (req, res) => {
  try {

    const { text } = req.body;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    const result = response.data[0][0];

    let emotion = "neutral";

    if (result.label === "LABEL_2") emotion = "positive";
    if (result.label === "LABEL_0") emotion = "negative";

    res.json({
      emotion: emotion,
      confidence: result.score
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Emotion analysis failed" });
  }
};


// Get all entries
exports.getEntries = async (req, res) => {
    try {
        const entries = await Journal.find({ userId: req.params.userId });
        res.json(entries);
    } catch (error) {
        res.status(500).json(error);
    }
};


// Analyze emotion
exports.analyzeEntry = async (req, res) => {
    try {

        const { text } = req.body;

        const result = sentiment.analyze(text);

        let emotion = "neutral";
        const lowerText = text.toLowerCase();

        // detect positive achievement words
        const positiveWords = [
            "solve",
            "solved",
            "complete",
            "completed",
            "finish",
            "finished",
            "achieve",
            "achieved",
            "success",
            "finally",
            "works",
            "working",
            "fixed",
            "done"
        ];

        positiveWords.forEach(word => {
            if (lowerText.includes(word)) {
                emotion = "positive";
            }
        });

        // fallback sentiment score
        if (emotion === "neutral") {
            if (result.score > 0) emotion = "positive";
            else if (result.score < 0) emotion = "negative";
        }

        res.json({
            emotion: emotion,
            keywords: result.tokens.slice(0, 5),
            summary: `Overall sentiment score: ${result.score}`
        });

    } catch (error) {
        res.status(500).json(error);
    }
};


// Insights
exports.getInsights = async (req, res) => {
    try {

        const entries = await Journal.find({ userId: req.params.userId });

        res.json({
            totalEntries: entries.length,
            topEmotion: "neutral",
            mostUsedAmbience: "forest"
        });

    } catch (error) {
        res.status(500).json(error);
    }
};