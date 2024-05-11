// DefinitionGameScreen.js
import React, { useState, useEffect } from 'react';
import './DefinitionGame.css'; // Import the CSS file
import img0 from './assets/0.png';
import img1 from './assets/1.png';
import img2 from './assets/2.png';
import img3 from './assets/3.png';
import imgm1 from './assets/-1.png';
import imgm2 from './assets/-2.png';
import imgm3 from './assets/-3.png';


const DefinitionGame = ({ goWin ,goLose,username }) => {

  // const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [pic, setpic] = useState(img0);
  const [helpUsed, setHelpUsed] = useState(false);
  const [guessedWord, setGuessedWord] = useState('');
  const [guessedWordDisplay, setGuessedWordDisplay] = useState('');

  const [definition, setDefinition] = useState('');
  const [userInput, setUserInput] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());

  const [numberOfGuess, setNumberOfGuess] = useState(0);
  const [numberOfCorrect, setNumberOfCorrect] = useState(0);
  const [currentWord, setCurrentWord] = useState({
    definition: '',
    word: '',
    exampleSentence: ''
  });






/// this is the fucntion to create a new question for the definiton game .
  useEffect(() => {
    const DefinitionGame = async () => {
      try {
        while(1){
        const response = await fetch(`/definitionGame?username=${username}`);
        const jsonData = await response.json();
        const type=jsonData["message"][3]
        let realType;
        if (type==="n"){
          realType="noun"
        }else if (type==="v"){
          realType="verb"
        }
        else if (type==="r"){
          realType="adverb"
        }
        else{
          realType="adjective"
        }

        setCurrentWord({
          definition: jsonData["message"][1],
          word: jsonData["message"][2],
          exampleSentence: jsonData["message"][0]+"\n the length of the word is "+ jsonData["message"][4]+" \nand the word is "+realType
        });
        if (!(jsonData["message"][2].includes('_'))){
          break;
        }
      }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    DefinitionGame()
  }, []); // Empty dependency array to run only once


  useEffect(() => {
    setDefinition(currentWord.definition);
    setGuessedWord('_'.repeat(currentWord.word.length));
    setGuessedWordDisplay('_ '.repeat(currentWord.word.length));

    setGuessedLetters(new Set());
  }, [currentWord]);



  const  handleSubmit = async () => {

    const word = currentWord.word.toLowerCase();
    if (userInput === word) {
      const result = "Win";
      const nextNumberOfGuess=numberOfGuess+1
      setNumberOfGuess(nextNumberOfGuess)
      const nextNumberOfCorrect=numberOfCorrect+1
      setNumberOfCorrect(nextNumberOfCorrect)

        // Player wins
      let score =Math.ceil((((nextNumberOfCorrect/nextNumberOfGuess)*100) / 5) * 5);
      console.log("the score is  in if userInput === word " +score)
        await updateUserScore(score,result)
        console.log('Player wins!');
        goWin();
      }


    if (guessedLetters.has(userInput)) {
      // Disqualify if the letter or substring has already been guessed
      console.log('You already guessed this letter or substring.');
      return;
    }

    const nextNumberOfGuess=numberOfGuess+1
    setNumberOfGuess(nextNumberOfGuess);

    if (word.includes(userInput)) {
      const nextNumberOfCorrect=numberOfCorrect+1
      setNumberOfCorrect(nextNumberOfCorrect)
      // Correct guess, update the guessed word and guessed letters
      const updatedWord = guessedWord
        .split('')
        .map((char, index) => {
          if (word[index] === userInput || char === word[index]) {
            return word[index];
          } else {
            return char === '_' ? '_' : word[index];
          }
        })
        .join('');

      setGuessedWord(updatedWord);
      setGuessedWordDisplay(updatedWord.split("").join(" "))

      setGuessedLetters(new Set([...guessedLetters, userInput]));

      // Check if the entire word is guessed
      if (updatedWord === word) {
        // Player wins
        let score =Math.ceil((((nextNumberOfCorrect/nextNumberOfGuess)*100) / 5) * 5);
        console.log("the value in if updatedWord === word  " + score);
        const result="Win"
        await updateUserScore(score,result)

        console.log('Player wins!');
        goWin();
      } else {
        // Update the score only if not already guessed correctly
        if(score < 4){
        setScore(score + 1);
        }
      }
    } else {
      // Incorrect guess, decrement the score
      setScore(score - 1);

      // Check if the player has reached -4 points
      if (score === -3) {
        alert("Game Over! The correct answer was: " + currentWord.word);
        // setCurrentWordIndex(0);
        let score =Math.ceil((((numberOfCorrect/nextNumberOfGuess)*100) / 5) * 5);

          console.log(" the score in if score === -3   " + score)
        const result="Lose"
        // Player loses
        await updateUserScore(score,result)
        // Add any additional logic or navigate to a lose screen
        console.log('Player loses!');
        goLose();
      }
    }

    // Clear the input field after processing
    setUserInput('');
  };
//this





  //get the score from the user.
  const updateUserScore= async (Accuracy,result)=> {
    console.log("im in the update user  score")

    var typeOfGame="Game1"

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    try {
      const response = await fetch("/updateScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username,typeOfGame,result,formattedDate,Accuracy}),
      });

      const jsonResponse = await response.json();
      if (jsonResponse.status === "error") {
        console.error('Server error during registration:', response.message);
        return;
      }
      console.log("the json response from update user is  is ",jsonResponse.json.stringify)
      console.log(jsonResponse);



    } catch (error) {
    console.error('Error during registration:', error);
  }

  }

















  useEffect(() => {
    switch (score) {
      case 0:
        setpic(img0);
        break;
      case 1:
        setpic(img1);
        break;
      case 2:
        setpic(img2);
        break;
      case 3:
        setpic(img3);
        break;
      case -1:
        setpic(imgm1);
        break;
      case -2:
        setpic(imgm2);
        break;
      case -3:
        setpic(imgm3);
        break;
      default:
        console.log("Invalid score");
    }
  }, [score]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value.toLowerCase());
  };
  const handleHelpClick = () => {
    // Display example sentence in alert
    const maskedWord = '*'.repeat(currentWord.word.length);
    // Replace every occurrence of currentWord.word with maskedWord
    const replacedSentence = currentWord.exampleSentence.replaceAll(currentWord.word, maskedWord);
    // Display example sentence in alert
    alert("Example sentence: " + replacedSentence);
    // Set helpUsed to true to disable the button
    setHelpUsed(true);
  };

  return (
    <div className="center">
      <h1>Definition Game</h1>
      {/* Display Score */}
      <p>
        Score: {score}
        {!helpUsed && (
          <button onClick={handleHelpClick} disabled={helpUsed}>
            Help
          </button>
        )}
      </p>
      {/*<p>{question}</p>*/}

      {/* Display Definition */}
      <img src={pic} alt="Question" width="300" />
      <p>{definition}</p>
      {/* Display Guessed Word */}
      <p className="guessed-word">{guessedWordDisplay}</p>      {/* Input for Guessing Letters */}
      {/* Input for Guessing Letters */}
      <div className="input-container">
        <input type="text" placeholder="Enter a letter" value={userInput} onChange={handleInputChange} />
        {/* Submit Button */}
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};


export default DefinitionGame;
