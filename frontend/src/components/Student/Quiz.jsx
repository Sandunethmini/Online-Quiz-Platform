import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, BookOpen, BarChart3, Bell, User, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuizPlatform = ({ onExitQuiz }) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 59, seconds: 59 });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Sample quiz data
  const quizData = {
    title: "History of Ancient Rome",
    totalQuestions: 10,
    questions: [
      {
        id: 1,
        question: "What is the capital of France?",
        options: ["London", "Paris", "Berlin", "Rome"]
      },
      {
        id: 2,
        question: "Who was the first Roman Emperor?",
        options: ["Julius Caesar", "Augustus", "Nero", "Trajan"]
      },
      {
        id: 3,
        question: "In which year was Rome founded according to legend?",
        options: ["753 BC", "509 BC", "27 BC", "476 AD"]
      },
      {
        id: 4,
        question: "What was the Roman Forum?",
        options: ["A gladiator arena", "The center of Roman public life", "A temple", "A military camp"]
      },
      {
        id: 5,
        question: "Which river flows through Rome?",
        options: ["Danube", "Rhine", "Tiber", "Po"]
      }
    ]
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const goToQuestion = (questionIndex) => {
    setCurrentQuestion(questionIndex);
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestion < quizData.totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const getQuestionStatus = (questionIndex) => {
    if (questionIndex === currentQuestion) return 'current';
    if (selectedAnswers.hasOwnProperty(questionIndex)) return 'answered';
    return 'unanswered';
  };

  const getQuestionButtonClass = (questionIndex) => {
    const status = getQuestionStatus(questionIndex);
    const baseClass = "w-12 h-12 rounded-lg font-medium text-sm transition-colors duration-200";
    
    switch (status) {
      case 'current':
        return `${baseClass} bg-blue-500 text-white`;
      case 'answered':
        return `${baseClass} bg-green-100 text-green-700 border border-green-200`;
      default:
        return `${baseClass} bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200`;
    }
  };

  const handleSubmitQuiz = () => {
    // Here you would typically send the answers to your backend API
    // For now, we'll just show the success message
    setShowSuccessMessage(true);
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
      // Optional: navigate to results or dashboard
      // navigate('/results', { state: { activePage: 'results' } });
    }, 5000);
  };

  const currentQuestionData = quizData.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Dashboard Button */}
        <button 
          onClick={onExitQuiz} 
          className="mb-4 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back to Dashboard</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Quiz Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              {/* Quiz Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{quizData.title}</h1>
                  <p className="text-gray-600">Question {currentQuestion + 1} of {quizData.totalQuestions}</p>
                </div>
                <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-mono text-lg">
                    {String(timeRemaining.hours).padStart(2, '0')} : {String(timeRemaining.minutes).padStart(2, '0')} : <span className="text-red-500">{String(timeRemaining.seconds).padStart(2, '0')}</span>
                  </span>
                  <div className="text-xs text-gray-500 ml-2">
                    <div>hr</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    <div>min</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    <div>sec</div>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-xl font-medium text-gray-900 mb-6">{currentQuestionData?.question}</h2>
                
                {/* Answer Options */}
                <div className="space-y-3">
                  {currentQuestionData?.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors duration-200 ${
                        selectedAnswers[currentQuestion] === index
                          ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500 ring-opacity-20'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestion, index)}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          selectedAnswers[currentQuestion] === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswers[currentQuestion] === index && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-900">{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={goToPrevious}
                  disabled={currentQuestion === 0}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed hover:text-gray-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                
                <button
                  onClick={goToNext}
                  disabled={currentQuestion === quizData.totalQuestions - 1}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Success Message */}
              {showSuccessMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                  <div className="bg-green-100 border border-green-300 text-green-700 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Quiz submitted successfully!</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center space-x-4 mt-8">
                <button 
                  onClick={onExitQuiz}
                  className="flex items-center space-x-2 px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  <span className="font-medium">Exit Quiz</span>
                </button>
                <button 
                  onClick={handleSubmitQuiz}
                  className="flex items-center space-x-2 px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-1 bg-white rounded-sm transform rotate-45"></div>
                  </div>
                  <span className="font-medium">Submit Quiz</span>
                </button>
              </div>
            </div>
          </div>

          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions</h3>
              
              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {Array.from({ length: quizData.totalQuestions }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={getQuestionButtonClass(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600">Current</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                  <span className="text-sm text-gray-600">Answered</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
                  <span className="text-sm text-gray-600">Unanswered</span>
                </div>
              </div>
            </div>
            
            {/* See Results Button */}
            <div className="mt-6">
              <button 
                className="float-right px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
                onClick={() => {
                  // Navigate to results page
                  navigate('/results');
                }}
              >
                <BarChart3 className="w-4 h-4" />
                <span>See Results</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPlatform;