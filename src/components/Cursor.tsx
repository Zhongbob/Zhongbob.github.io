import React, {useState,useEffect} from "react";
export default function Cursor(){
    const [displayCursor, setDisplayCursor] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setDisplayCursor(true)
            setTimeout(() => {
                setDisplayCursor(false)
            },4000)
        },1000)
        
    }, [])
    return(<>
            {displayCursor && <div className="absolute left-full top-[60%] bg-no-repeat w-8 h-8 animate-cursor" 
        style={{ backgroundImage: "url('cursorpointer.png')", transform: "translateX(-30%)" }}></div>}
            </>
        )
}