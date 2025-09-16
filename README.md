🎓 Online Quiz Platform

A modern web application for creating and taking quizzes with role-based authentication and real-time features.

🛠️ Technologies
React 18 - Frontend framework
Tailwind CSS - Styling
JavaScript ES6+ - Programming language
Lucide React - Icons
Local Storage - Data persistence (ready for backend)
✨ Features
🔐 Role-based Authentication (Admin, Teacher, Student)
📝 Multiple Question Types (MCQ, True/False, Short Answer)
⏰ Real-time Timer with auto-submit
⚡ Instant Auto-grading
📊 Progress Tracking & Leaderboards
👥 User Management (Admin approval system)
📱 Responsive Design
🚀 Installation
# Clone the repository
git clone  https://github.com/Sandunethmini/Online-Quiz-Platform.git

# Navigate to project directory
cd quiz-platform

# Install dependencies
npm install

# Start development server
npm start

# Open browser at http://localhost:3000
🔑 Demo Accounts
Role	Username	Password
Admin	admin@quizz.com	admin123
Teacher	teacher@quizz.com	teacher123
Student	student@quizz.com	student123
📦 Build for Production
# Create production build
npm run build

# Serve build locally (optional)
npx serve -s build
🎯 Usage
Login with demo accounts or create new account
Admin: Manage users, approve teachers
Teacher: Create quizzes, view student results
Student: Take quizzes, track progress
🔧 Project Structure
src/
├── components/
│   ├── LoginForm.js
│   ├── AdminDashboard.js
│   ├── TeacherDashboard.js
│   └── StudentDashboard.js
├── utils/
│   └── helpers.js
└── App.js
🌐 Backend Integration Ready
// API endpoints structure
POST /api/auth/login
GET  /api/quizzes
POST /api/quizzes/:id/submit
GET  /api/leaderboard
📋 Requirements
Node.js 16+
npm or yarn
Modern web browser
🚀 Deployment
Frontend:

Vercel: vercel --prod
Netlify: npm run build → drag build folder
GitHub Pages: Enable in repository settings
Recommended Stack:

Backend: Node.js + Express
Database: PostgreSQL or MongoDB
Authentication: JWT tokens
📝 License
MIT License - see LICENSE file for details.

Perfect for: Educational institutions, online courses, coding challenges

Support: Open GitHub issues for bugs/features
