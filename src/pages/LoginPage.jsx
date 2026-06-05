/**
 * LoginPage
 * 
 * Combined Login / Sign Up page with email & password authentication.
 * Features a modern split-screen layout with gradient branding.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Wallet, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Validates form inputs.
   */
  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (isSignUp && password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  /**
   * Handles form submission for login or sign up.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      if (isSignUp) {
        await signup(email, password);
        toast.success('Account created successfully!');
      } else {
        await login(email, password);
        toast.success('Welcome back!');
      }
      navigate('/');
    } catch (err) {
      console.error('Auth error:', err);
      const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered',
        'auth/invalid-credential': 'Invalid email or password',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/too-many-requests': 'Too many attempts. Try again later',
        'auth/invalid-email': 'Invalid email address',
      };
      toast.error(errorMessages[err.code] || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles Google authentication.
   */
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Welcome!');
      navigate('/');
    } catch (err) {
      console.error('Google Sign-In error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        toast.error('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (field) =>
    `w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
      errors[field]
        ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-400'
        : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
    }`;

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ExpenseFlow</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Manage your expenses
            <br />
            <span className="text-indigo-200">with ease.</span>
          </h1>

          <p className="text-indigo-200 text-lg max-w-md">
            Track, submit, and manage all your business expenses in one beautiful dashboard.
          </p>

          {/* Feature list */}
          <div className="mt-10 space-y-4">
            {[
              'Submit & track expenses instantly',
              'Upload receipts and bills',
              'Approval workflow management',
              'Real-time dashboard analytics',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-indigo-100">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-md">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              ExpenseFlow
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {isSignUp
                  ? 'Sign up to start managing your expenses'
                  : 'Sign in to your account to continue'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClasses('email')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClasses('password')}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-rose-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password (sign up only) */}
              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={inputClasses('confirmPassword')}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-rose-500">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 disabled:opacity-50 transition-all duration-300 mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-500 font-semibold tracking-wide">Or continue with</span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-2.5 w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl shadow-sm hover:shadow-md disabled:opacity-50 transition-all duration-300"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.89 3.02C6.21 7.56 8.9 5.04 12 5.04z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.71-4.92 3.71-8.6z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.54c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.39 7.56C.5 9.35 0 11.35 0 12.46s.5 3.11 1.39 4.9l3.89-3.02L5.28 14.54z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1-3.1 0-5.79-2.52-6.72-5.54l-3.89 3.02C3.37 20.33 7.35 23 12 23z"
                  />
                </svg>
              )}
              <span>{isSignUp ? 'Sign Up with Google' : 'Sign In with Google'}</span>
            </button>

            {/* Toggle sign-up / sign-in */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrors({});
                  }}
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
