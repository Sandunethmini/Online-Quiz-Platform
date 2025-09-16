import React, { useState } from 'react';
import { Users, BookOpen, Activity, Menu, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
              className={`${currentPage === 'users' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600`}
              onClick={() => handleNavClick('users')}
            >
              Users
            </a>
            <a 
              href="#" 
              className={`${currentPage === 'quizzes' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600`}
              onClick={() => handleNavClick('quizzes')}
            >
              Quizzes
            </a>
            <a 
              href="#" 
              className={`${currentPage === 'logs' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600`}
              onClick={() => handleNavClick('logs')}
            >
              Logs
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
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">A</span>
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
            className={`block py-2 ${currentPage === 'users' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600`}
            onClick={() => handleNavClick('users')}
          >
            Users
          </a>
          <a 
            href="#" 
            className={`block py-2 ${currentPage === 'quizzes' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600`}
            onClick={() => handleNavClick('quizzes')}
          >
            Quizzes
          </a>
          <a 
            href="#" 
            className={`block py-2 ${currentPage === 'logs' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600`}
            onClick={() => handleNavClick('logs')}
          >
            Logs
          </a>
        </div>
      )}
    </nav>
  );
};

// Manage Users Component
const ManageUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Sophie Clark", role: "Student", status: "Active" },
    { id: 2, name: "Ethan Carter", role: "Teacher", status: "Active" },
    { id: 3, name: "Olivia Bennett", role: "Admin", status: "Active" },
    { id: 4, name: "Liam Foster", role: "Student", status: "Blocked" },
    { id: 5, name: "Ava Harper", role: "Teacher", status: "Active" }
  ]);

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Blocked' : 'Active' }
        : user
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 text-gray-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Manage Users</h2>
      </div>
      
      <div className="overflow-x-auto w-full max-w-full">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 uppercase tracking-wider">Name</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 uppercase tracking-wider">Role</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-3 px-2 text-sm text-gray-900">{user.name}</td>
                <td className="py-3 px-2 text-sm text-gray-600">{user.role}</td>
                <td className="py-3 px-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    className={`px-3 py-1 text-xs font-medium rounded ${
                      user.status === 'Active'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {user.status === 'Active' ? 'Block' : 'Unblock'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// All Quizzes Component
const AllQuizzes = () => {
  const quizzes = [
    { id: 1, title: "Math Quiz 1", subject: "Mathematics", author: "Ethan Carter", dateCreated: "2023-01-15" },
    { id: 2, title: "Science Quiz 2", subject: "Science", author: "Ava Harper", dateCreated: "2023-02-20" },
    { id: 3, title: "History Quiz 3", subject: "History", author: "Ethan Carter", dateCreated: "2023-03-25" },
    { id: 4, title: "English Quiz 4", subject: "English", author: "Ava Harper", dateCreated: "2023-04-30" },
    { id: 5, title: "Geography Quiz 5", subject: "Geography", author: "Ethan Carter", dateCreated: "2023-05-05" }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center mb-4">
        <BookOpen className="w-5 h-5 text-gray-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">All Quizzes</h2>
      </div>
      
      <div className="overflow-x-auto w-full max-w-full">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 uppercase tracking-wider">Quiz Title</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 uppercase tracking-wider">Subject</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 uppercase tracking-wider">Author</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 uppercase tracking-wider">Date Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quizzes.map((quiz) => (
              <tr key={quiz.id} className="hover:bg-gray-50">
                <td className="py-3 px-2 text-sm font-medium text-gray-900">{quiz.title}</td>
                <td className="py-3 px-2 text-sm text-gray-600">{quiz.subject}</td>
                <td className="py-3 px-2 text-sm text-gray-600">{quiz.author}</td>
                <td className="py-3 px-2 text-sm text-gray-600">{quiz.dateCreated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// System Logs Component
const SystemLogs = () => {
  const logs = [
    { id: 1, action: "Sophie Clark completed Math Quiz 1", timestamp: "2023-08-01 9:00 AM" },
    { id: 2, action: "Ethan Carter created Science Quiz 2", timestamp: "2023-08-01 11:00 AM" },
    { id: 3, action: "Olivia Bennett blocked Liam Foster", timestamp: "2023-08-01 12:00 PM" },
    { id: 4, action: "Ava Harper completed English Quiz 4", timestamp: "2023-08-01 1:00 PM" },
    { id: 5, action: "Liam Foster logged in", timestamp: "2023-08-01 1:30 PM" }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Activity className="w-5 h-5 text-gray-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">System Logs</h2>
      </div>
      
      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100">
            <span className="text-sm text-gray-800">{log.action}</span>
            <span className="text-xs text-gray-500">{log.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Users Page Component
const UsersPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Users</h1>
      <ManageUsers />
    </div>
  );
};

// Quizzes Page Component
const QuizzesPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Quizzes</h1>
      <AllQuizzes />
    </div>
  );
};

// Logs Page Component
const LogsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">System Logs</h1>
      <SystemLogs />
    </div>
  );
};

// Main Admin Dashboard Component
const A_Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderContent = () => {
    switch(currentPage) {
      case 'users':
        return <UsersPage />;
      case 'quizzes':
        return <QuizzesPage />;
      case 'logs':
        return <LogsPage />;
      case 'dashboard':
      default:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>
            
            <ManageUsers />
            <AllQuizzes />
            <SystemLogs />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full overflow-auto">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="pb-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default A_Dashboard;