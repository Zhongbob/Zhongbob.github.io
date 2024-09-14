import React from "react";
interface DescImgProps{
    src: string,
    alt: string,
    className?: string
}

const DescImg: React.FC<DescImgProps> = (props) => {
    return(
        <img className = 
        {`shadow-xl shadow-secondaryColor2 rounded-lg ${props.className}`} 
        src = {props.src} alt = {props.alt}/>
    )
}
export default DescImg