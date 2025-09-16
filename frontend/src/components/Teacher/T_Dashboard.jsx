import React, { useState } from 'react';
import { 
  BarChart3, 
  Plus, 
  Edit3, 
  BarChart, 
  Trash2, 
  User,
  Save,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ScatterChart,
  Scatter,
  RadialBarChart,
  RadialBar
} from 'recharts';

// Navbar Component
const Navbar = ({ currentPage, setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            QuizMaster
          </span>
        </div>
        
        <div className="flex items-center">
          <div className="hidden md:flex items-center space-x-6 mr-6">
            <a 
              href="#" 
              className={`${currentPage === 'dashboard' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600`}
              onClick={() => handleNavClick('dashboard')}
            >
              Dashboard
            </a>
            <a 
              href="#" 
              className={`${currentPage === 'myQuizzes' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600`}
              onClick={() => handleNavClick('myQuizzes')}
            >
              My Quizzes
            </a>
            <a 
              href="#" 
              className={`${currentPage === 'analytics' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600`}
              onClick={() => handleNavClick('analytics')}
            >
              Analytics
            </a>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span>Logout</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentPage('createQuiz')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Quiz</span>
            </button>
            
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">T</span>
            </div>
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden mt-4 py-2 border-t">
          <a 
            href="#" 
            className={`block py-2 ${currentPage === 'dashboard' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600`}
            onClick={() => handleNavClick('dashboard')}
          >
            Dashboard
          </a>
          <a 
            href="#" 
            className={`block py-2 ${currentPage === 'myQuizzes' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600`}
            onClick={() => handleNavClick('myQuizzes')}
          >
            My Quizzes
          </a>
          <a 
            href="#" 
            className={`block py-2 ${currentPage === 'analytics' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600`}
            onClick={() => handleNavClick('analytics')}
          >
            Analytics
          </a>
        </div>
      )}
    </nav>
  );
};

