import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <p className="home-date">Hardcoded Date 25th June</p>
      <h1 className="home-greeting">Welcome to LobangSG!</h1>
      <Link to="/game">
        <button className="home-start-button">Start Puzzle</button>
      </Link>
    </div>
  );
}

export default Home;
