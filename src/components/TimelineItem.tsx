import React from "react";
export default function TimelineItem(props:any){
    return (
        <div className = "timeline-item">
            <img src = {props.img} alt = {props.alt}/>
            <div className = "timeline-item-content">
                <h2>{props.title}</h2>
                <p>{props.content}</p>
                {(props.link !== undefined) && <a href = {props.link} target = "_blank" rel="noopener noreferrer">View Project</a>}
            </div>
        </div>
    )
}