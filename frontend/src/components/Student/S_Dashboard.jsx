import React, { useState, useEffect } from 'react';
import Quiz from './Quiz';
import { TrendingUp, Play, Trophy, Target, Clock, Award, BarChart3, LogOut, BookOpen } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// StartQuizButton Component
const StartQuizButton = ({ onStartQuiz }) => {
  return (
    <button 
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
      onClick={onStartQuiz}
    >
      <Play className="w-4 h-4" />
      <span>Start Quiz</span>
    </button>
  );
};
const Navbar = ({ currentPage, setCurrentPage, setShowQuiz }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'quizzes', label: 'Quizzes' },
    { id: 'results', label: 'Results' },
    { id: 'leaderboard', label: 'Leaderboard' }
  ];
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setShowQuiz(false); // Exit quiz mode when navigating
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            QuizMaster
          </span>
        </div>
        <div className="flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`font-medium transition-colors ${
                currentPage === item.id
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="ml-4 text-red-600 hover:text-red-800 flex items-center space-x-1"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">S</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Available Quizzes Component (Dashboard version)
const AvailableQuizzes = ({ onStartQuiz }) => {
  const quizzes = [
    { title: "History Quiz", duration: "30 minutes" },
    { title: "Math Challenge", duration: "45 minutes" },
    { title: "Science Test", duration: "60 minutes" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Available Quizzes</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500 uppercase tracking-wide pb-3 border-b border-gray-100">
          <span>Quiz Title</span>
          <span>Duration</span>
          <span>Action</span>
        </div>
        {quizzes.map((quiz, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 items-center py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors">
            <span className="font-medium text-gray-800">{quiz.title}</span>
            <span className="text-gray-600">{quiz.duration}</span>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 w-fit transition-colors"
              onClick={onStartQuiz}
            >
              <Play className="w-4 h-4" />
              <span>Start Quiz</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Full Quizzes Page
const QuizzesPage = ({ onStartQuiz }) => {
  const allQuizzes = [
    { 
      title: "History Quiz", 
      duration: "30 minutes", 
      questions: 25,
      difficulty: "Medium",
      description: "Test your knowledge of world history from ancient civilizations to modern times."
    },
    { 
      title: "Math Challenge", 
      duration: "45 minutes", 
      questions: 30,
      difficulty: "Hard",
      description: "Advanced mathematics including algebra, geometry, and calculus problems."
    },
    { 
      title: "Science Test", 
      duration: "60 minutes", 
      questions: 40,
      difficulty: "Medium",
      description: "Comprehensive science quiz covering physics, chemistry, and biology."
    },
    { 
      title: "Literature Quiz", 
      duration: "35 minutes", 
      questions: 20,
      difficulty: "Easy",
      description: "Classic and modern literature, poetry, and famous authors."
    },
    { 
      title: "Geography Challenge", 
      duration: "25 minutes", 
      questions: 35,
      difficulty: "Medium",
      description: "World geography including capitals, landmarks, and physical features."
    },
    { 
      title: "Programming Basics", 
      duration: "50 minutes", 
      questions: 25,
      difficulty: "Hard",
      description: "Fundamental programming concepts and problem-solving skills."
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Quizzes</h1>
        <p className="text-gray-600">Choose from our collection of quizzes across different subjects and difficulty levels.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allQuizzes.map((quiz, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{quiz.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                {quiz.difficulty}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{quiz.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>{quiz.questions} questions</span>
              </div>
            </div>
            
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
              onClick={onStartQuiz}
            >
              <Play className="w-4 h-4" />
              <span>Start Quiz</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Results Component (Dashboard version)
const Results = () => {
  const chartData = [
    { day: 'Mon', score: 82 },
    { day: 'Tue', score: 85 },
    { day: 'Wed', score: 78 },
    { day: 'Thu', score: 88 },
    { day: 'Fri', score: 75 },
    { day: 'Sat', score: 92 },
    { day: 'Sun', score: 89 }
  ];

  const maxScore = Math.max(...chartData.map(d => d.score));
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">My Results</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Average Score</span>
          <div className="flex items-center space-x-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+5%</span>
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-800">85%</div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end h-32">
          {chartData.map((data, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div 
                className="w-8 bg-blue-500 rounded-t-sm transition-all duration-300"
                style={{ height: `${(data.score / maxScore) * 100}px` }}
              ></div>
              <span className="text-xs text-gray-500">{data.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Full Results Page
const ResultsPage = () => {
  const recentResults = [
    {
      quiz: "History Quiz",
      score: 92,
      totalQuestions: 25,
      correctAnswers: 23,
      date: "2024-09-06",
      duration: "28 minutes",
      status: "Completed"
    },
    {
      quiz: "Math Challenge",
      score: 85,
      totalQuestions: 30,
      correctAnswers: 25,
      date: "2024-09-05",
      duration: "42 minutes",
      status: "Completed"
    },
    {
      quiz: "Science Test",
      score: 78,
      totalQuestions: 40,
      correctAnswers: 31,
      date: "2024-09-04",
      duration: "58 minutes",
      status: "Completed"
    },
    {
      quiz: "Literature Quiz",
      score: 88,
      totalQuestions: 20,
      correctAnswers: 18,
      date: "2024-09-03",
      duration: "32 minutes",
      status: "Completed"
    },
    {
      quiz: "Geography Challenge",
      score: 75,
      totalQuestions: 35,
      correctAnswers: 26,
      date: "2024-09-02",
      duration: "23 minutes",
      status: "Completed"
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
        <p className="text-gray-600">Track your progress and performance across all completed quizzes.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Quizzes Taken</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Award className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Best Score</p>
              <p className="text-2xl font-bold text-gray-900">95%</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900">8.5h</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Results</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Quiz</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Score</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Questions</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Duration</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.map((result, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-800">{result.quiz}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.score)}`}>
                      {result.score}%
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{result.correctAnswers}/{result.totalQuestions}</td>
                  <td className="py-4 px-6 text-gray-600">{result.duration}</td>
                  <td className="py-4 px-6 text-gray-600">{result.date}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-sm font-medium text-green-600 bg-green-100">
                      {result.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Leaderboard Component (Dashboard version)
const LeaderboardWidget = () => {
  const leaders = [
    { rank: 1, name: "Emily Carter", score: 95, isTop: true },
    { rank: 2, name: "David Lee", score: 92, isTop: false },
    { rank: 3, name: "Olivia Brown", score: 90, isTop: false }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Leaderboard</h2>
      <div className="space-y-4">
        {leaders.map((leader, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                leader.isTop 
                  ? 'bg-yellow-100 text-yellow-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {leader.isTop ? <Trophy className="w-4 h-4" /> : leader.rank}
              </div>
              <span className="font-medium text-gray-800">{leader.name}</span>
            </div>
            <span className="font-semibold text-gray-900">{leader.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Full Leaderboard Page
const LeaderboardPage = () => {
  const fullLeaderboard = [
    { rank: 1, name: "Emily Carter", score: 95, avatar: "E", quizzesTaken: 15, avgScore: 92 },
    { rank: 2, name: "David Lee", score: 92, avatar: "D", quizzesTaken: 12, avgScore: 88 },
    { rank: 3, name: "Olivia Brown", score: 90, avatar: "O", quizzesTaken: 14, avgScore: 85 },
    { rank: 4, name: "Sarah Wilson", score: 85, avatar: "S", quizzesTaken: 8, avgScore: 83 },
    { rank: 5, name: "Michael Johnson", score: 83, avatar: "M", quizzesTaken: 10, avgScore: 80 },
    { rank: 6, name: "Emma Davis", score: 82, avatar: "E", quizzesTaken: 11, avgScore: 78 },
    { rank: 7, name: "James Miller", score: 80, avatar: "J", quizzesTaken: 9, avgScore: 77 },
    { rank: 8, name: "Lisa Anderson", score: 78, avatar: "L", quizzesTaken: 13, avgScore: 75 },
    { rank: 9, name: "Robert Taylor", score: 77, avatar: "R", quizzesTaken: 7, avgScore: 74 },
    { rank: 10, name: "Anna Martinez", score: 75, avatar: "A", quizzesTaken: 6, avgScore: 72 }
  ];

  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (rank === 2) return 'bg-gray-100 text-gray-800 border-gray-200';
    if (rank === 3) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p className="text-gray-600">See how you rank against other quiz participants.</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {fullLeaderboard.slice(0, 3).map((user, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold ${
              index === 0 ? 'bg-yellow-100 text-yellow-800' :
              index === 1 ? 'bg-gray-100 text-gray-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              {index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{user.name}</h3>
            <p className="text-2xl font-bold text-gray-800 mb-2">{user.score}%</p>
            <p className="text-sm text-gray-600">{user.quizzesTaken} quizzes • {user.avgScore}% avg</p>
          </div>
        ))}
      </div>

      {/* Full Rankings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Full Rankings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Rank</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">User</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Best Score</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Average Score</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Quizzes Taken</th>
              </tr>
            </thead>
            <tbody>
              {fullLeaderboard.map((user, index) => (
                <tr key={index} className={`border-b border-gray-100 hover:bg-gray-50 ${user.name === 'Sarah Wilson' ? 'bg-blue-50' : ''}`}>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRankBadge(user.rank)}`}>
                      #{user.rank}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.avatar}
                      </div>
                      <span className="font-medium text-gray-800">{user.name}</span>
                      {user.name === 'Sarah Wilson' && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-900">{user.score}%</td>
                  <td className="py-4 px-6 text-gray-600">{user.avgScore}%</td>
                  <td className="py-4 px-6 text-gray-600">{user.quizzesTaken}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = ({ onStartQuiz }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Sarah!</h1>
        <p className="text-gray-600">Here's an overview of your recent activity and available quizzes.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AvailableQuizzes onStartQuiz={onStartQuiz} />
        </div>
        <div className="space-y-8">
          <Results />
          <LeaderboardWidget />
        </div>
      </div>
    </div>
  );
};

// Main App Component with Navigation
const App = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showQuiz, setShowQuiz] = useState(false);
  
  // Check for navigation state from Results page
  useEffect(() => {
    if (location.state?.activePage) {
      setCurrentPage(location.state.activePage);
    }
  }, [location]);

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleExitQuiz = () => {
    setShowQuiz(false);
  };

  const renderPage = () => {
    if (showQuiz) {
      return <Quiz onExitQuiz={handleExitQuiz} />;
    }
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onStartQuiz={handleStartQuiz} />;
      case 'quizzes':
        return <QuizzesPage onStartQuiz={handleStartQuiz} />;
      case 'results':
        return <ResultsPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      default:
        return <Dashboard onStartQuiz={handleStartQuiz} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        setShowQuiz={setShowQuiz}
      />
      {renderPage()}
    </div>
  );
};

export default App;