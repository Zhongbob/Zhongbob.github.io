import React from "react";
import Highlight from "./Highlight";
export default function ShortDesc(){
    return(
        <div className = "short-desc">
            <h1 className = "short-desc-name">Chua<br/>Zhong Ding</h1>
            <p className = "short-desc-content">An Aspiring Software Developer with a passion for creating Software that <Highlight>improves people's lives.</Highlight> </p>
            <p className = "short-desc-scroll">Scroll for More</p>
        </div>
    )
}