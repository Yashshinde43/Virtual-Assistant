import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import { UserDataContext } from './context/UserContext'
import Customize from './pages/Customize'
import Home from './pages/home'
import Customize2 from './pages/Customize2'


const App = () => {
  const { user, setUser } = useContext(UserDataContext);
  return (
    <Routes>
      <Route path="/" element={user?.assistantName && user?.assistantImage ? <Home /> : <Navigate to="/customize" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to={"/"} />} />
      <Route path="/signin" element={!user ? <Signin /> : <Navigate to={"/"} />} />
      <Route path="/customize" element={user ? <Customize /> : <Navigate to={"/signup"}/>} />
      <Route path="/customize2" element={user ? <Customize2 /> : <Navigate to={"/signin"}/>} />
    </Routes>
  )
}

export default App  
