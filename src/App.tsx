import bgImage from "../src/images/bg-image.jpg";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface APIQuestion {
  question: string;
  incorrect_answers: string[];
  correct_answer: string;
}
interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

function App() {
  const [numOfQuestions, setNumOfQuestions] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentquestion, setCurrentQuestion] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctOption, setCorrectOption] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [score, setScore] = useState<number>(0);

  const fetchQuestions = () => {
    if (numOfQuestions <= 0 || numOfQuestions > 50) {
      alert("Questions number must be from 1 to 50");
      return;
    }

    setLoading(true);
    const apiURL = `https://opentdb.com/api.php?amount=${numOfQuestions}&category=9&difficulty=${difficulty}&type=multiple`;
    fetch(apiURL)
      .then((response) => response.json())
      .then((data) => {
        const formattedQuestion = data.results.map((q: APIQuestion) => ({
          question: q.question,
          options: [...q.incorrect_answers, q.correct_answer].sort(
            () => Math.random() - 0.5
          ),
          correctAnswer: q.correct_answer,
        }));
        setQuizStarted(true);
        setQuestions(formattedQuestion);
      })
      .finally(() => setLoading(false));
  };

  const handleAnswer = (option: string) => {
    if (selectedOption !== null) return;
    setCorrectOption(questions[currentquestion].correctAnswer);
    setSelectedOption(option);
    if (option === questions[currentquestion].correctAnswer) {
      setMessage("Correct Answer! 😊");
      setScore((prev) => prev + 1);
    } else {
      setMessage("Wrong Answer! 😞");
    }
  };

  const getOptionClass = (option: string) => {
    if (selectedOption === null) return "";
    if (option === correctOption) return "text-success";
    if (option === selectedOption) return "text-danger";
  };

  const handleNextQuestion = () => {
    if (currentquestion < questions.length - 1) {
      setCurrentQuestion(currentquestion + 1);
      setCorrectOption(null);
      setSelectedOption(null);
      setMessage("");
    }
  };

  const handlePlayAgain = () => {
    setQuizStarted(false);
    setQuestions([]);
    setScore(0);
    setCorrectOption(null);
    setSelectedOption(null);
    setMessage("");
    setCurrentQuestion(0);
    setNumOfQuestions(0);
    setDifficulty("easy");
  };

  function decodeEntities(encodedString: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = encodedString;
    return txt.value;
  }

  return (
    <div
      className=""
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <br />

      <h1
        className="text-center text-primary fw-bolder"
        style={{ fontFamily: '"Macondo", serif' }}
      >
        Quiz App
      </h1>
      <div
        style={{
          backdropFilter: "blur(5px)",
          background: "rgba(59, 59, 59, 0.1)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
        className="container w-50 rounded text-center"
      >
        {loading ? (
          <div>
            <h4 className="text-white">Loading Questions...</h4>
          </div>
        ) : !quizStarted ? (
          <div>
            <h3 className="mt-3 text-white">Quiz Settings</h3>
            <label htmlFor="" className="text-white mt-2">
              Number of questions
            </label>
            <br />
            <input
              onChange={(e) => setNumOfQuestions(Number(e.target.value))}
              value={numOfQuestions}
              className="mt-1 bg-transparent d-inline-flex focus-ring focus-ring-info py-1 px-2 text-decoration-none border rounded-2 rounded text-white"
              type="tel"
            />
            <br />
            <label htmlFor="" className="text-white mt-2">
              Difficulty Type
            </label>
            <br />
            <select
              className="mt-1 d-inline-flex focus-ring focus-ring-info py-1 px-2 text-decoration-none border rounded-2 bg-transparent text-white rounded border"
              onChange={(e) => setDifficulty(e.target.value)}
              value={difficulty}
              name=""
              id=""
            >
              <option className="text-black" value="easy">
                Easy
              </option>
              <option className="text-black" value="medium">
                Medium
              </option>
              <option className="text-black" value="hard">
                Hard
              </option>
            </select>
            <br />
            <button
              className="mt-3 mb-3 btn border border-success btn-md text-success fw-bold"
              onClick={fetchQuestions}
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <div>
            <p className="text-white mt-3">
              Question {currentquestion + 1} of {questions.length}
            </p>
            <div>
              <h4 className="text-white">
                {decodeEntities(questions[currentquestion].question)}
              </h4>
              <ul className="list-group">
                {questions[currentquestion].options.map((option, index) => (
                  <li
                    onClick={() => handleAnswer(option)}
                    className={`text-secondary fw-medium list-group-item bg-transparent ${getOptionClass(
                      option
                    )}`}
                    key={index}
                    style={{ cursor: "pointer" }}
                  >
                    {decodeEntities(option)}
                  </li>
                ))}
              </ul>
              <div
                className={
                  message === "Correct Answer! 😊"
                    ? "text-success fw-bolder mt-1"
                    : "text-danger fw-bolder mt-1"
                }
              >
                {message}
              </div>
              <div className="mt-1 mb-3">
                {selectedOption && currentquestion !== questions.length - 1 && (
                  <button
                    onClick={handleNextQuestion}
                    className="btn border text-secondary btn-sm fw-semibold"
                  >
                    Next Question
                  </button>
                )}
                {selectedOption && currentquestion === questions.length - 1 && (
                  <div>
                    <p className="text-secondary">
                      <strong>
                        Score {score}/{questions.length}
                      </strong>
                    </p>
                    <p className="fw-semibold text-primary">Quiz Completed</p>
                    <button
                      onClick={handlePlayAgain}
                      className="btn border text-warning btn-sm fw-semibold"
                    >
                      Play Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
