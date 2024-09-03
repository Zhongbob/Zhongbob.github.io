import React from "react";
import DescImg from "../components/DescImg.js";
import img1 from "../imgs/aboutme1.jpg";
import img2 from "../imgs/aboutme2.jpg";
// import "../css/ShortDescImgsContainer.css";
export default function ShortDescImgsContainer(){
    return(
        <div className = "short-desc-imgs">
            <DescImg id = "img1" src = {img1}/>
            <DescImg id = "img2" src = {img2}/>
            <DescImg />
        </div>
    )
}