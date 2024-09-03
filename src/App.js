import React from "react";
// import './css/App.css';
import './index.css';
import ShortDescSection from './containers/ShortDescSection';
import AboutMeSection from './containers/AboutMeSection'
import TimelineSection from './containers/TimelineSection'
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
