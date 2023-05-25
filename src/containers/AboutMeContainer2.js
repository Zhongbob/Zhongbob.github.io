import React, { useState } from "react";
import rdevLogo from "../imgs/rdevLogo.png";

export default function AboutMeDescSection(){
    return(
        <section className = "about-me-sub-section sub-section-2">
            <p>I'm the president of <a>RdeV</a>, a subsection of the Infocomm club which focuses on web and game development. We have developed websites such as the <a>RVCTF Website</a>,  and organise the <a>Annual RVHS GAMEJAM</a></p>
            <img src = {rdevLogo} alt = "RdeV"/>
            <img src = {rdevLogo}/>
        </section>
    )
}