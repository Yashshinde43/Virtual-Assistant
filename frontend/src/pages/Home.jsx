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
            if (!recognitionRef.current) return;
            
            // Check if already running or speaking
            if (isRecogntionRef.current || isSpeakingRef.current) {
                return;
            }

            // Check if recognition is already active (with fallback for browsers that don't support state)
            try {
                if (recognitionRef.current.state && 
                    (recognitionRef.current.state === 'running' || recognitionRef.current.state === 'starting')) {
                    return;
                }
            } catch (e) {
                // State property might not be available in all browsers, continue
            }

            recognitionRef.current.start();
            setListening(true);
        } catch (error) {
            // Handle specific error types
            if (error.name === 'InvalidStateError') {
                // Recognition is already running, ignore
                return;
            } else if (error.name === 'NotAllowedError') {
                console.warn("Microphone permission denied");
            } else if (error.name === 'NoSpeechError') {
                // No speech detected, will retry automatically
                return;
            } else {
                console.log("Recognition Error: ", error);
            }
        }
    }

    const speak = (text) => {
        if (!text || text.trim() === '') return;
        
        // Stop recognition before speaking
        try {
            if (recognitionRef.current && isRecogntionRef.current) {
                recognitionRef.current.stop();
                isRecogntionRef.current = false;
                setListening(false);
            }
        } catch (error) {
            console.warn("Error stopping recognition:", error);
        }

        // Cancel any ongoing speech
        synth.cancel();
        
        // Wait a bit for cancellation to complete
        setTimeout(() => {
            const utterence = new SpeechSynthesisUtterance(text);
            isSpeakingRef.current = true;
            
            utterence.onend = () => {
                setAiText("")
                isSpeakingRef.current = false;
                
                // Wait a bit longer before restarting recognition
                setTimeout(() => {
                    startRecognition();
                }, 1500);
            }
            
            utterence.onerror = (event) => {
                console.warn("Speech synthesis error:", event);
                isSpeakingRef.current = false;
                setAiText("");
                // Restart recognition even if speech fails
                setTimeout(() => {
                    startRecognition();
                }, 1000);
            }
            
            synth.speak(utterence);
        }, 200);
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





        // Initial recognition start with better error handling
        const startTimeOut = setTimeout(() => {
            if (isMounted && !isSpeakingRef.current && !isRecogntionRef.current) {
                try {
                    // Check if recognition is already running (with fallback)
                    let canStart = true;
                    try {
                        if (recognition.state === 'running' || recognition.state === 'starting') {
                            canStart = false;
                        }
                    } catch (e) {
                        // State property might not be available, continue
                    }
                    
                    if (canStart) {
                        recognition.start();
                        console.log("Recognition request Started");
                    }
                } catch (error) {
                    if (error.name === "InvalidStateError") {
                        // Already running, ignore
                        return;
                    } else if (error.name === "NotAllowedError") {
                        console.error("Microphone permission denied. Please allow microphone access.");
                    } else {
                        console.log("Start Error: ", error);
                    }
                }
            }
        }, 1500); // Increased delay for better initialization


        recognition.onstart = () => {
            console.log('Recognition started');
            isRecogntionRef.current = true;
            setListening(true);
        }
        
        recognition.onend = () => {
            console.log('Recognition ended');
            isRecogntionRef.current = false;
            setListening(false);
            
            // Only restart if component is mounted, not speaking, and recognition was not manually stopped
            if (isMounted && !isSpeakingRef.current) {
                // Add a delay to prevent immediate restart issues
                setTimeout(() => {
                    if (isMounted && !isSpeakingRef.current && !isRecogntionRef.current) {
                        try {
                            // Double-check state before starting (with fallback)
                            let canStart = true;
                            try {
                                if (recognition.state === 'running' || recognition.state === 'starting') {
                                    canStart = false;
                                }
                            } catch (e) {
                                // State property might not be available, continue
                            }
                            
                            if (canStart) {
                                recognition.start();
                                console.log("Recognition auto-restarted");
                            }
                        } catch (error) {
                            // Only log non-expected errors
                            if (error.name !== 'InvalidStateError') {
                                console.log("Recognition restart error: ", error);
                            }
                        }
                    }
                }, 1500); // Increased delay for better stability
            }
        }

        recognition.onerror = (event) => {
            console.warn("Recognition error: ", event.error);
            isRecogntionRef.current = false;
            setListening(false);
            
            // Handle different error types
            if (event.error === "aborted") {
                // Recognition was manually stopped, don't restart
                return;
            } else if (event.error === "not-allowed") {
                // Permission denied, don't keep trying
                console.error("Microphone permission denied. Please allow microphone access.");
                return;
            } else if (event.error === "no-speech") {
                // No speech detected, can retry
                if (isMounted && !isSpeakingRef.current) {
                    setTimeout(() => {
                        if (isMounted && !isSpeakingRef.current && !isRecogntionRef.current) {
                            try {
                                let canStart = true;
                                try {
                                    if (recognition.state === 'running' || recognition.state === 'starting') {
                                        canStart = false;
                                    }
                                } catch (e) {
                                    // State might not be available
                                }
                                
                                if (canStart) {
                                    recognition.start();
                                }
                            } catch (error) {
                                if (error.name !== 'InvalidStateError') {
                                    console.log("Recognition restart after no-speech error: ", error);
                                }
                            }
                        }
                    }, 2000);
                }
                return;
            } else if (event.error === "network") {
                // Network error, wait longer before retry
                if (isMounted && !isSpeakingRef.current) {
                    setTimeout(() => {
                        if (isMounted && !isSpeakingRef.current && !isRecogntionRef.current) {
                            try {
                                let canStart = true;
                                try {
                                    if (recognition.state === 'running' || recognition.state === 'starting') {
                                        canStart = false;
                                    }
                                } catch (e) {
                                    // State might not be available
                                }
                                
                                if (canStart) {
                                    recognition.start();
                                }
                            } catch (error) {
                                if (error.name !== 'InvalidStateError') {
                                    console.log("Recognition restart after network error: ", error);
                                }
                            }
                        }
                    }, 3000);
                }
                return;
            }
            
            // For other errors, try to restart after a delay
            if (isMounted && !isSpeakingRef.current) {
                setTimeout(() => {
                    if (isMounted && !isSpeakingRef.current && !isRecogntionRef.current) {
                        try {
                            let canStart = true;
                            try {
                                if (recognition.state === 'running' || recognition.state === 'starting') {
                                    canStart = false;
                                }
                            } catch (e) {
                                // State might not be available
                            }
                            
                            if (canStart) {
                                recognition.start();
                                console.log("Recognition restarted after error");
                            }
                        } catch (error) {
                            if (error.name !== 'InvalidStateError') {
                                console.log("Recognition Error: ", error);
                            }
                        }
                    }
                }, 2000);
            }
        }

        recognition.onresult = async (event) => {
            try {
                const transcript = event.results[event.results.length - 1][0].transcript.trim();
                
                if (!transcript || transcript.length === 0) {
                    return;
                }
                
                if (transcript.toLowerCase().includes(user.assistantName.toLowerCase())) {
                    // Stop recognition immediately to prevent multiple triggers
                    isRecogntionRef.current = false;
                    setListening(false);
                    
                    try {
                        recognition.stop();
                    } catch (error) {
                        console.warn("Error stopping recognition:", error);
                    }
                    
                    setUserText(transcript);
                    setAiText("");
                    
                    try {
                        const data = await geminiResponse(transcript);
                        
                        if (data && data.response) {
                            handleCommand(data);
                            setAiText(data.response);
                        } else {
                            console.warn("Invalid response from Gemini:", data);
                            setAiText("Sorry, I couldn't process that request.");
                        }
                    } catch (error) {
                        console.error("Error processing command:", error);
                        setAiText("Sorry, I encountered an error processing your request.");
                    } finally {
                        // Clear user text after processing
                        setTimeout(() => {
                            setUserText("");
                        }, 1000);
                    }
                }
            } catch (error) {
                console.error("Error in recognition.onresult:", error);
            }
        }


        const unlockAudio = () => {
            try {
                // Resume AudioContext
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === "suspended") {
                    audioCtx.resume().then(() => {
                        console.log("Audio context resumed");
                    }).catch(err => {
                        console.warn("Failed to resume audio context:", err);
                    });
                }

                // Clear blocked speech queue (just in case)
                window.speechSynthesis.cancel();
                
                // Try to get microphone permission by starting recognition briefly
                // This helps with browsers that require user interaction
                if (recognition && !isRecogntionRef.current && !isSpeakingRef.current) {
                    setTimeout(() => {
                        try {
                            if (recognition.state !== 'running' && recognition.state !== 'starting') {
                                recognition.start();
                                setTimeout(() => {
                                    try {
                                        recognition.stop();
                                    } catch (e) {
                                        // Ignore stop errors
                                    }
                                }, 100);
                            }
                        } catch (e) {
                            // Ignore - permission might not be granted yet
                        }
                    }, 100);
                }
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