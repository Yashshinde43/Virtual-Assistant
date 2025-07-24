import React, { useContext, useState } from 'react';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
  const { user, selectedImage, serverUrl,setUser } = useContext(UserDataContext);
  console.log("This is selected image", selectedImage)
  const [assistantName, setAssistantName] = useState(user.assistantName || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateuser();
  };
  const handleUpdateuser = async () => {
    setLoading(true);
    try {
      let formdata = new FormData();
      formdata.append("assistantName", assistantName);
      if (selectedImage.type === "upload") {
        formdata.append("assistantImage", selectedImage.file);
      }else{
        formdata.append("assistantImage", selectedImage.url);
      }

      const response = await axios.post(`${serverUrl}/api/user/update`, formdata, {
        withCredentials: true,
      });
      console.log(response);
      setUser(response.data);
      navigate("/");
    }
    catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] px-2 py-8">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-md relative">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-extrabold text-center text-cyan-400 mb-2 tracking-wide drop-shadow-[0_0_8px_#00d8ff]">
            Name Your Assistant
          </h2>
          <p className="text-gray-300 text-sm text-center">Give your new virtual assistant a unique name.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              name="assistantName"
              id="assistantName"
              autoComplete="off"
              value={assistantName}
              onChange={e => setAssistantName(e.target.value)}
              required
              className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-400 text-white placeholder-transparent focus:outline-none focus:border-[#00d8ff] transition-all"
              placeholder="Assistant Name"
            />
            <label
              htmlFor="assistantName"
              className="absolute left-4 -top-5 text-sm text-[#00d8ff] pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-[#00d8ff]"
            >
              Assistant Name
            </label>
          </div>
          <div className="flex justify-center items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/customize')}
              className="px-8 py-3 rounded-full text-slate-300 font-bold text-lg hover:text-white hover:bg-white/10 border-2 border-slate-600 hover:border-slate-500 transition-all duration-200"
              aria-label="Go Back"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#00d8ff] to-[#0077ff] text-white font-bold text-lg shadow-xl hover:from-[#0077ff] hover:to-[#00d8ff] focus:outline-none focus:ring-2 focus:ring-[#00d8ff] focus:ring-offset-2 drop-shadow-[0_0_16px_#00d8ff] transition-all duration-200 hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed"
              aria-label="Finish Setup"
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              {loading ? "Saving..." : "Finish Setup"}
            </button>
          </div>
        </form>
        {/* Neon border effect */}
        <div className="absolute -inset-1 rounded-2xl pointer-events-none border-2 border-[#00d8ff] opacity-30 blur-xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default Customize2;