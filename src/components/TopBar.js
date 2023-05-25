import React from "react";
export default function TopBar(props){
    return(
        <div className = "top-bar">
            <div ref = {props.menuRef} className = "dropdown"></div>
            <p>ABOUT-ME</p>
        </div>
    )
}