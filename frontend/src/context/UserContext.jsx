import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const serverUrl = "https://virtual-assistant-di2q.onrender.com";
    const [selectedImage, setSelectedImage] = useState(null);

    const geminiResponse = async (command) => {
        try {
            const response = await axios.post(`${serverUrl}/api/user/asktoai`, {
                command
            }, {
                withCredentials: true,
            });
            console.log(response);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    const logout = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/signout`, {
                withCredentials: true,
            });
            setUser(null);
        } catch (error) {
            console.log(error);
        }
    }
    const value = {
        serverUrl, user, setUser, selectedImage, setSelectedImage, logout, geminiResponse
    }
    const handleUser = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/user/current`, {
                withCredentials: true,
            });
            console.log(response);
            setUser(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        handleUser();
    }, []);
    return (
        <div>
            <UserDataContext.Provider value={value}>
                {children}
            </UserDataContext.Provider>
        </div>
    )
}

export default UserContext
