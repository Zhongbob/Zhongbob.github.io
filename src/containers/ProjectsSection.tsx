import React, { useState } from "react";
import ShortDescContainer from "./ShortDescContainer";
import ShortDescImgsContainer from "./ShortDescImgsContainer";
import Heading from "../components/Heading";
import Carousel from "../components/Carousel";
import Highlight from "../components/Highlight";
import CarouselDetails from "../components/CarouselDetails";
import projectDetails from "../data/projectDetails";

export default function ShortDescSection(){
    const [curIndex, setCurrentIndex] = useState(0);
    return(
        <section className = "h-fit w-full my-12">
            <Heading>Projects</Heading>
            <Carousel
                curIndex = {curIndex}
                setCurrentIndex = {setCurrentIndex}
                items = {projectDetails}
            />
            <CarouselDetails {...projectDetails[curIndex]}/>
        </section>
    )
}