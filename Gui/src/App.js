import React, { useState} from 'react';
import './App.css';
import winImage from './assets/win.png';
import StatisticsScreen from './StatisticsScreen';
import SynonymsGameScreen from './SynonymsGameScreen'; 
import DefinitionGameScreen from './DefinitionGame'; 
import Win from './Win'; 
import Lose from './Lose';

// First Screen Component
const FirstScreen = ({ goToLogin, goToRegistration, showGameInfo }) => (
  <div className="center">
    <h1>Shimi The English Monkey</h1>
    <h2>Have fun & Learn English</h2>
    <br></br>
    <img src={winImage} alt="Game"/>
    <br></br>
    <br></br>
    <div>
      <button onClick={goToLogin}>Connect</button>
      <button onClick={goToRegistration}>Registration</button>
      {/* <button onClick={showGameInfo}>Game Info</button> */}
    </div>
  </div>
);
// Second Screen Component













// the log in works fine. the register is not
const LoginScreen = ({ goBack, goToGame, updateUsername }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


    const handleSubmit = async () => {
        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const jsonResponse = await response.json();

            return  jsonResponse

        } catch (error) {
            console.error('Fetch error:', error);
            return '1'; // Handle the error and return an appropriate value
        }
    };



    const handleLogin = async() => {
    if (!username.trim() || !password.trim()) {
        setError((prev) => 'fill all the inputs');
      return;
      //check that user is in db, password correct
    }

      try {

          // Await the completion of handleSubmit
         let response =await  handleSubmit();

          if (response.status === "error") {
              setError(response.message);
              console.error('Server error during registration:', response.message);
              return;
          }

         setError('');
          updateUsername(username);
          // Navigate to the game screen
          goToGame();
      } catch (error) {
          console.error('Error during registration:', error);
      }

  };

    return (
    <div className="center">
      <h1>Login</h1>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <button onClick={handleLogin}>Enter</button>
        <button onClick={goBack}>Back</button>
      </div>
    </div>
  );
};


const RegistrationScreen = ({ goBack, goToGame, updateUsername}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [error, setError] = useState('');




    const handleSubmit = async () => {
        try {
            const response = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, selectedClass, selectedLevel }),
            });

            const jsonResponse = await response.json();


            return jsonResponse; // Return the entire response object
        } catch (error) {
            console.error('Fetch error:', error);
            throw new Error('Registration failed. Please try again.'); // Throw an error for the calling function to handle
        }
    };

    const handleRegistration = async () => {
        // Check if registration fields are filled
        if (!username.trim() || !password.trim() || !selectedClass || !selectedLevel) {
            setError('Please fill in all registration fields.');
            return;
        }

        try {
            const response = await handleSubmit();


            if (response.status === "error") {
                setError(response.message);
                console.error('Server error during registration:', response.message);
                return;
            }

            // If no errors, update state and navigate
            setError('');
            updateUsername(username);
            goToGame();
        } catch (error) {
            console.error('Error during registration:', error);

            // Set the error state
            setError(error.message || 'Registration failed. Please try again.');
        }
    };



    return (
    <div className="center">
      <h1>Registration</h1>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
        <option value="">Select Class</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
      </select>
      <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
        <option value="">Select Level</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <button onClick={handleRegistration}>Register</button>
        <button onClick={goBack}>Back</button>
      </div>
    </div>
  );
};









// Fourth Screen Component
const GameScreen = ({ username, logout ,Statistics, goToSynonymsGame,goToDefinitionGame}) => (
  <div className="center">
    <h1>{`Welcome, ${username}`}</h1>
    <br></br>
    <img src={winImage} alt="Game" />
    <br></br>
    <div>
      <button onClick={goToDefinitionGame}>Definition Game</button>
      <button onClick={goToSynonymsGame}>Synonyms Game</button>
      <button onClick={Statistics}>Statistics</button>
      <button onClick={logout}>Logout</button>
    </div>
  </div>
);

// Main App Component
const App = () => {
  // State to manage the current screen
  const [currentScreen, setCurrentScreen] = useState('first');
  const [username, setUsername] = useState('user1');

  // Function to switch to the Login screen
  const goToLogin = () => setCurrentScreen('login');

  // Function to switch to the Registration screen
  const goToRegistration = () => setCurrentScreen('registration');

  // Function to show the game info (you can implement this)
  const showGameInfo = () => {
    // Implement your logic to show game info
    console.log('Game Info');
  };

  // Function to go back to the first screen
  const goBack = () => setCurrentScreen('first');
  const goBackToGame = () => setCurrentScreen('game');
  const goToSynonymsGame = () => setCurrentScreen('synonymsGame');
  const goToDefinitionGame = () => setCurrentScreen('definitionGame');
  const goToWinScreen = () => setCurrentScreen('win');
  const goToLoseScreen = () => setCurrentScreen('lose');

  // Function to go to the Game screen
  const goToGame = () => setCurrentScreen('game');
  const handleStatistics = () => setCurrentScreen('statistics');

  const updateUsername = (username1) => {
    setUsername(username1);
  };

  // Function to handle logout
  const handleLogout = () => {
    // Implement your logout logic
    setUsername('');
    setCurrentScreen('first');
  };

  // Render the current screen based on the state
  return (
    <div>
      {currentScreen === 'first' && (
        <FirstScreen goToLogin={goToLogin} goToRegistration={goToRegistration} showGameInfo={showGameInfo} />
      )}
      {currentScreen === 'login' && <LoginScreen goBack={goBack} goToGame={goToGame} updateUsername={updateUsername}/>}
      {currentScreen === 'registration' && <RegistrationScreen goBack={goBack} goToGame={goToGame} updateUsername={updateUsername}/>}
      {currentScreen === 'game' && <GameScreen username={username} logout={handleLogout} Statistics={handleStatistics} goToSynonymsGame={goToSynonymsGame} goToDefinitionGame={goToDefinitionGame}/>}
      {currentScreen === 'statistics' && <StatisticsScreen username={username} goBack={goBackToGame} />}
      {currentScreen === 'synonymsGame' && <SynonymsGameScreen goWin={goToWinScreen} goLose={goToLoseScreen}  username={username}   />}
      {currentScreen === 'definitionGame' && <DefinitionGameScreen goWin={goToWinScreen} goLose={goToLoseScreen}  username={username} />}
      {currentScreen === 'win' && <Win goBack={goBackToGame} />}
      {currentScreen === 'lose' && <Lose goBack={goBackToGame} />}

    </div>
  );
};

export default App;
