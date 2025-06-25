
const express = require('express');
const { DateTime } = require('luxon');
const supabase = require('../supabaseClient');

const router = express.Router();

router.get('/api/puzzle/today', async (req, res) => {
  const todaySG = DateTime.now().setZone('Asia/Singapore').toISODate();

  const { data, error } = await supabase
    .from('puzzles')
    .select('*')
    .eq('publish_date', todaySG)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "No puzzle available for today." });
  }

  res.json(data);
});

module.exports = router;
