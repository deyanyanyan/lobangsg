import { useEffect, useState } from 'react';

function App() {
  const [puzzle, setPuzzle] = useState(null);

  useEffect(() => {
    fetch('/api/today')
      .then(res => res.json())
      .then(setPuzzle)
      .catch(console.error);
  }, []);

  if (!puzzle) {
    return <h2>Loading today's puzzle…</h2>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Daily Connections Puzzle</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          maxWidth: '400px',
          margin: 'auto'
        }}
      >
        {puzzle.words.map((word, idx) => (
          <div
            key={idx}
            style={{
              border: '1px solid #444',
              padding: '10px',
              textAlign: 'center',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
