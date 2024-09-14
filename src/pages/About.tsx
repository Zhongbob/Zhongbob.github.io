import React from "react";

import ShortDescSection from '../containers/ShortDescSection';
import AboutMeSection from '../containers/AboutMeSection'
import ProjectsSection from '../containers/ProjectsSection'
import AcheivementSection from "../containers/AcheivementSection";
import SkillSection from "../containers/SkillSection";
import ContactSection from "../containers/ContactSection";

const About: React.FC = () => {
    return <>
    <ShortDescSection />
      <AboutMeSection />
      <ProjectsSection />
      <AcheivementSection />
      <SkillSection />
      <ContactSection />
      </>
}

export default About