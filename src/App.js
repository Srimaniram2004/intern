import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Navbar from './components/Navbar';
import  CHAAT from './components/chatbot';

function App() {
  return (
    <>
      
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />   {/* You can set Home as the default route */}
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/chat" element={<CHAAT />} /> {/* Correctly map to your Chat page */}
      </Routes>
    </Router>
    </>
  );
}

export default App;
