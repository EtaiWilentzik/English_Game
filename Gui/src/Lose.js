// WinLoseScreen.js
import React from 'react';
import loseImage from './assets/lose.png';

const WinLoseScreen = ({ goBack }) => {
  const title = 'Game over';
  return (
    <div className="center">
      <h1>{title}</h1>
      <img src={loseImage} alt={title} width="300" />
      <button onClick={goBack}>Back to Home</button>
    </div>
  );
};

export default WinLoseScreen;
