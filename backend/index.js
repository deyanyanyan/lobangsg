const express = require('express');
const cors = require('cors');
const puzzles = require('./puzzles');
const app = express();

// Correct Middleware Setup
app.use(cors());
app.use(express.json());

const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

app.get('/api/today', (req, res) => {
  console.log("✅✅✅ GET /api/today WAS CALLED! SERVER IS USING THE NEW CODE! ✅✅✅");
  const dayIndex = getDayOfYear();
  const puzzleIndex = dayIndex % puzzles.length;
  const todaysPuzzle = puzzles[puzzleIndex];
  res.json({ words: todaysPuzzle.words });
});

// The verified /api/check route
app.post('/api/check', (req, res) => {
    console.log("--- Submission received by /api/check route ---");
    const { selection } = req.body;

    if (!selection || !Array.isArray(selection) || selection.length !== 4) {
        console.error("Validation failed:", selection);
        return res.status(400).json({ error: 'Selection must contain 4 words.' });
    }

    const dayIndex = getDayOfYear();
    const puzzleIndex = dayIndex % puzzles.length;
    const todaysPuzzle = puzzles[puzzleIndex];

    let isCorrect = false;
    let correctGroup = null;

    for (const groupName in todaysPuzzle.groups) {
        const groupWords = todaysPuzzle.groups[groupName];
        if (JSON.stringify([...selection].sort()) === JSON.stringify([...groupWords].sort())) {
            isCorrect = true;
            correctGroup = { name: groupName, words: groupWords };
            break;
        }
    }
    console.log("Check complete. Sending response:", { isCorrect });
    res.json({ isCorrect, group: correctGroup });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🔌 API listening at http://localhost:${PORT}`)
);