// Create Quiz Form Component
const CreateQuizForm = ({ setCurrentPage, addQuiz }) => {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    questions: [
      {
        id: 1,
        question: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: 0
      }
    ]
  });

  const handleQuizChange = (field, value) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIndex) => 
        qIndex === questionIndex 
          ? { 
              ...q, 
              options: q.options.map((option, oIndex) => 
                oIndex === optionIndex ? value : option
              )
            }
          : q
      )
    }));
  };

  const addQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        id: prev.questions.length + 1,
        question: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: 0
      }]
    }));
  };

  const removeQuestion = (questionIndex) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Quiz created:', quizData);
    // Call the addQuiz function to update the parent component's state
    addQuiz(quizData);
    alert('Quiz created successfully!');
    setCurrentPage('myQuizzes');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Quiz</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quiz Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  required
                  value={quizData.title}
                  onChange={(e) => handleQuizChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter quiz title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={quizData.timeLimit}
                  onChange={(e) => handleQuizChange('timeLimit', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={quizData.description}
                onChange={(e) => handleQuizChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter quiz description"
              />
            </div>

            {/* Questions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Questions</h3>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
              </div>

              {quizData.questions.map((question, questionIndex) => (
                <div key={question.id} className="bg-gray-50 rounded-lg p-6 mb-4">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-800">
                      Question {questionIndex + 1}
                    </h4>
                    {quizData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Text *
                      </label>
                      <input
                        type="text"
                        required
                        value={question.question}
                        onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your question"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Answer Options
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name={`correct-${questionIndex}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => handleQuestionChange(questionIndex, 'correctAnswer', optionIndex)}
                              className="text-blue-500"
                            />
                            <input
                              type="text"
                              required
                              value={option}
                              onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Select the correct answer by clicking the radio button
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setCurrentPage('dashboard')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Create Quiz</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// My Quizzes Page Component
const MyQuizzesPage = ({ 
  setCurrentPage, 
  quizzes, 
  handleEdit, 
  handleDelete, 
  handleViewResults,
  toggleStatus
}) => {
  // Use the functions passed from parent component instead of local functions
  // This ensures state is properly updated when we edit or delete quizzes

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Quizzes</h1>
          <p className="text-gray-600">Manage and monitor your quiz collection</p>
        </div>
        <button 
          onClick={() => setCurrentPage('createQuiz')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Quiz</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{quiz.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{quiz.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                quiz.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {quiz.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{quiz.questions}</div>
                <div className="text-xs text-gray-500">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{quiz.attempts}</div>
                <div className="text-xs text-gray-500">Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{quiz.avgScore}%</div>
                <div className="text-xs text-gray-500">Avg Score</div>
              </div>
            </div>

            <div className="text-xs text-gray-400 mb-4">
              Created: {new Date(quiz.createdDate).toLocaleDateString()}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEdit(quiz.id)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 px-2 py-1 border border-blue-200 rounded-md hover:bg-blue-50"
                  title="Edit Quiz"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="text-sm">Edit</span>
                </button>
                <button 
                  onClick={() => handleViewResults(quiz.id)}
                  className="text-green-600 hover:text-green-800 p-1"
                  title="View Analytics"
                >
                  <BarChart className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(quiz.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete Quiz"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => toggleStatus(quiz.id)}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  quiz.status === 'Active'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {quiz.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Edit Quiz Form Component
const EditQuizForm = ({ setCurrentPage, currentQuiz, updateQuiz }) => {
  const [quizData, setQuizData] = useState({
    id: currentQuiz.id,
    title: currentQuiz.title,
    description: currentQuiz.description || '',
    timeLimit: currentQuiz.timeLimit || 30,
    status: currentQuiz.status,
    questions: currentQuiz.questionsList || [
      {
        id: 1,
        question: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: 0
      }
    ]
  });

  const handleQuizChange = (field, value) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIndex) => 
        qIndex === questionIndex 
          ? { 
              ...q, 
              options: q.options.map((option, oIndex) => 
                oIndex === optionIndex ? value : option
              )
            }
          : q
      )
    }));
  };

  const addQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        id: prev.questions.length + 1,
        question: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: 0
      }]
    }));
  };

  const removeQuestion = (questionIndex) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Quiz updated:', quizData);
    // Update quiz in parent component
    updateQuiz(quizData);
    alert('Quiz updated successfully!');
    setCurrentPage('myQuizzes');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setCurrentPage('myQuizzes')}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to My Quizzes
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Quiz</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quiz Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  required
                  value={quizData.title}
                  onChange={(e) => handleQuizChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter quiz title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={quizData.timeLimit}
                  onChange={(e) => handleQuizChange('timeLimit', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={quizData.description}
                onChange={(e) => handleQuizChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter quiz description"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={quizData.status}
                onChange={(e) => handleQuizChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Questions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Questions</h3>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
              </div>

              {quizData.questions.map((question, questionIndex) => (
                <div key={question.id} className="bg-gray-50 rounded-lg p-6 mb-4">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-800">
                      Question {questionIndex + 1}
                    </h4>
                    {quizData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Text *
                      </label>
                      <input
                        type="text"
                        required
                        value={question.question}
                        onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your question"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Answer Options
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name={`correct-${questionIndex}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => handleQuestionChange(questionIndex, 'correctAnswer', optionIndex)}
                              className="text-blue-500"
                            />
                            <input
                              type="text"
                              required
                              value={option}
                              onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Select the correct answer by clicking the radio button
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setCurrentPage('myQuizzes')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Analytics Page Component
const AnalyticsPage = () => {
  const [scoreChartType, setScoreChartType] = useState('pie');
  const [quizChartType, setQuizChartType] = useState('radar');

  const scoreDistributionData = [
    { range: '0-20%', count: 2 },
    { range: '21-40%', count: 5 },
    { range: '41-60%', count: 8 },
    { range: '61-80%', count: 15 },
    { range: '81-100%', count: 12 }
  ];

  const quizPerformanceData = [
    { quiz: 'History 101', avgScore: 78, attempts: 24 },
    { quiz: 'Math Basics', avgScore: 85, attempts: 12 },
    { quiz: 'Science Fund.', avgScore: 72, attempts: 31 },
    { quiz: 'English Gram.', avgScore: 81, attempts: 19 },
    { quiz: 'World Geo.', avgScore: 69, attempts: 8 }
  ];

  const weeklyProgressData = [
    { week: 'Week 1', completions: 15, avgScore: 75 },
    { week: 'Week 2', completions: 23, avgScore: 78 },
    { week: 'Week 3', completions: 31, avgScore: 82 },
    { week: 'Week 4', completions: 28, avgScore: 79 }
  ];

  const difficultyData = [
    { name: 'Easy', value: 35, color: '#10B981' },
    { name: 'Medium', value: 45, color: '#F59E0B' },
    { name: 'Hard', value: 20, color: '#EF4444' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Analytics</h1>
        <p className="text-gray-600">Comprehensive insights into quiz performance and student progress</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <BarChart className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-900">94</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900">77%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Score Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Score Distribution</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setScoreChartType('bar')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  scoreChartType === 'bar' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                Bar Chart
              </button>
              <button 
                onClick={() => setScoreChartType('pie')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  scoreChartType === 'pie' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                Pie Chart
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            {scoreChartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={scoreDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="range"
                  label={({range, count, percent}) => `${range}: ${count} (${(percent * 100).toFixed(0)}%)`}
                >
                  {scoreDistributionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        index === 0 ? '#EF4444' : // red for lowest scores
                        index === 1 ? '#F59E0B' : // amber for low-mid scores
                        index === 2 ? '#10B981' : // green for mid scores
                        index === 3 ? '#3B82F6' : // blue for mid-high scores
                        '#6366F1'                 // indigo for highest scores
                      } 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} students`, name]} />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            ) : (
              <RechartsBarChart data={scoreDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} students`]} />
                <Bar dataKey="count" name="Students" radius={[4, 4, 0, 0]}>
                  {scoreDistributionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        index === 0 ? '#EF4444' : // red for lowest scores
                        index === 1 ? '#F59E0B' : // amber for low-mid scores
                        index === 2 ? '#10B981' : // green for mid scores
                        index === 3 ? '#3B82F6' : // blue for mid-high scores
                        '#6366F1'                 // indigo for highest scores
                      } 
                    />
                  ))}
                </Bar>
              </RechartsBarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Quiz Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Quiz Performance</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setQuizChartType('radar')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  quizChartType === 'radar' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                Radar Chart
              </button>
              <button 
                onClick={() => setQuizChartType('bar')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  quizChartType === 'bar' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                Bar Chart
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            {quizChartType === 'radar' ? (
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={quizPerformanceData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="quiz" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Average Score %" dataKey="avgScore" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Radar name="Attempts" dataKey="attempts" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Tooltip />
                <Legend />
              </RadarChart>
            ) : (
              <RechartsBarChart data={quizPerformanceData} barGap={0} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quiz" />
                <YAxis yAxisId="left" orientation="left" stroke="#10B981" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="avgScore" name="Average Score %" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="attempts" name="Attempts" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completions" stroke="#3B82F6" strokeWidth={2} name="Completions" />
              <Line type="monotone" dataKey="avgScore" stroke="#EF4444" strokeWidth={2} name="Avg Score %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Question Difficulty */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Difficulty Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Original My Quizzes Component (for dashboard)
const MyQuizzes = ({ quizzes, onEdit, onViewResults, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Quizzes</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Quiz Title</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 text-gray-800">{quiz.title}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    quiz.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {quiz.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => onEdit(quiz.id)}
                      className="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button 
                      onClick={() => onViewResults(quiz.id)}
                      className="text-gray-600 hover:text-green-600 flex items-center space-x-1"
                    >
                      <BarChart className="w-4 h-4" />
                      <span className="text-sm">Results</span>
                    </button>
                    <button 
                      onClick={() => onDelete(quiz.id)}
                      className="text-gray-600 hover:text-red-600 flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Quiz Analytics Component (for dashboard)
const QuizAnalytics = ({ analytics }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quiz Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Average Score</h3>
          <div className="text-4xl font-bold text-gray-800 mb-2">{analytics.averageScore}%</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Most Missed Question</h3>
          <div className="text-2xl font-bold text-gray-800">{analytics.mostMissedQuestion}</div>
        </div>
      </div>
    </div>
  );
};

// Student Submissions Component
const StudentSubmissions = ({ submissions }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Submissions</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Student Name</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Quiz Title</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Attempt Date</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 text-gray-800">{submission.studentName}</td>
                <td className="py-4 px-4 text-gray-700">{submission.quizTitle}</td>
                <td className="py-4 px-4 text-gray-600">{submission.attemptDate}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    submission.score >= 80 
                      ? 'bg-green-100 text-green-800' 
                      : submission.score >= 60
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {submission.score}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {submissions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No student submissions yet.
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component
const T_Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Using state setter function to allow updating quizzes
  const [quizzes, setQuizzes] = useState([
    { id: 1, title: 'History 101', status: 'Active' },
    { id: 2, title: 'Math Basics', status: 'Inactive' },
    { id: 3, title: 'Science Fundamentals', status: 'Active' }
  ]);

  // Function to add a new quiz to the quizzes state
  const addQuiz = (newQuizData) => {
    const newQuiz = {
      id: quizzes.length > 0 ? Math.max(...quizzes.map(q => q.id)) + 1 : 1,
      title: newQuizData.title,
      status: 'Active',
      description: newQuizData.description,
      questions: newQuizData.questions.length,
      questionsList: newQuizData.questions, // Store the actual questions
      attempts: 0,
      avgScore: 0,
      createdDate: new Date().toISOString().split('T')[0],
      timeLimit: newQuizData.timeLimit
    };
    setQuizzes([...quizzes, newQuiz]);
  };

  const [analytics] = useState({
    averageScore: 78,
    mostMissedQuestion: 'Question 3'
  });

  const [submissions] = useState([
    {
      id: 1,
      studentName: 'Alice Johnson',
      quizTitle: 'History 101',
      attemptDate: '2025-09-05',
      score: 85
    },
    {
      id: 2,
      studentName: 'Bob Smith',
      quizTitle: 'Science Fundamentals',
      attemptDate: '2025-09-04',
      score: 72
    },
    {
      id: 3,
      studentName: 'Carol Davis',
      quizTitle: 'Math Basics',
      attemptDate: '2025-09-03',
      score: 91
    },
    {
      id: 4,
      studentName: 'David Wilson',
      quizTitle: 'History 101',
      attemptDate: '2025-09-02',
      score: 58
    }
  ]);

  const [currentQuiz, setCurrentQuiz] = useState(null);

  const handleEdit = (quizId) => {
    console.log('Edit quiz:', quizId);
    const quizToEdit = quizzes.find(quiz => quiz.id === quizId);
    if (quizToEdit) {
      setCurrentQuiz(quizToEdit);
      setCurrentPage('editQuiz');
    }
  };

  const handleViewResults = (quizId) => {
    console.log('View results for quiz:', quizId);
    setCurrentPage('analytics');
  };

  const handleDelete = (quizId) => {
    console.log('Delete quiz:', quizId);
    if (confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== quizId));
      alert(`Quiz ${quizId} deleted successfully`);
    }
  };
  
  const toggleStatus = (quizId) => {
    setQuizzes(prevQuizzes => 
      prevQuizzes.map(quiz => 
        quiz.id === quizId 
          ? { ...quiz, status: quiz.status === 'Active' ? 'Inactive' : 'Active' }
          : quiz
      )
    );
  };

  const updateQuiz = (updatedQuiz) => {
    setQuizzes(prevQuizzes => 
      prevQuizzes.map(quiz => 
        quiz.id === updatedQuiz.id ? {
          ...quiz,
          title: updatedQuiz.title,
          description: updatedQuiz.description,
          status: updatedQuiz.status,
          timeLimit: updatedQuiz.timeLimit,
          questions: updatedQuiz.questions.length, // Update the question count
          questionsList: updatedQuiz.questions // Store the actual questions
        } : quiz
      )
    );
  };

  // Render different pages based on currentPage state
  if (currentPage === 'createQuiz') {
    return (
      <>
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <CreateQuizForm setCurrentPage={setCurrentPage} addQuiz={addQuiz} />
      </>
    );
  }
  
  if (currentPage === 'editQuiz' && currentQuiz) {
    return (
      <>
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <EditQuizForm 
          setCurrentPage={setCurrentPage} 
          currentQuiz={currentQuiz} 
          updateQuiz={updateQuiz} 
        />
      </>
    );
  }

  if (currentPage === 'myQuizzes') {
    return (
      <>
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <MyQuizzesPage 
          setCurrentPage={setCurrentPage} 
          quizzes={quizzes}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleViewResults={handleViewResults}
          toggleStatus={toggleStatus}
        />
      </>
    );
  }

  if (currentPage === 'analytics') {
    return (
      <>
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <AnalyticsPage />
      </>
    );
  }

  // Default dashboard page
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Ms. Johnson</h1>
          <p className="text-gray-600">Manage your quizzes and track student progress.</p>
        </div>

        {/* My Quizzes Section */}
        <MyQuizzes 
          quizzes={quizzes}
          onEdit={handleEdit}
          onViewResults={handleViewResults}
          onDelete={handleDelete}
        />

        {/* Quiz Analytics Section */}
        <QuizAnalytics analytics={analytics} />

        {/* Student Submissions Section */}
        <StudentSubmissions submissions={submissions} />
      </div>
    </div>
  );
};

export default T_Dashboard;
