import React from "react";
interface HighlightProps{
    children: React.ReactNode;
    className?: string;
}

const Highlight: React.FC<HighlightProps> = ({children,className}) => {
    return(
        <span className = {`text-highlightColor ${className}`}>{children}</span>
    )
}


export default Highlight;