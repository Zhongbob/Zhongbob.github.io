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
        <a className="overflow-visible" href = {url}>
            <Highlight>{children}</Highlight>
            
            <DescImg src={src} alt={alt} className={`${imageClass} group-hover:brightness-150 transition duration-300 absolute left-0`} />
        </a>
    );
}

export default HighlightImage;