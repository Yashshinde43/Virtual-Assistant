import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSettingsOutline, IoLogOutOutline, IoCloseOutline } from 'react-icons/io5';
import { UserDataContext } from '../context/UserContext';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const [showHistory, setShowHistory] = useState(false);
    const { user, setUser } = useContext(UserDataContext);
    const navigate = useNavigate();
    const logout = async () => {
        try {
            const response  = await axios.get(`${serverUrl}/api/auth/signout`, {
                withCredentials: true,
            });
            setUser(null);
            console.log("Logout Successful ", response);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 z-10 transition-opacity duration-300 lg:hidden ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            />
            <aside
                className={
                    `fixed top-0 left-0 h-full bg-gray-800 bg-opacity-100 backdrop-blur-md text-white w-64 p-5 z-20 ` +
                    `transform transition-transform duration-300 ease-in-out ` +
                    `${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ` +
                    `lg:translate-x-0`
                }
            >
                
                <h2 className='text-2xl font-bold mb-8 text-gray-200'>V-Assistant</h2>
                <nav>
                    <ul>
                        <li className='mb-4'>
                            <Link to="/customize" className='flex items-center p-2 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200'>
                                <IoSettingsOutline className="mr-3" />
                                Customize
                            </Link>
                        </li>
                        <li>
                            <button className='flex items-center p-2 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200'>
                                <IoLogOutOutline className="mr-3" onClick={ ()=>{logout()}} />
                                Logout
                            </button>
                        </li>
                        {/* here add a button */}
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
                                    {user.history && user.history.length > 0 ? (
                                        <ul className="space-y-2">
                                            {user.history.map((item, idx) => (
                                                <li key={idx} className="bg-gray-50 px-4 py-3 rounded flex items-start gap-2 text-gray-800 text-sm break-words border border-gray-200 border-l-4 border-l-gray-400 shadow-sm">
                                                    <span className="mt-0.5 text-gray-400">💬</span>
                                                    <span className="flex-1">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-gray-500 text-center">No history yet.</div>
                                    )}
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