import React, { forwardRef } from "react";
import { CarouselItemProps } from "../misc/types";
import DoubleArrow from "../icons/DoubleArrow";
import Highlight from "./Highlight";
const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ folder, alt, dateToFrom, className, href, desc, title }, ref) => {
    // Flips the image onClick to show the back of the card
    const [flipped, setFlipped] = React.useState(false)
    const flip = () => setFlipped(!flipped)
    const src = `static/projects/${folder}/main.jpg`
    return(
        <div
        className={`
        group
        hover:brightness-110 ${flipped?'':'hover:animate-pulse'}
  
        relative w-[20rem] lg:w-[40rem] h-full cursor-pointer perspective shrink-0 shadow-lg rounded-lg overflow-hidden shadow-secondaryColor2`}
        onClick={flip}
        ref = {ref}
        draggable = "false"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 ease-in-out transform ${
            flipped ? "rotate-x-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of the card */}
          <div
            className="absolute w-full h-full backface-hidde text-black rounded-lg flex justify-center items-center text-center p-4"
            style={{ backfaceVisibility: "hidden" }} 
            draggable = "false"
          >
            <img className = "absolute w-full h-full object-cover select-none" draggable = "false"
            src = {src}/>
            <div className="w-full 
            flex flex-col justify-center items-center
            absolute bottom-0 z-10 text-textColor1 py-4 select-none">
              <h3 className="font-bold">
              {title}
        
              </h3>
              <div className="group-hover:animate-bounce text-textColor2 text-sm flex items-center">
                <DoubleArrow className="
                w-3 h-3 inline-block filter-svg-textColor2 mr-2" />
                Click for more details</div>
              <div className="absolute -z-10 inset-0 mix-blend-difference bg-black/30"></div>

            </div>
          </div>
  
          {/* Back of the card */}
          <div
            className="absolute w-full h-full backface-hidden text-white shadow-md rounded-lg flex justify-center items-center text-center p-4"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateX(180deg)",
            }}
            draggable = "false"
          >
            <img className = "-z-10 brightness-50 absolute w-full h-full object-cover blur-sm select-none" draggable = "false"
            src = {src}/>
            <div className="h-full w-full flex flex-col gap-0 select-none">
              <h3 className="font-bold">{title}</h3>
              <Highlight className="text-sm -mt-1 font-bold">({dateToFrom})</Highlight>
              <p className="text-textColor2 h-full overflow-auto text-sm lg:text-base text-justify lg:px-8 px-2 mt-2">{desc}</p>
            </div>
          </div>
        </div>
      </div>
    )
})
export default CarouselItem