import React from "react";
export default function DescImg(props){
    return(
        <img className = "desc-img" id = {props.id} src = {props.src} alt = {props.alt}/>
    )
}