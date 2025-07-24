import React, { useContext, useState } from 'react';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';
const Signin = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { serverUrl, user, setUser } = useContext(UserDataContext);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${serverUrl}/api/auth/signin`, {
         email, password
      }, {
        withCredentials: true
      });
      console.log(response);
      setUser(response.data);
    } catch (error) {
      console.log(error);
      setUser(null);
      navigate('/');
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526]">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-md relative">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wide mb-1 drop-shadow-[0_0_8px_#00d8ff]">Sign in</h1>
          <p className="text-gray-300 text-sm">Join the future. Sign in below.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="off"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-400 text-white placeholder-transparent focus:outline-none focus:border-[#00d8ff] transition-all"
              placeholder="Email"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-3 text-gray-400 text-base pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-[#00d8ff] bg-transparent"
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
              className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-400 text-white placeholder-transparent focus:outline-none focus:border-[#00d8ff] transition-all"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-3 text-gray-400 text-base pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-[#00d8ff] bg-transparent"
            >
              Password
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-lg bg-[#00d8ff] bg-gradient-to-r from-[#00d8ff] to-[#0077ff] text-white font-semibold text-lg shadow-lg hover:from-[#0077ff] hover:to-[#00d8ff] transition-all focus:outline-none focus:ring-2 focus:ring-[#00d8ff] focus:ring-offset-2 drop-shadow-[0_0_12px_#00d8ff] flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-400 text-sm">Create an account? </span>
          <a href="/signup" className="text-[#00d8ff] hover:underline text-sm">Sign up</a>
        </div>
        {error && <div className="text-red-500 text-sm mt-2 text-center">{error}</div>}
        {/* Neon border effect */}
        <div className="absolute -inset-1 rounded-2xl pointer-events-none border-2 border-[#00d8ff] opacity-30 blur-xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default Signin;