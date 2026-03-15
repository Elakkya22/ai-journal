const Journal = require("../models/Journal");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();


// Create journal entry
// Create journal entry
exports.createEntry = async (req, res) => {
  try {
    const { userId, text, ambience } = req.body;

    const entry = new Journal({
      userId,
      text,
      ambience
    });

    const savedEntry = await entry.save();

    res.json(savedEntry);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Save failed" });
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

        const positiveWords = [
            "solve","solved","complete","completed",
            "finish","finished","achieve","achieved",
            "success","finally","works","working",
            "fixed","done"
        ];

        positiveWords.forEach(word => {
            if (lowerText.includes(word)) {
                emotion = "positive";
            }
        });

        if (emotion === "neutral") {
            if (result.score > 0) emotion = "positive";
            else if (result.score < 0) emotion = "negative";
        }

        res.json({
            emotion: emotion,
            keywords: result.tokens.slice(0,5),
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