import React, {useRef,useEffect} from "react";
import Heading from "../components/Heading"
import HighlightImage from "../components/HighlightImage"

export default function AboutMeContainer1(){
    const parentRef = useRef(null)
    const imgRef = useRef<HTMLImageElement[]>([])
    // const addRef = (ele: HTMLImageElement) => {
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
        <section ref = {parentRef} className = "h-[29rem] lg:h-96 w-full relative my-12 lg:my-24">
            <Heading>Who Am I?</Heading>
            <p className = "w-full px-12 lg:px-4 lg:w-[30rem] mx-auto my-16 text-justify">
                I'm a 17-year-old student at River Valley High School with a passion for programming. 
                I love coding in my free time, working on personal projects that have the potential to improve the lives of others, 
                like <HighlightImage
                    src = "static/my_photos/peerview.png"
                    alt = "PeerView"
                    imageClass = "w-[70%] lg:w-[24rem] object-contain left-4 lg:left-12 bottom-20 lg:top-4 lg:bottom-auto"
                    url = "https://peerview.x10.mx"
                >PeerView</HighlightImage> and <HighlightImage
                src = "static/my_photos/eatwhereleh.png"
                alt = "PeerView"
                imageClass = "w-[70%] lg:w-[24rem] object-contain right-4 lg:right-12 bottom-4"
                url = "https://eatwhereleh.x10.mx"
            >Where Eat Leh?</HighlightImage> </p>
        </section>
    )
}