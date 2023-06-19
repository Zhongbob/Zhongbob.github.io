import React, {useRef,useEffect,useState} from "react";
import TopBar from "../components/TopBar";
import ShortDesc from "../components/ShortDesc";
import Cursor from "../components/Cursor";

export default function ShortDescContainer(props){
    const descRef = useRef(null)
    const menuRef = useRef(null)
    const [toDisplay, setToDisplay] = props.toDisplay
    useEffect(() => {
        setTimeout(() => {
            descRef.current.style.animation = "descMove 0.6s forwards"
            setTimeout(() => {
                setToDisplay(true)
                menuRef.current.style.backgroundPosition = "0 0"
            },2000)
        },2100)},[])
    return(
        <>
        <div style = {{"position":"relative","width":"40%"}}>
            <div ref = {descRef} className = "short-desc-container">
                <TopBar menuRef = {menuRef} />
                {toDisplay && <ShortDesc />}
            </div>
            <Cursor />
        </div>
        
        </>
    )
}