import React, {useRef,useEffect} from "react";
import Heading from "../components/Heading"
import Highlight from "../components/Highlight";
import DescImg from "../components/DescImg";

export default function AboutMeContainer4(){
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
        <section ref = {parentRef} className = "w-full h-[22rem] lg:h-[20rem] relative my-12 lg:my-24 flex lg:items-center">
            <p className = "w-full lg:w-[30rem] mx-auto text-justify px-12">
                I create CTF challenges for CTF competitions, 
                mainly in the Web and Programming Sections. 
                Past Competition's I've authored is the&nbsp;
                <a className="overflow-visible group" href = "">
            <Highlight className = "group-hover:brightness-125 transition duration-300 underline">ISC2CTF</Highlight>
            
            <DescImg src="static/my_photos/view_source.png" 
            alt="ISC2CTF ViewSource Challenge" 
            className='h-40
            w-[70%]
            bottom-20
            left-4
            lg:w-[24rem] 
            lg:h-[12rem]
            lg:bottom-auto
            lg:left-12
            lg:top-1/2 lg:-translate-y-1/2
            group-hover:brightness-125 
            group-hover:z-10 group-hover:scale-110 transition duration-300 absolute' />
            <DescImg src="static/my_photos/CVE.png" alt="ISC2CTF CVE Challenge" className='
            h-40
            w-[70%]
            bottom-4
            right-4
            lg:w-[24rem] 
            lg:h-[12rem]
            lg:right-12
            lg:top-1/2 lg:-translate-y-1/2
            group-hover:brightness-125 
            group-hover:z-10 group-hover:scale-110 transition duration-300 absolute' />.

        </a> </p>
        </section>
    )
}