import React from 'react';
import { Check, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuizResults = () => {
  const navigate = useNavigate();
  // Sample quiz data - you can replace this with props or state
  const quizData = {
    score: 8,
    totalQuestions: 10,
    questions: [
      {
        id: 1,
        question: "What is the capital of France?",
        userAnswer: "A",
        correctAnswer: "A",
        isCorrect: true
      },
      {
        id: 2,
        question: "What is the highest mountain in the world?",
        userAnswer: "B",
        correctAnswer: "C",
        isCorrect: false
      },
      {
        id: 3,
        question: "Who painted the Mona Lisa?",
        userAnswer: "C",
        correctAnswer: "C",
        isCorrect: true
      },
      {
        id: 4,
        question: "What is the chemical symbol for gold?",
        userAnswer: "D",
        correctAnswer: "D",
        isCorrect: true
      }
    ]
  };

  const QuestionResult = ({ question, userAnswer, correctAnswer, isCorrect, questionText }) => (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${
      isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
          isCorrect ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isCorrect ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <X className="w-4 h-4 text-red-600" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-2">
            Question {question}: {questionText}
          </h3>
          <div className="text-sm text-gray-600">
            <div>Your answer: <span className="font-medium">{userAnswer}</span></div>
            <div>Correct answer: <span className="font-medium">{correctAnswer}</span></div>
          </div>
        </div>
      </div>
      
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        isCorrect 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isCorrect ? 'correct' : 'incorrect'}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Results</h1>
          <div className="flex items-center space-x-2">
            <span className="text-lg text-gray-600">You scored</span>
            <span className="text-2xl font-bold text-green-600">
              {quizData.score}/{quizData.totalQuestions}
            </span>
            <span className="text-lg">🎉</span>
          </div>
        </div>

        {/* Question Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Question Details</h2>
          
          <div className="space-y-4">
            {quizData.questions.map((item) => (
              <QuestionResult
                key={item.id}
                question={item.id}
                questionText={item.question}
                userAnswer={item.userAnswer}
                correctAnswer={item.correctAnswer}
                isCorrect={item.isCorrect}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/student/dashboard', { state: { activePage: 'quizzes' } })}
          >
            Take Another Quiz
          </button>
          <button 
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => navigate('/student/dashboard', { state: { activePage: 'results' } })}
          >
            View All Results
          </button>
        </div>
      </main>
    </div>
  );
};

export default QuizResults;