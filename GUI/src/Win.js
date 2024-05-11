// WinLoseScreen.js
import React from 'react';
import winImage from './assets/win.png';

const WinLoseScreen = ({ goBack }) => {
  const title = 'Congratulations, you won!';

  return (
    <div className="center">
      <h1>{title}</h1>
      <img src={winImage} alt={title} width="100" />
      <button onClick={goBack}>Back to Home</button>
    </div>
  );
};

export default WinLoseScreen;





















