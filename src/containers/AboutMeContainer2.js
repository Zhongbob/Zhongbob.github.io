import React, { useState ,useRef,useEffect} from "react";
// import rdevLogo from "../imgs/rdevLogo.png";

export default function AboutMeContainer2(){
    const parentRef = useRef(null)
    const imgRef = useRef([])
    const addRef = (ele) => {
        imgRef.current.push(ele)
    }
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
        <section ref = {parentRef} className = "about-me-sub-section sub-section-2">
            <p>I'm the president of <a>RdeV</a>, a subsection of the Infocomm club which focuses on web and game development. We have developed websites such as the <a>RVCTF Website</a>,  and organise the <a>Annual RVHS GAMEJAM</a></p>
            <img ref = {addRef}  alt = "RdeV"/>
            <img ref = {addRef} />
        </section>
    )
}