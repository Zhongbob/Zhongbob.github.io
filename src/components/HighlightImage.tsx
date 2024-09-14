import React from "react";
import Highlight from "./Highlight";
import DescImg from "./DescImg";

interface HighlightImageProps {
    src: string;
    alt: string;
    children: string;
    imageClass?: string;
    url:string;
}
const HighlightImage: React.FC<HighlightImageProps> = ({ src, alt, children, imageClass,url }) => {
    return (
        <a className="overflow-visible group" href = {url}>
            <Highlight className = "group-hover:brightness-125 transition duration-300 underline">{children}</Highlight>
            
            <DescImg src={src} alt={alt} className={`${imageClass} group-hover:brightness-125 group-hover:z-10 group-hover:scale-110 transition duration-300 absolute`} />
        </a>
    );
}

export default HighlightImage;