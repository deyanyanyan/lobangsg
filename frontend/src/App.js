import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const InstructionsModal = ({ onStartGame }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>How to Play</h2>
      <ul>
        <li>Find groups of four words that share a common theme.</li>
        <li>Select four words and press 'Submit'.</li>
        <li>Correct groups earn points. Fewer mistakes mean a bigger bonus!</li>
        <li>Win every day to build up your streak.</li>
      </ul>
      <button className="play-button" onClick={onStartGame}>Let's Go!</button>
    </div>
  </div>
);

const HomeScreen = ({ onPlay, score, streak }) => (
  <div className="home-screen">
    <GameStats score={score} streak={streak} />
    <h1>LobangSG</h1>
    <p className="tagline">Got Lobang or not ah?</p>
    <button className="play-button" onClick={onPlay}>Play Today's Puzzle</button>
  </div>
);

const GameStats = ({ score, streak }) => (
  <div className="game-stats">
    <div className="stat-item"><span>SCORE</span><div>⭐ {score}</div></div>
    <div className="stat-item"><span>STREAK</span><div>🔥 {streak}</div></div>
  </div>
);

function App() {
  const [gameState, setGameState] = useState('home');
  const [gridWords, setGridWords] = useState([]);
  const [groupLabels, setGroupLabels] = useState([]);
  const [solvedGroups, setSolvedGroups] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [mistakesLeft, setMistakesLeft] = useState(4);
  const [message, setMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [alreadyPlayedToday, setAlreadyPlayedToday] = useState(false);
  const [countdown, setCountdown] = useState('');


  useEffect(() => {
  const savedData = JSON.parse(localStorage.getItem('gridConnectData'));
  const today = new Date().toDateString();

  if (savedData) {
    setScore(savedData.score || 0);
    setStreak(savedData.streak || 0);

    if (savedData.lastPlayed === today) {
      setAlreadyPlayedToday(true);
      return startCountdownTimer(); 
    }
  }
  return undefined;
}, []);


    const startCountdownTimer = () => {
    const updateCountdown = () => {
    const now = new Date();
    const midnightSG = new Date();
    midnightSG.setHours(24, 0, 0, 0);
    const diff = midnightSG - now;

    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

    setCountdown(`${hours}:${minutes}:${seconds}`);
  };

  updateCountdown();
  const intervalId = setInterval(updateCountdown, 1000);
  return () => clearInterval(intervalId);
};




  const saveData = (newScore, newStreak, lastPlayedDate) => {
    const dataToSave = { score: newScore, streak: newStreak, lastPlayed: lastPlayedDate };
    localStorage.setItem('gridConnectData', JSON.stringify(dataToSave));
  };

  const fetchPuzzle = useCallback(async () => {
    setIsLoading(true);
    setSolvedGroups([]);
    setSelectedWords([]);
    setMistakesLeft(4);
    setIsGameOver(false);
    setMessage('Eh bro, one lobang got 4 words.');
    try {
      const response = await axios.get(`${API_URL}/api/today`);
      setGridWords(shuffleArray([...response.data.words]));
      setGroupLabels(response.data.solution || []);
    } catch (error) {
      console.error("Error fetching puzzle:", error);
      setMessage('Error connecting to the server!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleStartGame = () => {
    setGameState('playing');
    fetchPuzzle();
  };

  const calculatePoints = (mistakes) => {
    return [0, 5, 10, 15, 20][mistakes];
  };

  const handleWin = () => {
    const pointsEarned = 10 + calculatePoints(mistakesLeft);
    const newScore = score + pointsEarned;
    const today = new Date().toDateString();
    const savedData = JSON.parse(localStorage.getItem('gridConnectData')) || {};
    const lastPlayed = savedData.lastPlayed;

    let newStreak = streak;
    if (lastPlayed !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      newStreak = lastPlayed === yesterday.toDateString() ? streak + 1 : 1;
    }

    setMessage(`You win! +${pointsEarned} points!`);
    setScore(newScore);
    setStreak(newStreak);
    saveData(newScore, newStreak, today);
    setIsGameOver(true);
  };

  const handleWordClick = (word) => {
    if (isGameOver) return;
    setSelectedWords((prev) =>
      prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]
    );
  };

const handleSubmit = async () => {
  if (selectedWords.length !== 4) return;

  try {
    const response = await axios.post(`${API_URL}/api/check`, { selection: selectedWords });
    const { isCorrect, group } = response.data;

    if (isCorrect && group?.words) {
      const labeledGroup = group;

      setSolvedGroups(prev => [...prev, labeledGroup]);
      setGridWords(prev => prev.filter(w => !selectedWords.includes(w)));
      setSelectedWords([]);

      if (solvedGroups.length + 1 === 4) {
        handleWin();
      } else {
        setMessage("Steady bom pi pi.");
      }
    } else {
      const newMistakesLeft = mistakesLeft - 1;
      setMistakesLeft(newMistakesLeft);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setSelectedWords([]);

      if (newMistakesLeft === 0) {
        setMessage("Aiyoh, game over lah.");
        setIsGameOver(true);
      } else {
        setMessage("Wrong lah.");
      }
    }
  } catch (error) {
    console.error("Error checking submission:", error);
    setMessage("Error submitting guess. Check the server.");
  }
};


  const handleDeselectAll = () => setSelectedWords([]);
  const handleShuffle = () => setGridWords(prev => shuffleArray([...prev]));
  const handlePlayAgain = () => setGameState('home');

  const renderContent = () => {
    if (alreadyPlayedToday) {
  return (
    <div className="already-played-screen">
      <h1>Relax ah.</h1>
      <p>You finish today's puzzle already!</p>
      <p>Come back in: <strong>{countdown}</strong></p>
    </div>
  );
} 

    switch (gameState) {
      case 'instructions':
        return <InstructionsModal onStartGame={handleStartGame} />;
      case 'playing':
        if (isLoading) return <div className="loading-screen"><h1>LobangSG</h1><p>Loading...</p></div>;
        return (
          <>
            <header>
              <GameStats score={score} streak={streak} />
              <h1>LobangSG</h1>
              <p>{message}</p>
            </header>
            <main>
              <div className="solved-groups-container">
                {solvedGroups.map((group, index) => (
                  <div key={group.name} className="solved-group" style={{ backgroundColor: `hsl(${index * 60 + 210}, 100%, 85%)` }}>
                    <strong>{group.name}</strong>
                    <p>{group.words.join(', ')}</p>
                  </div>
                ))}
              </div>
              <div className={`word-grid ${isShaking ? 'shake' : ''}`}>
                {gridWords.map(word => (
                  <button key={word} className={`word-tile ${selectedWords.includes(word) ? 'selected' : ''}`} onClick={() => handleWordClick(word)} disabled={isGameOver}>
                    {word}
                  </button>
                ))}
              </div>
              <div className="mistakes-container">
                <span>Mistakes remaining:</span>
                <div className="mistake-dots">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className={`dot ${i >= mistakesLeft ? 'lost' : ''}`}></span>
                  ))}
                </div>
              </div>
              {!isGameOver ? (
                <div className="action-buttons">
                  <button onClick={handleShuffle}>Shuffle</button>
                  <button onClick={handleDeselectAll} disabled={selectedWords.length === 0}>Deselect All</button>
                  <button onClick={handleSubmit} disabled={selectedWords.length !== 4} className="submit-button">Submit</button>
                </div>
              ) : (
                <div className="action-buttons">
                  <button onClick={handlePlayAgain}>Back to Home</button>
                </div>
              )}
            </main>
          </>
        );
      case 'home':
      default:
        return <HomeScreen onPlay={() => setGameState('instructions')} score={score} streak={streak} />;
    }
  };

  return <div className="App">{renderContent()}</div>;
}

export default App;
