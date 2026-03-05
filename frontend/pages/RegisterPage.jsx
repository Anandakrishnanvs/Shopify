import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) {
      toast.success('Account created successfully!');
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Join SHOPIFY</h1>
          <p className="text-gray-500 font-medium">Create an account to start shopping.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-900 text-xs font-black uppercase tracking-widest mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
              id="name"
              type="text"
              placeholder="Enter ur name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-900 text-xs font-black uppercase tracking-widest mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
              id="email"
              type="email"
              placeholder="enter a valid gmail id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-900 text-xs font-black uppercase tracking-widest mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">Must be at least 8 characters</p>
          </div>

          <div className="pt-2">
            <button
              className="w-full bg-blue-800 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-800/20 disabled:bg-blue-300 active:scale-95"
              type="submit"
              disabled={loading}
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </div>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs font-black uppercase tracking-widest">
            <span className="px-4 bg-white text-gray-400">Or sign up with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button className="flex items-center justify-center py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
            Google
          </button>
          <button className="flex items-center justify-center py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm gap-2">
            <svg className="w-5 h-5 text-blue-600 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            Facebook
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm font-bold">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-8">
          By joining, you agree to our <span className="text-gray-600 underline">Terms of Service</span> and <span className="text-gray-600 underline">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;