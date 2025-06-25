const express = require('express');
const cors = require('cors');
const app = express();
const { DateTime } = require('luxon');
const supabase = require('./supabaseClient');


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

app.get('/api/today', async (req, res) => {
  const todaySG = DateTime.now().setZone('Asia/Singapore').toISODate();

  const { data, error } = await supabase
    .from('puzzles')
    .select('*')
    .eq('publish_date', todaySG)
    .single();

  if (error || !data) {
    console.error("No puzzle found for today:", error);
    return res.status(404).json({ error: "No puzzle available." });
  }

  console.log("✅ Puzzle found:", data.title);
  res.json({
    title: data.title,
    words: data.groups.flat(),
    solution: data.solution
  });
});

// The verified /api/check route
app.post('/api/check', async (req, res) => {
  console.log("--- Submission received by /api/check route ---");
  const { selection } = req.body;

  if (!selection || !Array.isArray(selection) || selection.length !== 4) {
    console.error("Validation failed:", selection);
    return res.status(400).json({ error: 'Selection must contain 4 words.' });
  }

  const todaySG = DateTime.now().setZone('Asia/Singapore').toISODate();
  const { data: todaysPuzzle, error } = await supabase
    .from('puzzles')
    .select('*')
    .eq('publish_date', todaySG)
    .single();

  if (error || !todaysPuzzle) {
    console.error("Failed to load puzzle for check:", error);
    return res.status(404).json({ error: 'Today\'s puzzle not found.' });
  }

  let isCorrect = false;
  let correctGroup = null;

  // Validate against groups from DB
  const groupLabels = todaysPuzzle.solution;
  const groupList = todaysPuzzle.groups;

  for (let i = 0; i < groupList.length; i++) {
    const groupWords = groupList[i];
    if (
      JSON.stringify([...selection].sort()) ===
      JSON.stringify([...groupWords].sort())
    ) {
      isCorrect = true;
      correctGroup = { name: groupLabels[i], words: groupWords };
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

