import React from "react";
// import './css/App.css';
import { Helmet } from 'react-helmet';
import './index.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Writeups from './pages/Writeups';
import Writeup from './pages/Writeup';
import Nav from './components/Nav';
function App() {
  return (
    <>
    <Helmet>
      <link rel="icon" href="logo.ico" type="image/x-icon"></link>
    </Helmet>
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
