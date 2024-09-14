import React, { useState } from "react";
import HighlightImage from "../components/HighlightImage";
export default function AboutMeContainer3(){

    return(
        <section className = "px-12 my-12 lg:my-24 relative h-[20rem] lg:h-96 flex lg:items-center justify-end">
            <p className="w-full lg:w-5/12 text-justify lg:mr-8">
                I regularly participate in Cyber Security Capture the Flag (CTF) competitions, 
                under the <HighlightImage
                url = "https://www.linkedin.com/company/ssmctsg/mycompany/"
                src = "static/my_photos/ssmct.jpg"
                alt = "SSMCT"
                imageClass = "w-[70%] lg:w-[30rem] object-contain left-1/2 bottom-4 lg:left-1/4 lg:top-1/2 lg:-translate-y-1/2 -translate-x-1/2"
                >Singapore Student Merger CTF Team</HighlightImage>. 
                In addition, I am currently leading the development of the team's website page.<br/>
            </p>
        </section>
    )
}