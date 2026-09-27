import React from 'react'
import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Feed from './pages/Feed';
import Profile from './pages/ProfileForm';
import Navbar from './components/NavBar';
import Jam from './pages/Jam';
import { useState } from 'react';
import Protected from './utils/Protected.utils';
import Chat from "./pages/Chat"
import VideoCall from "./pages/VideoCall"
import AudioRoom from './pages/AudioRoom';
import Settings from './pages/Settings';
import VerifyEmail from './pages/VerifyEmail';
import VerifyEmailPending from './pages/VerifyEmailPending';

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
  const hideNav = location.pathname.startsWith("/messages")||location.pathname.startsWith("/jam")||location.pathname.startsWith("/video")||location.pathname.startsWith("/audio1")||location.pathname.startsWith("/verify-email")

  return(
    <>
    {!hideNav && <Navbar isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn}/>}
      <Routes>
        <Route path='/' element={<Login setIsSignedIn={setIsSignedIn} />} />
        <Route path='/signup' element={<SignUp setIsSignedIn={setIsSignedIn} />} />
        <Route path="/verify-email/pending" element={<VerifyEmailPending />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path='/feed' element={<Protected><Feed /></Protected>} />
        <Route path='/details' element={<Protected allowIncomplete={true}><Profile /></Protected>} />
        <Route path='/jam/:id' element={<Protected><Jam /></Protected>} />
        <Route path='/video/:id' element={<Protected><VideoCall /></Protected>} />
        <Route path='/messages' element={<Protected><Chat /></Protected>} />
        <Route path='/messages/:roomId' element={<Protected><Chat /></Protected>} />
        <Route path='/audio1' element={<Protected><AudioRoom /></Protected>} />
        <Route path='/settings' element={<Protected><Settings /></Protected>} />
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
