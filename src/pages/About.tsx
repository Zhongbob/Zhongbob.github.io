import React from "react";
import {Helmet} from "react-helmet";
import ShortDescSection from '../containers/ShortDescSection';
import AboutMeSection from '../containers/AboutMeSection'
import ProjectsSection from '../containers/ProjectsSection'
import AcheivementSection from "../containers/AcheivementSection";
import SkillSection from "../containers/SkillSection";
import ContactSection from "../containers/ContactSection";

const About: React.FC = () => {
    return <>
    <Helmet>
      <title>About Zhong Ding</title>
      <meta name="description" content="An Aspiring Software Developer with a passion for creating Software that improves people's lives." />
      <meta property="og:title" content="Zhong Ding's Portfolio Site" />
      <meta property="og:description" content="Creating software that improves people's lives." />
      <meta property="og:image" content="https://zhongbob.github.io/logo.ico" />
      <meta property="og:url" content="https://zhongbob.github.io" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Zhong Ding's Portfolio Site" />
      <meta name="twitter:description" content="Creating software that improves people's lives." />
      <meta name="twitter:image" content="https://zhongbob.github.io/logo.ico" />
    </Helmet>
    <ShortDescSection />
      <AboutMeSection />
      <ProjectsSection />
      <AcheivementSection />
      <SkillSection />
      <ContactSection />
      </>
}

export default About