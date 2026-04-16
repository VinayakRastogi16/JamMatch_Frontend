import React from 'react'
import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Feed from './pages/Feed';
import Profile from './pages/ProfileForm';
import Navbar from './NavBar';
import Jam from './pages/Jam';
import { useState } from 'react';
import Protected from './utils/Protected.utils';
import Chat from './components/SideChat';

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
}

function AppComponent({isSignedIn, setIsSignedIn}){
  const location = useLocation();
  const hideNav = location.pathname.startsWith("/messages")||location.pathname.startsWith("/jam")

  return(
    <>
    {!hideNav && <Navbar isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn}/>}
      <Routes>
        <Route path='/' element={<Login setIsSignedIn={setIsSignedIn} />} />
        <Route path='/signup' element={<SignUp setIsSignedIn={setIsSignedIn} />} />
        <Route path='/feed' element={<Protected><Feed /></Protected>} />
        <Route path='/details' element={<Protected allowIncomplete={true}><Profile /></Protected>} />
        <Route path='/jam/:id' element={<Protected><Jam /></Protected>} />
        <Route path='/messages' element={<Protected><Chat /></Protected>} />
      </Routes>

    </>
  )
}


function App() {

const [isSignedIn, setIsSignedIn] = useState(getIsSignedIn);
  return (
  
  <BrowserRouter>
    <AppComponent isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn}/>
  </BrowserRouter>
  )
}


export default App;
