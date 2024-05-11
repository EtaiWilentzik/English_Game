// SynonymsGameScreen.js
import React, { useEffect, useState } from 'react';
import img0 from './assets/0.png';
import img1 from './assets/1.png';
import img2 from './assets/2.png';
import img3 from './assets/3.png';
import imgm1 from './assets/-1.png';
import imgm2 from './assets/-2.png';
import imgm3 from './assets/-3.png';

const SynonymsGameScreen = ({ goWin, goLose, username }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [pic, setPic] = useState(img0);
  const [helpUsed, setHelpUsed] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [numberOfGuess, setNumberOfGuess] = useState(0);
  const [numberOfCorrect, setNumberOfCorrect] = useState(0);
  const [fetching, setFetching] = useState(true); // State to control fetching phase





  const fetchData = async () => {
    try {
      const response = await fetch(`/SynonymsGame?username=${username}`);
      const data = await response.json();
      let options = data.message.slice(0, 4);
      let correctAnswer = data.message[3];
      let definition = data.message[4];
      setQuestions(prevQuestions => [
        ...prevQuestions,
        {
          options: options,
          correctAnswer: correctAnswer,
          clue: definition
        }
      ]);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    if (questions.length === 0 && fetching) { // Only fetch on initial load or when fetching
      fetchData();
      setFetching(false); // Disable fetching after initial load
    }
  }, [questions, fetching]);

  useEffect(() => {
    if (!fetching && currentQuestionIndex < questions.length) { // Only shuffle when not fetching
      const currentQuestion = questions[currentQuestionIndex];
      const options = currentQuestion.options;
      const shuffledOptions = shuffleArray(options);
      setShuffledOptions(shuffledOptions.map(e => e.replace(/_/g, " ")));
    }
  }, [currentQuestionIndex, questions, fetching]);

  const handleAnswerClick = async (selectedAnswer) => {
    setNumberOfGuess(prevState => prevState + 1);
    questions[currentQuestionIndex].correctAnswer = questions[currentQuestionIndex].correctAnswer.replace(/_/g, " ")
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setNumberOfCorrect(prevState => prevState + 1);
      setScore(score + 1);
    } else {
      alert("Incorrect! The unrelated word was: " + questions[currentQuestionIndex].correctAnswer);
      setScore(score - 1);
   
    }

    if (currentQuestionIndex === questions.length - 1 && !fetching) { // Only fetch when not fetching
      {
        await fetchData();
      }
    }

    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleHelpClick = () => {
    alert("Definition of the three synonyms: " + questions[currentQuestionIndex].clue);
    setHelpUsed(true);
  };








  useEffect(() => {
    const handleScoreChange = async () => {
      if (score === 4) {
        try {
          var result = "Win";
          let score = Math.ceil((((numberOfCorrect / numberOfGuess) * 100) / 5) * 5);
          await updateUserScore(score, result);
          goWin();
        } catch (error) {
          console.error('Error:', error);
          goWin();
        }
      }
      if (score === -4) {
        try {
          var result = "Lose";
          let score = Math.ceil((((numberOfCorrect / numberOfGuess) * 100) / 5) * 5);
          await updateUserScore(score, result);
          goLose();
        } catch (error) {
          console.error('Error:', error);
          goLose();
        }
      }
    };

    handleScoreChange();
  }, [score, goWin, goLose]);

  const updateUserScore = async (Accuracy, result) => {
    var typeOfGame = "Game2";
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
        body: JSON.stringify({ username, typeOfGame, result, formattedDate, Accuracy }),
      });

      const jsonResponse = await response.json();
      if (jsonResponse.status === "error") {
        console.error('Server error during registration:', response.message);
        return;
      }
      console.log("the json response from update user is  is ", jsonResponse.json.stringify);
      console.log(jsonResponse);
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  useEffect(() => {
    switch (score) {
      case 0:
        setPic(img0);
        break;
      case 1:
        setPic(img1);
        break;
      case 2:
        setPic(img2);
        break;
      case 3:
        setPic(img3);
        break;
      case -1:
        setPic(imgm1);
        break;
      case -2:
        setPic(imgm2);
        break;
      case -3:
        setPic(imgm3);
        break;
      default:
        // console.log("Invalid score");
    }
  }, [score]);
  const shuffleArray = (array) => {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };
  return (
      <div className="center">
        <h1>Synonyms Game</h1>
        <p>Score: {score}</p>
        {!helpUsed && (
            <button onClick={handleHelpClick} disabled={helpUsed}>
              Help
            </button>
        )}
        <div>
          <img src={pic} alt="Question" width="300" />
          <p>There are three synonyms and an unrelated word. Choose the unrelated word.</p>
        </div>
        <div>
          {shuffledOptions.map((option, index) => (
              <button key={index} onClick={() => handleAnswerClick(option)}>
                {option}
              </button>
          ))}
        </div>
      </div>
  );
};
export default SynonymsGameScreen







