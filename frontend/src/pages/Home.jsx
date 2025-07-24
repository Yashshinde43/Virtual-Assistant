import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserDataContext } from '../context/UserContext';
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5';
import Sidebar from '../component/Sidebar';
import aiImg from '../assets/ai.gif';
import userImg from '../assets/user.gif';

const Home = () => {
    const { user, geminiResponse } = useContext(UserDataContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [pendingUrl, setPendingUrl] = useState(null);
    const [listening, setListening] = useState(false);
    const isSpeakingRef = useRef(false);
    const recognitionRef = useRef(null);
    const [aiText, setAiText] = useState("");
    const [userText, setUserText] = useState("");
    const isRecogntionRef = useRef(false);
    const synth = window.speechSynthesis;

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };



    const startRecognition = () => {
        try {
            if (!isSpeakingRef.current && !isRecogntionRef.current) {
                recognitionRef.current?.start();
                setListening(true);
            }
        } catch (error) {
            if (!error.message.includes("start")) {
                console.log("Recognition Error: ", error);
            }
        }
    }

    const speak = (text) => {
        const utterence = new SpeechSynthesisUtterance(text);
        isSpeakingRef.current = true;
        utterence.onend = () => {
            setAiText("")
            isSpeakingRef.current = false;

            setTimeout(() => {
                startRecognition()
            }, 1000);
        }
        synth.cancel();
        setTimeout(() => {
            synth.speak(utterence);
          }, 100); // Small delay helps mobile
        

    }

    const handleCommand = (data) => {
        const { type, userInput, response } = data;
        speak(response);

        if (type === "google_search") {
            const query = encodeURIComponent(userInput);
            setPendingUrl(`https://www.google.com/search?q=${query}`);

        }
        if (type && type.toLowerCase().includes("calculator")) {
            const query = encodeURIComponent(userInput);
            setPendingUrl(`https://www.google.com/search?q=calculator`);

        }
        if (type === "instagram_open") {
            setPendingUrl(`https://www.instagram.com/`);

        }
        if (type === "facebook_open") {
            setPendingUrl(`https://www.facebook.com/`);

        }
        if (type === "weather_show") {
            setPendingUrl(`https://www.google.com/search?q=weather`);
        }
        if (type === "youtube_search" || type === "youtube_play") {
            const query = encodeURIComponent(userInput);
            setPendingUrl(`https://www.youtube.com/results?search_query=${query}`);
        }

    }


    useEffect(() => {
        const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new speechRecognition();
        recognition.continuous = true;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognitionRef.current = recognition;

        let isMounted = true;





        const startTimeOut = setTimeout(() => {
            if (isMounted && !isSpeakingRef.current && !isRecogntionRef.current) {
                try {
                    recognition.start()
                    console.log("Recognition request Started");
                } catch (error) {
                    if (error.name !== "InvalidStateError") {
                        console.log("Start Error: ", error);
                    }
                }
            }
        }, 1000);


        recognition.onstart = () => {
            console.log('Recognition started');
            isRecogntionRef.current = true;
            setListening(true);
        }
        recognition.onend = () => {
            console.log('Recognition ended');
            isRecogntionRef.current = false;
            setListening(false);
            if (isMounted && !isSpeakingRef.current) {
                setTimeout(() => {
                    if (isMounted) {
                        try {
                            recognition.start();
                            console.log("Recognition started!")
                        } catch (error) {
                            console.log("Recognition Error: ", error);
                        }
                    }
                }, 1000)
            }
        }


        recognition.onerror = (event) => {
            console.warn("Error: ", event);
            isRecogntionRef.current = false;
            setListening(false);
            if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
                setTimeout(() => {
                    if (isMounted) {
                        try {
                            recognition.start();
                            console.log("Recognition started!")
                        } catch (error) {
                            console.log("Recognition Error: ", error);
                        }
                    }
                }, 1000);
            }
        }

        recognition.onresult = async (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            if (transcript.toLowerCase().includes(user.assistantName.toLowerCase())) {
                setUserText(transcript)
                setAiText("")
                isRecogntionRef.current = false;
                setListening(false);
                recognition.stop();
                const data = await geminiResponse(transcript);
                handleCommand(data);
                setAiText(data.response)
                setUserText("")
                console.log("This is data: ", data);
            }

        }


        const unlockAudio = () => {
            try {
                // Resume AudioContext
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === "suspended") {
                    audioCtx.resume();
                }

                // Clear blocked speech queue (just in case)
                window.speechSynthesis.cancel();
            } catch (err) {
                console.warn("Audio unlock failed:", err);
            }

            // Remove the listener after first interaction
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("touchstart", unlockAudio);
        };

        // Listen for first user interaction
        document.addEventListener("click", unlockAudio);
        document.addEventListener("touchstart", unlockAudio);

        return () => {
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("touchstart", unlockAudio);
            isMounted = false;
            clearTimeout(startTimeOut);
            recognition.stop();
            setListening(false);
            isRecogntionRef.current = false;

        }

    }, [])


    return (
        <div className="relative flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans overflow-hidden">
            {/* Overlay and background pattern */}
            <div className="absolute inset-0 bg-black opacity-70"></div>
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')" }}></div>

            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} user={user} />

            <main className={`relative flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
                {/* Header */}
                <header className="flex items-center justify-between p-6 bg-transparent z-30">
                    <div className="flex items-center space-x-4">
                        {/* Hamburger menu: show only on mobile/tablet when sidebar is closed */}
                        {!isSidebarOpen && (
                            <button
                                onClick={toggleSidebar}
                                className="text-gray-400 z-30 lg:hidden focus:outline-none"
                                aria-label="Open sidebar"
                            >
                                <IoMenuOutline size={32} />
                            </button>
                        )}
                        {/* Close icon: show only on mobile/tablet when sidebar is open */}
                        {isSidebarOpen && (
                            <button
                                onClick={toggleSidebar}
                                className="text-gray-400 z-30 lg:hidden focus:outline-none"
                                aria-label="Close sidebar"
                            >
                                <IoCloseOutline size={32} />
                            </button>
                        )}
                        <span
                            className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gray-400 bg-clip-text text-transparent drop-shadow-lg animate-fadeIn px-2 sm:px-4 py-1 sm:py-2 rounded-xl border-2 border-gray-400 shadow-xl flex items-center gap-1 sm:gap-2"
                        >
                            <span role="img" aria-label="robot">🤖</span>
                            I am {user?.assistantName}
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className={`text-sm px-3 py-1 rounded-full font-semibold ${listening ? 'bg-gray-900 text-white border border-gray-400' : 'bg-gray-700 text-gray-300'}`}>{listening ? 'Listening...' : 'Generating'}</span>
                    </div>
                </header>

                {/* Main Content */}
                <section className="flex flex-col items-center justify-center flex-1 py-8 px-4">
                    {/* Assistant Avatar */}
                    <div className="relative mb-8">
                        <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden shadow-xl border-4 border-gray-400 bg-gray-800">
                            <img src={user?.assistantImage} alt={user?.assistantName} className='w-full h-full object-cover' />
                        </div>
                        <div className="absolute inset-0 rounded-full border-4 border-gray-400 opacity-60 animate-pulse pointer-events-none"></div>
                    </div>
                    {/* Chat Area */}
                    <div className="w-full max-w-xl flex flex-col gap-6 items-center">
                        {/* User message */}
                        {userText && (
                            <div className="flex items-center w-full">
                                <img src={userImg} alt="User" className="w-12 h-12 rounded-full border-2 border-gray-400 shadow mr-4" />
                                <div className="bg-gray-800 px-5 py-3 rounded-2xl shadow text-white text-base max-w-xs break-words">
                                    {userText}
                                </div>
                            </div>
                        )}
                        {/* AI message */}
                        {aiText && (
                            <div className="flex items-center w-full justify-end">
                                <div className="bg-gray-900 px-5 py-3 rounded-2xl shadow text-white text-base max-w-xs break-words mr-4">
                                    {aiText}
                                </div>
                                <img src={aiImg} alt="AI" className="w-12 h-12 rounded-full border-2 border-gray-400 shadow" />
                            </div>
                        )}
                        {/* If no chat, show a welcome message */}
                        {!userText && !aiText && (
                            <div className="text-center text-gray-300 text-lg mt-8">
                                Say <span className="text-gray-100 font-bold">{user?.assistantName}</span> to start a conversation!
                            </div>
                        )}
                    </div>
                </section>

                {/* Action Button for pendingUrl */}
                {pendingUrl && (
                    <div className="fixed bottom-6 right-6 z-50">
                        <button
                            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl font-semibold text-lg transition border border-gray-500"
                            onClick={() => {
                                window.open(pendingUrl, "_blank");
                                setPendingUrl(null);
                            }}
                        >
                            Open Link
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;