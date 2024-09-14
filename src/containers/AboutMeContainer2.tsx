import React, { useState ,useRef,useEffect} from "react";
import HighlightImage from "../components/HighlightImage";

export default function AboutMeContainer2(){
    const parentRef = useRef(null)
    // const imgRef = useRef
    // const addRef = (ele) => {
    //     imgRef.current.push(ele)
    // }
    // useEffect(() => {
    //     const options = {threshold: 0.25}
    //     const observer = new IntersectionObserver((entry)=>{
    //         if (entry[0].isIntersecting === false) return
    //         imgRef.current.forEach((ele) => {
    //             ele.style.display = "initial"
    //         })
    //     },options)
    //     observer.observe(parentRef.current)
    // },[])
    return(
        <section className = "w-full px-12 my-12 lg:my-24 relative h-[25.5rem] lg:h-96 flex lg:items-center">
            <p className="w-full lg:w-5/12 text-justify left-">
                I'm the founder of&nbsp;
                <HighlightImage
                src = "static/my_photos/rdev_website.png"
                alt = "RdeV"
                imageClass = "w-[70%] lg:w-[24rem] object-contain left-4 lg:left-[calc(100%-(550%/12+3rem))] bottom-[7rem] lg:bottom-auto lg:top-10"
                url = "https://rdev.x10.mx"
                >RdeV</HighlightImage>, 
                a subsection of the Infocomm club in River Valley High School which focuses on Software Development. 
                We have developed websites such as the&nbsp;
                <HighlightImage
                src = "static/my_photos/rvctf.png"
                alt = "RdeV"
                imageClass = "w-[70%] lg:w-[24rem] object-contain right-4 bottom-[4rem] lg:bottom-auto lg:right-auto lg:top-1/2 lg:-translate-y-1/2 lg:left-[calc(100%-(550%/12-4rem))]"
                url = "https://rvctf.com"
                >RVCTF Website</HighlightImage>, 
                and organise the&nbsp;
                <HighlightImage
                src = "static/my_photos/rvhsgamejam.jpg"
                alt = "RdeV"
                imageClass = "w-[70%] lg:w-[24rem] object-contain lg:left-[calc(100%-(550%/12-11rem))] lg:bottom-10 left-1/2 -translate-x-1/2 bottom-[1rem] lg:translate-x-0"
                url = "https://rdev.x10.mx">
                Annual RVHS GAMEJAM
                </HighlightImage></p>
        </section>
    )
}