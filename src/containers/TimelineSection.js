import React, { useState } from "react";
import Heading from "../components/Heading"
import img1 from "../imgs/peerview.png"
import img2 from "../imgs/eatwhereleh.png"
import TimelineItem from "../components/TimelineItem"
// import "../css/TimelineSection.css"

export default function TimelineSection(){
    return(
        <section className = "timeline-section">
            <Heading>My Timeline</Heading>
            <p>How did my story begin?</p>
            <div className="timeline-container">
                <div className="timeline">
                    <img src={img1} alt="Peerview"/>
                    <h3 className="year">2006</h3>
                </div>
            </div>
        </section>
    )
}