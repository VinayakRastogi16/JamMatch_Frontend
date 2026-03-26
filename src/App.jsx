import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Feed from './pages/Feed';
function App() {

  return (
    
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<Login/>}></Route>
    <Route path='/signup' element={<SignUp/>}></Route>
    <Route path='/feed' element={<Feed/>}></Route>
  </Routes>
  </BrowserRouter>
  )
}

export default App
