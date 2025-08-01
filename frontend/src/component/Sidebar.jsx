import React, { useContext, useState, lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSettingsOutline, IoLogOutOutline } from 'react-icons/io5';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';

const LazyHistoryList = lazy(() => import('./HistoryList')); // lazy load

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const [showHistory, setShowHistory] = useState(false);
    const {  setUser, serverUrl } = useContext(UserDataContext);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState('');
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/auth/signout`, {
                withCredentials: true,
            });
            setUser(null);
            navigate('/signin');
            console.log("Logout Successful ", response);
        } catch (error) {
            console.log(error);
        }
<<<<<<< HEAD
    }

    const handleToggleHistory = async () => {
        const willShow = !showHistory;
        setShowHistory(willShow);

        if (willShow && history.length === 0) {
            setHistoryLoading(true);
            setHistoryError('');
            try {
                // NOTE: This assumes a backend endpoint at /api/user/history that returns { history: [...] }
                // This endpoint might need to be created.
                const response = await axios.get(`${serverUrl}/api/user/history`, {
                    withCredentials: true,
                });
                setHistory(response.data.history);
            } catch (error) {
                console.error("Failed to fetch history:", error);
                setHistoryError(error.response?.data?.message || "Failed to load history.");
            } finally {
                setHistoryLoading(false);
            }
        }
    }
=======
    };

>>>>>>> c5f767c0e86e5bdfd07fe1fd006f8995b8498ca8
    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 z-10 transition-opacity duration-300 lg:hidden ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            />
            <aside
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 p-5 z-20 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            >
                <h2 className='text-2xl font-bold mb-8 text-gray-200'>V-Assistant</h2>
                <nav>
                    <ul>
                        <li className='mb-4'>
                            <Link to="/customize" className='flex items-center p-2 rounded-lg hover:bg-gray-700 transition'>
                                <IoSettingsOutline className="mr-3" />
                                Customize
                            </Link>
                        </li>
                        <li>
                            <button
                                className='flex items-center p-2 rounded-lg hover:bg-gray-700 transition'
                                onClick={logout}
                            >
                                <IoLogOutOutline className="mr-3" />
                                Logout
                            </button>
                        </li>
                        <div className="mt-4">
                            <button
                                className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow transition mb-2 border border-gray-600 flex items-center justify-between"
                                onClick={handleToggleHistory}
                            >
                                <span>{showHistory ? 'Hide History' : 'Show History'}</span>
                                <span className="ml-2">{showHistory ? '▲' : '▼'}</span>
                            </button>
                            {showHistory && (
                                <div className="bg-gray-100 rounded-lg shadow-inner p-4 max-h-60 overflow-y-auto border border-gray-200 animate-fadeIn">
<<<<<<< HEAD
                                    {historyLoading ? (
                                        <div className="text-gray-500 text-center">Loading history...</div>
                                    ) : historyError ? (
                                        <div className="text-red-500 text-center">{historyError}</div>
                                    ) : history.length > 0 ? (
                                        <ul className="space-y-2">
                                            {history.map((item, idx) => (
                                                <li key={idx} className="bg-gray-50 px-4 py-3 rounded flex items-start gap-2 text-gray-800 text-sm break-words border border-gray-200 border-l-4 border-l-gray-400 shadow-sm">
                                                    <span className="mt-0.5 text-gray-400">💬</span>
                                                    <span className="flex-1">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-gray-500 text-center">No history found.</div>
                                    )}
=======
                                    <Suspense fallback={<div className="text-center text-gray-400">Loading history...</div>}>
                                        <LazyHistoryList history={user.history} />
                                    </Suspense>
>>>>>>> c5f767c0e86e5bdfd07fe1fd006f8995b8498ca8
                                </div>
                            )}
                        </div>
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
