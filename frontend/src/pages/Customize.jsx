import React, { useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const assistantImages = [
  "https://randomuser.me/api/portraits/men/1.jpg",
  "https://randomuser.me/api/portraits/women/2.jpg",
  "https://randomuser.me/api/portraits/men/3.jpg",
  "https://randomuser.me/api/portraits/women/4.jpg",
  "https://randomuser.me/api/portraits/men/5.jpg",
  "https://randomuser.me/api/portraits/women/6.jpg",
];

const Customize = () => {
  const { selectedImage, setSelectedImage } = useContext(UserDataContext);

  const navigate = useNavigate();

  const handlePresetImageClick = (imgUrl) => {
    setSelectedImage({
      type: "preset",
      url: imgUrl,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
   
    if (file) {
      console.log(URL.createObjectURL(file));
      setSelectedImage({
        type: "upload",
        file
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] px-2 py-8">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-md relative">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-extrabold text-center text-cyan-400 mb-2 tracking-wide drop-shadow-[0_0_8px_#00d8ff]">
            Choose Your Assistant's Avatar
          </h2>
          <p className="text-gray-300 text-sm text-center">Pick a look for your virtual assistant</p>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8">
          {assistantImages.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetImageClick(imgUrl)}
              className={`group focus:outline-none rounded-full transition-all duration-200 border-2 
                ${selectedImage?.type === "preset" && selectedImage?.url === imgUrl
                  ? "border-cyan-400 ring-2 ring-cyan-300 scale-105"
                  : "border-white/20 hover:border-cyan-500 hover:scale-105"}
                bg-slate-900 shadow-lg w-full flex items-center justify-center`}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") handlePresetImageClick(imgUrl);
              }}
              aria-label={`Select avatar ${idx + 1}`}
            >
              <img
                src={imgUrl}
                alt={`Assistant ${idx}`}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover group-hover:brightness-110 group-hover:shadow-cyan-400/30 group-hover:shadow-xl transition-all duration-200"
              />
            </button>
          ))}
        </div>
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/20" />
          <span className="mx-4 text-gray-400 font-semibold tracking-wider text-xs sm:text-sm uppercase">or</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>
        <label className="block w-full text-center">
          <span className="inline-block px-6 py-2 bg-[#00d8ff] hover:bg-[#0077ff] text-white font-bold rounded-xl shadow-lg cursor-pointer transition-all duration-200 tracking-wide text-base sm:text-lg">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </span>
        </label>
        <div className="mt-8 sm:mt-10 text-center">
          <div className="font-semibold text-gray-200 mb-3 text-base sm:text-lg tracking-wide">
            Selected Image Preview
          </div>
          {selectedImage?.type === "preset" && (
            <img
              src={selectedImage.url}
              alt="Selected"
              className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full border-4 border-cyan-400 shadow-xl shadow-cyan-400/20 bg-slate-900 object-cover animate-fade-in"
            />
          )}
          {selectedImage?.type === "upload" && (
            <img
              src={URL.createObjectURL(selectedImage.file)}
              alt="Selected"
              className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full border-4 border-cyan-400 shadow-xl shadow-cyan-400/20 bg-slate-900 object-cover animate-fade-in"
            />
          )}
          {!selectedImage && (
            <div className="text-gray-400 text-base mt-4 animate-pulse">
              No image selected
            </div>
          )}
          {selectedImage && (
            <div className="flex justify-center mt-8">
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#00d8ff] to-[#0077ff] text-white font-bold text-lg shadow-xl hover:from-[#0077ff] hover:to-[#00d8ff] focus:outline-none focus:ring-2 focus:ring-[#00d8ff] focus:ring-offset-2 drop-shadow-[0_0_16px_#00d8ff] transition-all duration-200 hover:scale-105"
                onClick={() => {
                  console.log(selectedImage)
                  navigate("/customize2")
                }
                }
                aria-label="Next"
              >
                Next
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          )}

        </div>
        {/* Neon border effect */}
        <div className="absolute -inset-1 rounded-2xl pointer-events-none border-2 border-[#00d8ff] opacity-30 blur-xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default Customize;