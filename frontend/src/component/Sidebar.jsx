import React, { useContext, useState, lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSettingsOutline, IoLogOutOutline } from 'react-icons/io5';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';

const LazyHistoryList = lazy(() => import('./HistoryList')); // lazy load

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const [showHistory, setShowHistory] = useState(false);
    const { user, setUser, serverUrl } = useContext(UserDataContext);
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
    };

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
                                onClick={() => setShowHistory((prev) => !prev)}
                            >
                                <span>{showHistory ? 'Hide History' : 'Show History'}</span>
                                <span className="ml-2">{showHistory ? '▲' : '▼'}</span>
                            </button>
                            {showHistory && (
                                <div className="bg-gray-100 rounded-lg shadow-inner p-4 max-h-60 overflow-y-auto border border-gray-200 animate-fadeIn">
                                    <Suspense fallback={<div className="text-center text-gray-400">Loading history...</div>}>
                                        <LazyHistoryList history={user.history} />
                                    </Suspense>
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
