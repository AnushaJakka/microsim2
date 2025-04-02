import React, { useState } from 'react';

const MCQComponent = ({ questions, onComplete }) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  // Calculate score if questions are submitted
  const score = submitted ? 
    questions.reduce((total, q, index) => {
      return total + (userAnswers[index] === q.correctAnswer ? 1 : 0);
    }, 0) : 0;
  
  // Handle answer selection
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    if (submitted) return; // Prevent changing answers after submission
    
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answerIndex
    });
  };
  
  // Toggle explanation visibility
  const toggleExplanation = (questionIndex) => {
    setShowExplanations({
      ...showExplanations,
      [questionIndex]: !showExplanations[questionIndex]
    });
  };
  
  // Submit answers
  const handleSubmit = () => {
    setSubmitted(true);
    if (onComplete) {
      onComplete({
        score,
        total: questions.length,
        answers: userAnswers
      });
    }
  };
  
  // Reset quiz
  const handleReset = () => {
    setUserAnswers({});
    setShowExplanations({});
    setSubmitted(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Multiple Choice Questions</h3>
        {submitted && (
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg">
            Score: {score}/{questions.length}
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <div 
            key={qIndex} 
            className={`border rounded-lg p-4 mb-4 ${
              submitted 
                ? userAnswers[qIndex] === question.correctAnswer 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <p className="font-medium mb-3">{qIndex + 1}. {question.question}</p>
            <div className="space-y-2">
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center">
                  <input
                    type="radio"
                    id={`q${qIndex}-opt${oIndex}`}
                    name={`question-${qIndex}`}
                    className="mr-2"
                    checked={userAnswers[qIndex] === oIndex}
                    onChange={() => handleAnswerSelect(qIndex, oIndex)}
                    disabled={submitted}
                  />
                  <label 
                    htmlFor={`q${qIndex}-opt${oIndex}`}
                    className={`
                      ${submitted && oIndex === question.correctAnswer ? 'font-bold text-green-700' : ''}
                      ${submitted && userAnswers[qIndex] === oIndex && oIndex !== question.correctAnswer ? 'line-through text-red-700' : ''}
                    `}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
            
            {submitted && (
              <button 
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                onClick={() => toggleExplanation(qIndex)}
              >
                {showExplanations[qIndex] ? 'Hide Explanation' : 'Show Explanation'}
              </button>
            )}
            
            {submitted && showExplanations[qIndex] && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
                <p className="font-medium text-blue-900">Explanation:</p>
                <p className="text-blue-800">{question.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {!submitted ? (
        <button
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={handleSubmit}
          disabled={Object.keys(userAnswers).length !== questions.length}
        >
          Submit Answers
        </button>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            onClick={handleReset}
          >
            Reset Quiz
          </button>
          <button
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => {
              // In a real app, you might navigate to the next lesson
              // or save the user's progress
              if (onComplete) {
                onComplete({
                  score,
                  total: questions.length,
                  answers: userAnswers,
                  completed: true
                });
              }
            }}
          >
            Continue Learning
          </button>
        </div>
      )}
      
      {/* Progress indicator for answered questions */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Object.keys(userAnswers).length}/{questions.length} Questions Answered</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{width: `${(Object.keys(userAnswers).length / questions.length) * 100}%`}}
          />
        </div>
      </div>
      
      {/* Feedback for remaining questions when not all are answered */}
      {!submitted && Object.keys(userAnswers).length !== questions.length && (
        <div className="mt-3 text-amber-600 text-sm">
          Please answer all questions before submitting.
        </div>
      )}
    </div>
  );
};

export default MCQComponent;