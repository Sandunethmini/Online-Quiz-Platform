import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Clock, 
  CheckCircle, 
  BarChart3, 
  Star, 
  ArrowRight, 
  Play,
  User,
  Shield,
  GraduationCap,
  Target,
  Zap,
  Award
} from 'lucide-react';

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 4000);
    
    // Ensure body has proper overflow settings
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    return () => {
      clearInterval(interval);
      // Clean up the styles when component unmounts
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);
  
  // Smooth scroll function for navigation
  const scrollToSection = (sectionId) => (e) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Computer Science Professor",
      content: "This platform has revolutionized how I conduct assessments. The auto-grading feature saves me hours every week!",
      rating: 5
    },
    {
      name: "Alex Johnson",
      role: "University Student",
      content: "Love the real-time leaderboards and instant feedback. It makes learning competitive and fun!",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      role: "High School Teacher",
      content: "The analytics help me understand where my students struggle. It's incredibly insightful!",
      rating: 5
    }
  ];

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-Role Support",
      description: "Seamlessly manage Admin, Teacher, and Student accounts with role-based permissions"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-Time Timer",
      description: "Interactive countdown timers with auto-submission when time expires"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Auto-Grading",
      description: "Instant results for MCQs and True/False questions with detailed feedback"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Leaderboards",
      description: "Competitive rankings to motivate students and track top performers"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Comprehensive progress tracking and performance insights"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Question Variety",
      description: "Support for MCQs, True/False, and short-answer question types"
    }
  ];

  const userTypes = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Admin",
      description: "Manage users, oversee all quizzes, and maintain system integrity",
      features: ["User Management", "System Analytics", "Content Moderation"],
      color: "from-red-500 to-pink-600"
    },
    {
      icon: <GraduationCap className="w-12 h-12" />,
      title: "Teacher",
      description: "Create engaging quizzes and track student performance",
      features: ["Quiz Creation", "Result Analysis", "Progress Monitoring"],
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <User className="w-12 h-12" />,
      title: "Student",
      description: "Take quizzes, view results, and compete on leaderboards",
      features: ["Quiz Attempts", "Instant Results", "Performance Tracking"],
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                QuizMaster
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" onClick={scrollToSection('features')} className="text-slate-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#roles" onClick={scrollToSection('roles')} className="text-slate-600 hover:text-blue-600 transition-colors">Roles</a>
              <a href="#about" onClick={scrollToSection('about')} className="text-slate-600 hover:text-blue-600 transition-colors">About</a>
            </nav>
            <div className="flex space-x-4">
              <Link to="/login" className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md flex items-center justify-center">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full mb-6">
              <Zap className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Revolutionizing Online Education</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
              Quiz Platform for
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Modern Learning
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Empower educators with intelligent quiz creation tools, engage students with interactive assessments, 
              and drive learning outcomes with real-time analytics and gamification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center">
                <Play className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Start Your Journey
              </Link>
              <Link to="/login" className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200 shadow-md hover:shadow-lg border border-slate-200 flex items-center justify-center">
                Already have an account? Login
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">10K+</div>
              <div className="text-slate-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">50K+</div>
              <div className="text-slate-600">Quizzes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">1M+</div>
              <div className="text-slate-600">Quiz Attempts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">99%</div>
              <div className="text-slate-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Powerful Features for
              <span className="block text-blue-600">Modern Education</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to create, manage, and analyze quizzes in one comprehensive platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section id="roles" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Built for Every
              <span className="block text-blue-600">Type of User</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Tailored experiences and permissions for administrators, teachers, and students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userTypes.map((user, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-20 h-20 bg-gradient-to-r ${user.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {user.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{user.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{user.description}</p>
                <ul className="space-y-3">
                  {user.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-slate-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors duration-200 group-hover:bg-blue-50 group-hover:text-blue-700">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              What Our Users
              <span className="block text-blue-600">Are Saying</span>
            </h2>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl text-slate-800 text-center mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              <div className="text-center">
                <div className="font-semibold text-slate-900 text-lg">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-blue-600">
                  {testimonials[currentTestimonial].role}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              About
              <span className="block text-blue-600">QuizMaster</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              QuizMaster is a comprehensive online quiz platform designed to bridge the gap between traditional education and modern technology.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Our Mission</h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                We believe that learning should be engaging, interactive, and accessible to everyone. Our platform empowers educators to create meaningful assessments while providing students with an intuitive and gamified learning experience.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-slate-600">Democratizing quality education through technology</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-slate-600">Supporting educators with powerful assessment tools</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-slate-600">Creating engaging learning experiences for students</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Why Choose QuizMaster?</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Lightning Fast</h4>
                    <p className="text-slate-600">Built with modern web technologies for optimal performance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Secure & Reliable</h4>
                    <p className="text-slate-600">Enterprise-grade security with 99.9% uptime guarantee</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Data-Driven Insights</h4>
                    <p className="text-slate-600">Comprehensive analytics to improve learning outcomes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="w-16 h-16 text-blue-200 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of educators who are already using QuizMaster to create engaging, 
            interactive learning experiences.
          </p>
          <Link to="/signup" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
            Get Started Free Today
            <ArrowRight className="w-5 h-5 ml-2 inline" />
          </Link>
          <p className="text-blue-200 mt-4">No credit card required • Set up in under 2 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">QuizMaster</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Empowering educators and students with the most advanced online quiz platform. 
                Create, learn, and grow together.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 QuizMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;