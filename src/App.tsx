import bgImage from "../src/images/bg-image.jpg";
import { questions } from "../src/data/questions";
import { useState } from "react";

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [score,setScore]=useState<number>(0)
  const [answered, setAnswered]=useState<boolean>(false)

  const handleAnswer = (option: string, index: number) => {
    if(answered) return
    const correct = questions[currentQuestion].correctAnswer;
    setSelectedOption(index);
    setCorrectOption(questions[currentQuestion].options.indexOf(correct));
    // console.log('clicked')
    if (option === correct) {
      setMessage("Correct Answer! 😊");
      setScore((prevScore)=>prevScore+1)
    } else {
      setMessage("Wrong Answer! 😞");
    }
    setAnswered(true)
  };

  const getOptionClass = (index: number) => {
    // console.log('worked')
    if (selectedOption === null) return "";
    if (index === correctOption) return "text-success";
    if (index === selectedOption) return "text-danger";
    return "";
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCorrectOption(null);
      setSelectedOption(null);
      setMessage("");
      setAnswered(false)
    } else {
      setMessage("Quiz Completed! 🎉");
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestion(0);
    setCorrectOption(null);
    setSelectedOption(null);
    setMessage("");
    setAnswered(false)
    setScore(0)
  };

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
        
        <p className="text-white mt-3">Question {currentQuestion+1} of {questions.length}</p>
        <div>
          <h4 className="text-white">{questions[currentQuestion].question}</h4>
          <ul className="list-group">
            {questions[currentQuestion].options.map((option, index) => (
              <li
                onClick={() => handleAnswer(option, index)}
                style={{ cursor: "pointer" }}
                className={`list-group-item bg-transparent fw-medium text-secondary ${getOptionClass(
                  index
                )}`}
                key={index}
              >
                {option}
              </li>
            ))}
          </ul>
          <div
            className={
              message == "Correct Answer! 😊"
                ? "text-success mt-1 fw-bolder"
                : "text-danger mt-1 fw-bolder"
            }
          >
            {message}
          </div>
          <div className="mt-1 mb-3">
            {selectedOption !== null &&
              currentQuestion < questions.length - 1 && (
                <button
                  onClick={handleNextQuestion}
                  className="btn border text-secondary btn-sm fw-semibold"
                >
                  Next Question
                </button>
              )}
            {selectedOption !== null &&
              currentQuestion === questions.length - 1 && (
                <div>
                  <p className="text-secondary"><strong>Your Score : {score}/{questions.length}</strong></p>
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
    </div>
  );
}

export default App;
