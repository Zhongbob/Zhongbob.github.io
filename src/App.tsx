import React from "react";
// import './css/App.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Writeups from './pages/Writeups';
import Writeup from './pages/Writeup';
import Nav from './components/Nav';
function App() {
  return (
    <>
    
    <Router>
    <Nav />
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/writeups" element={<Writeups />} />
      <Route path="/writeups/:id" element={<Writeup />} />
    </Routes>
  </Router>

    </>
    
  );
}

export default App;
