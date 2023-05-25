import React, {useRef,useEffect} from "react";
export default function Cursor(){
    const cursorRef = useRef(null);
    useEffect(() => {
        // var idx = 0;
        setTimeout(() => {
            cursorRef.current.style.animation = "cursor 5s forwards"
            setTimeout(() => {
                cursorRef.current.remove()
            },6000)
        },1000)
        
        // return () => clearInterval(interval);
    }, [])
    return(
        <div ref = {cursorRef} className = "cursor"></div>
    )
}