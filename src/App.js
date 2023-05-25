import React from "react";
import './css/App.css';
import ShortDescSection from './containers/ShortDescSection.js';
import AboutMeSection from './containers/AboutMeSection.js'
function App() {
  return (
    <div class = "App">
      <ShortDescSection />
      <AboutMeSection />
    </div>
  );
}

export default App;
