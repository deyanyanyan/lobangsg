const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors(), express.json());

app.get('/api/test', (req, res) => {
  res.send('✅ Backend is running locally!');
});

// Sample in-memory puzzle for now
const samplePuzzle = {
    words: [
      "Mercury","Venus","Earth","Mars",
      "Jupiter","Saturn","Uranus","Neptune",
      "Pluto","Sun","Moon","Stars",
      "Comet","Asteroid","Meteor","Rocket"
    ],
    groups: [
      ["Mercury","Venus","Earth","Mars"],
      ["Jupiter","Saturn","Uranus","Neptune"],
      ["Sun","Moon","Stars","Comet"],
      ["Asteroid","Meteor","Rocket","Pluto"]
    ]
  };
  
  app.get('/api/today', (req, res) => {
    res.json(samplePuzzle);
  });
  

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`🔌 API listening at http://localhost:${PORT}`)
);
