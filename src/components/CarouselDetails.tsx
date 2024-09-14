import React, { useState, useRef, useEffect } from "react";
import { CarouselItemProps } from "../misc/types";
import Button from "./Button";
const CarouselDetails: React.FC<CarouselItemProps> = ({href,folder}) => {
    return <div className="flex justify-center">
        <Button href={href}>Visit Website!</Button> 
    </div>
}

export default CarouselDetails