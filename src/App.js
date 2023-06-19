import React from "react";
import './css/App.css';
import ShortDescSection from './containers/ShortDescSection.js';
import AboutMeSection from './containers/AboutMeSection.js'
import TimelineSection from './containers/TimelineSection.js'
function App() {
  return (
    <div class = "App">
      <ShortDescSection />
      <AboutMeSection />
      <TimelineSection />
    </div>
  );
}

export default App;
