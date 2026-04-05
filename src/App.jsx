import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Feed from './pages/Feed';
import Profile from './pages/ProfileForm';
import Navbar from './NavBar';
import { useState } from 'react';
function App() {

  const [isSignedIn, setIsSignedIn] = useState(
    !!localStorage.getItem("token")
  );
  return (
  
  <BrowserRouter>
  <Navbar isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn}/>
  <Routes>
    <Route path='/' element={<Login setIsSignedIn={setIsSignedIn}/>}></Route>
    <Route path='/signup' element={<SignUp setIsSignedIn={setIsSignedIn}/>}></Route>
    <Route path='/feed' element={<Feed/>}></Route>
    <Route path='/details' element={<Profile/>}></Route>
    
  </Routes>
  </BrowserRouter>
  )
}


export default App
