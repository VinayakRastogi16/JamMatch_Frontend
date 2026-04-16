import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Feed from './pages/Feed';
import Profile from './pages/ProfileForm';
import Navbar from './NavBar';
import Jam from './pages/Jam';
import { useState } from 'react';
import Protected from './utils/Protected.utils';
function App() {

  const getIsSignedIn = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) return false;

    // Check if token is expired
    const payload = JSON.parse(atob(user.token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("user"); // clear expired token
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

const [isSignedIn, setIsSignedIn] = useState(getIsSignedIn);
  return (
  
  <BrowserRouter>
  <Navbar isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn}/>
  <Routes>

    <Route path='/' element={<Login setIsSignedIn={setIsSignedIn}/>}></Route>
    <Route path='/signup' element={<SignUp setIsSignedIn={setIsSignedIn}/>}></Route>
    <Route path='/feed' element={<Protected><Feed/></Protected>}></Route>
    <Route path='/details' element={<Protected allowIncomplete={true}><Profile/></Protected>}></Route>
    <Route path='/jam/:id' element={<Protected isSignedIn={isSignedIn}><Jam/></Protected>}/>
    
  </Routes>
  </BrowserRouter>
  )
}


export default App
