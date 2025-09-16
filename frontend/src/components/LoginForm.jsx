import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Basic validation
    if (!email) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }
    
    if (!password) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }
    
    if (!role) {
      setError('Please select a role');
      setIsLoading(false);
      return;
    }
    
    try {
      // Connect to the actual backend API
      const data = await login(email, password, role);
      
      console.log(`Login successful for: ${email}, Role: ${role}`);
      
      // Use AuthContext to login and save user data
      contextLogin(data.user);
      
      // After successful login, redirect to specific dashboard based on role
      if (role === 'Student') {
        navigate('/student/dashboard');
      } else if (role === 'Teacher') {
        navigate('/teacher/dashboard');
      } else if (role === 'Admin') {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      // Display specific error message from backend if available
      if (err.message === 'Invalid email or password') {
        setError('Invalid email or password. Please try again.');
      } else if (err.message === 'Invalid role for this user') {
        setError(`This user is not registered as a ${role}. Please select the correct role.`);
      } else if (err.message.includes('connect') || err.message.includes('network') || err.message.includes('Failed to fetch')) {
        // For demo purposes - using mock login instead of showing server connection error
        console.log('Connection error detected, using mock login for demo');
        
        // Mock login logic for demonstration
        const mockUsers = {
          'student@quizz.com': { password: 'student123', role: 'Student', route: '/student/dashboard' },
          'teacher@quizz.com': { password: 'teacher123', role: 'Teacher', route: '/teacher/dashboard' },
          'admin@quizz.com': { password: 'admin123', role: 'Admin', route: '/admin/dashboard' }
        };
        
        if (mockUsers[email] && mockUsers[email].password === password && mockUsers[email].role === role) {
          // Mock successful login
          const mockUser = { email, role, name: role === 'Student' ? 'Demo Student' : (role === 'Teacher' ? 'Demo Teacher' : 'Demo Admin') };
          contextLogin(mockUser);
          navigate(mockUsers[email].route);
          return;
        } else {
          setError('Invalid email or password. Please try again.');
        }
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordMessage('');
    setIsSendingReset(true);

    // Basic email validation
    if (!forgotEmail) {
      setForgotPasswordError('Email is required');
      setIsSendingReset(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      setForgotPasswordError('Please enter a valid email address');
      setIsSendingReset(false);
      return;
    }

    try {
      // In a real application, you would call your backend API here
      // For demo purposes, we'll simulate the request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setForgotPasswordMessage('Password reset instructions have been sent to your email address. Please check your inbox and follow the instructions to reset your password.');
      setForgotEmail('');
      
      // Auto close modal after 3 seconds
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordMessage('');
      }, 3000);
      
    } catch (err) {
      setForgotPasswordError('Failed to send reset email. Please try again.');
    } finally {
      setIsSendingReset(false);
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setForgotEmail('');
    setForgotPasswordMessage('');
    setForgotPasswordError('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration}>
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
        <div style={styles.shape3}></div>
      </div>
      
      {/* Left Panel - Branding */}
      <div style={styles.leftPanel}>
        <div style={styles.brandingContent}>
          <div style={styles.logoContainer}>
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform transition-transform duration-300 hover:scale-110">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <div style={styles.brandingText}>
            <h1 className="text-4xl font-bold text-white mb-2">QuizMaster</h1>
            <h2 style={styles.brandSubtitle}>Empowering Education Through Technology</h2>
            <p style={styles.brandDescription}>
              Join thousands of students and teachers who are revolutionizing their learning experience with our interactive quiz platform.
            </p>
          </div>
          
          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>🎓</span>
              <span style={styles.featureText}>Interactive Learning</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>📊</span>
              <span style={styles.featureText}>Real-time Analytics</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>🏆</span>
              <span style={styles.featureText}>Achievement System</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Login Form */}
      <div style={styles.rightPanel}>
        <div style={styles.loginBox}>
          <div style={styles.formHeader}>
            <h2 style={styles.welcomeText}>Welcome Back!</h2>
            <p style={styles.formSubtext}>Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <div style={styles.inputContainer}>
                <div style={styles.inputIcon}>📧</div>
                <input
                  style={{
                    ...styles.input,
                    ...(email ? styles.inputFilled : {})
                  }}
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.target.style.borderColor = email ? '#10b981' : '#d1d5db'}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.inputContainer}>
                <div style={styles.inputIcon}>🔒</div>
                <input
                  style={{
                    ...styles.input,
                    ...(password ? styles.inputFilled : {})
                  }}
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.target.style.borderColor = password ? '#10b981' : '#d1d5db'}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.inputContainer}>
                <div style={styles.inputIcon}>👤</div>
                <select
                  style={styles.select}
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.target.style.borderColor = role ? '#10b981' : '#d1d5db'}
                  required
                >
                  <option value="" disabled>Select the role</option>
                  <option value="Student">🎓 Student</option>
                  <option value="Teacher">👨‍🏫 Teacher</option>
                  <option value="Admin">⚙️ Admin</option>
                </select>
              </div>
            </div>

            <div style={styles.forgotPasswordContainer}>
              <a 
                href="#" 
                style={styles.forgotLink}
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotPassword(true);
                }}
              >
                🔗 Forgot your password?
              </a>
            </div>
            
            {error && <div style={styles.errorMessage}>{error}</div>}

            <div style={styles.buttonContainer}>
              <button 
                type="submit" 
                style={{
                  ...styles.loginButton,
                  opacity: isLoading ? 0.8 : 1,
                  transform: isLoading ? 'scale(0.98)' : 'scale(1)',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                disabled={isLoading}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.background = 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.background = 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
                  }
                }}
              >
                <span style={styles.buttonContent}>
                  {isLoading ? (
                    <>
                      <div style={styles.spinner}></div>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Login</span>
                    </>
                  )}
                </span>
              </button>
            </div>
            
            <div style={styles.signUpText}>
              Don't have an account yet? 
              <a href="/signup" style={styles.signUpLink}> ✨ Sign up here</a>
            </div>
          </form>
        </div>
      </div>
      
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>🔐 Reset Your Password</h3>
              <button 
                style={styles.closeButton}
                onClick={closeForgotPasswordModal}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
                  e.target.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6b7280';
                }}
              >
                ✕
              </button>
            </div>
            
            <p style={styles.modalDescription}>
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            
            <form onSubmit={handleForgotPassword} style={styles.modalForm}>
              <div style={styles.inputGroup}>
                <div style={styles.inputContainer}>
                  <div style={styles.inputIcon}>📧</div>
                  <input
                    style={{
                      ...styles.input,
                      ...(forgotEmail ? styles.inputFilled : {})
                    }}
                    type="email"
                    placeholder="Enter your email address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                    onBlur={(e) => e.target.style.borderColor = forgotEmail ? '#10b981' : '#d1d5db'}
                    required
                  />
                </div>
              </div>
              
              {forgotPasswordError && (
                <div style={styles.errorMessage}>
                  {forgotPasswordError}
                </div>
              )}
              
              {forgotPasswordMessage && (
                <div style={styles.successMessage}>
                  {forgotPasswordMessage}
                </div>
              )}
              
              <div style={styles.modalButtonContainer}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={closeForgotPasswordModal}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(107, 114, 128, 0.2)';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    ...styles.resetButton,
                    opacity: isSendingReset ? 0.8 : 1,
                    cursor: isSendingReset ? 'not-allowed' : 'pointer'
                  }}
                  disabled={isSendingReset}
                  onMouseEnter={(e) => {
                    if (!isSendingReset) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSendingReset) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.3)';
                    }
                  }}
                >
                  {isSendingReset ? (
                    <>
                      <div style={styles.spinner}></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>📨</span>
                      <span>Send Reset Link</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
    margin: 0,
    padding: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite',
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  
  '@keyframes gradientShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' }
  },
  
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  
  shape1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
    filter: 'blur(1px)',
    animation: 'float 6s ease-in-out infinite',
  },
  
  shape2: {
    position: 'absolute',
    bottom: '15%',
    right: '15%',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'linear-gradient(-45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
    filter: 'blur(1px)',
    animation: 'float 8s ease-in-out infinite reverse',
  },
  
  shape3: {
    position: 'absolute',
    top: '60%',
    left: '5%',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
    filter: 'blur(1px)',
    animation: 'float 10s ease-in-out infinite',
  },
  
  leftPanel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(30, 64, 175, 0.8) 100%)',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    zIndex: 2,
    height: '100vh',
    overflow: 'hidden',
  },
  
  brandingContent: {
    textAlign: 'center',
    color: 'white',
    maxWidth: '500px',
  },
  
  rightPanel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    height: '100vh',
    overflow: 'auto',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 2,
  },
  
  loginBox: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '3rem 2.5rem',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2)',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.2)',
    position: 'relative',
    zIndex: 2,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  
  logoContainer: {
    margin: '0 auto 2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  logoBackground: {
    width: '120px',
    height: '120px',
    borderRadius: '30px',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    animation: 'pulse 2s ease-in-out infinite',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  },
  
  logoImage: {
    width: '60px',
    height: '60px',
    filter: 'brightness(0) invert(1)',
    transition: 'transform 0.3s ease',
  },
  
  logoFallback: {
    width: '60px',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '2.5rem',
    fontWeight: '900',
    color: 'white',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  
  brandingText: {
    marginBottom: '3rem',
  },
  
  brandTitle: {
    fontSize: '4rem',
    fontWeight: '900',
    margin: '0 0 1rem',
    letterSpacing: '4px',
    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
    color: 'white',
  },
  
  brandSubtitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: '0 0 1.5rem',
    opacity: '0.9',
    color: 'white',
  },
  
  brandDescription: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    opacity: '0.8',
    marginBottom: '0',
    color: 'white',
  },
  
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    alignItems: 'center',
  },
  
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 2rem',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    minWidth: '250px',
    transition: 'transform 0.3s ease, background 0.3s ease',
  },
  
  featureIcon: {
    fontSize: '1.5rem',
  },
  
  featureText: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'white',
  },
  
  titleContainer: {
    marginBottom: '2rem',
  },
  
  title: {
    fontWeight: '800',
    fontSize: '2rem',
    margin: '0 0 0.5rem',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    letterSpacing: '2px',
  },
  
  subtitle: {
    color: '#4b5563',
    fontSize: '0.9rem',
    margin: 0,
    fontWeight: '500',
  },
  
  form: {
    textAlign: 'left',
  },
  
  welcomeText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  
  inputGroup: {
    marginBottom: '1.5rem',
  },
  
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  
  inputIcon: {
    position: 'absolute',
    left: '16px',
    fontSize: '1.2rem',
    zIndex: 1,
    color: '#374151',
  },
  
  input: {
    width: '100%',
    padding: '16px 16px 16px 50px',
    borderRadius: '12px',
    border: '2px solid #d1d5db',
    fontSize: '1rem',
    fontWeight: '500',
    backgroundColor: 'rgba(255,255,255,0.95)',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#111827',
  },
  
  inputFilled: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  
  select: {
    width: '100%',
    padding: '16px 16px 16px 50px',
    borderRadius: '12px',
    border: '2px solid #d1d5db',
    fontSize: '1rem',
    fontWeight: '500',
    backgroundColor: 'rgba(255,255,255,0.95)',
    transition: 'all 0.3s ease',
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
    backgroundPosition: 'right 16px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    paddingRight: '50px',
    color: '#111827',
  },
  
  forgotPasswordContainer: {
    textAlign: 'right',
    marginBottom: '2rem',
  },
  
  forgotLink: {
    fontSize: '0.9rem',
    color: '#3B82F6',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.3s ease',
  },
  
  buttonContainer: {
    marginBottom: '2rem',
  },
  
  loginButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 0',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  signUpText: {
    fontSize: '0.95rem',
    color: '#4b5563',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  signUpLink: {
    color: '#3B82F6',
    textDecoration: 'none',
    fontWeight: '700',
    transition: 'color 0.3s ease',
  },
  
  errorMessage: {
    color: '#b91c1c',
    backgroundColor: 'rgba(185, 28, 28, 0.1)',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: '600',
    border: '1px solid rgba(185, 28, 28, 0.25)',
    boxShadow: '0 4px 12px rgba(185, 28, 28, 0.1)',
    animation: 'slideIn 0.3s ease',
  },
  
  successMessage: {
    color: '#059669',
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: '600',
    border: '1px solid rgba(5, 150, 105, 0.25)',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.1)',
    animation: 'slideIn 0.3s ease',
  },
  
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
    animation: 'fadeIn 0.3s ease',
  },
  
  modalContent: {
    background: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '20px',
    padding: '2rem',
    width: '90%',
    maxWidth: '450px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(20px)',
    animation: 'modalSlideIn 0.3s ease',
    position: 'relative',
  },
  
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
  
  modalTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  },
  
  modalDescription: {
    color: '#6b7280',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  modalButtonContainer: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  
  cancelButton: {
    flex: 1,
    background: 'rgba(107, 114, 128, 0.1)',
    color: '#374151',
    border: '2px solid #d1d5db',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  resetButton: {
    flex: 1,
    background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
  },
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes modalSlideIn {
    from { 
      opacity: 0; 
      transform: scale(0.95) translateY(-20px); 
    }
    to { 
      opacity: 1; 
      transform: scale(1) translateY(0); 
    }
  }
`;
document.head.appendChild(styleSheet);

export default LoginForm;
