import React, { useState } from "react";
import Heading from "../components/Heading"
import img1 from "../imgs/peerview.png"
import img2 from "../imgs/eatwhereleh.png"

export default function AboutMeDescSection(){
    return(
        <section className = "about-me-sub-section sub-section-1">
            <img id = "meimg1" src = {img1} alt = "PeerView"/>
            <img id = "meimg2" src = {img2} alt = "RdeV"/>

            <Heading>Who Am I?</Heading>
            <p>I'm a 17-year-old student at River Valley High School with a passion for programming. I love coding in my free time, working on personal projects that have the potential to improve the lives of others, like <a>PeerView</a> and <a>Where Eat Leh?</a> </p>
        </section>
    )
}