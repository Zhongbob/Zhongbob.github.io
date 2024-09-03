import React from "react";
interface HighlightProps{
    children: React.ReactNode
}

const Highlight: React.FC<HighlightProps> = (props) => {
    return(
        <span className = "text-highlightColor">{props.children}</span>
    )
}


export default Highlight;