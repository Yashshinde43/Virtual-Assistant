import React, { useContext, useState } from 'react';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { serverUrl,user, setUser } = useContext(UserDataContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${serverUrl}/api/auth/signup`, {
        name, email, password
      }, {
        withCredentials: true
      });
      console.log(response);
      navigate('/signin');
      setUser(response.data);
      // Optionally, handle success (redirect, show message, etc.)
    } catch (error) {
      console.log(error);
      setUser(null);
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="backdrop-blur-lg bg-white/10 border border-gray-200 rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-md relative">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100 tracking-wide mb-1">Create Account</h1>
          <p className="text-gray-400 text-sm">Join the future. Sign up below.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="relative">
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="off"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-400 text-white placeholder-transparent focus:outline-none focus:border-gray-500 transition-all"
              placeholder="Name"
            />
            <label
              htmlFor="name"
              className="absolute left-4 top-3 text-gray-400 text-base pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-500 bg-transparent"
            >
              Name
            </label>
          </div>
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="off"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-400 text-white placeholder-transparent focus:outline-none focus:border-gray-500 transition-all"
              placeholder="Email"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-3 text-gray-400 text-base pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-500 bg-transparent"
            >
              Email
            </label>
          </div>
          {/* Password Field */}
          <div className="relative">
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="off"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-400 text-white placeholder-transparent focus:outline-none focus:border-gray-500 transition-all"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-3 text-gray-400 text-base pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-500 bg-transparent"
            >
              Password
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-lg bg-gray-800 text-white font-semibold text-lg shadow-lg hover:bg-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-400 text-sm">Already have an account? </span>
          <a href="/signin" className="text-gray-200 hover:underline text-sm">Sign in</a>
        </div>
        {error && <div className="text-red-500 text-sm mt-2 text-center">{error}</div>}
      </div>
      
    </div>
  );
};

export default Signup;