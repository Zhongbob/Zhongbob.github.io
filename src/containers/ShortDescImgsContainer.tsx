import React, { useEffect, useState } from "react";
import DescImg from "../components/DescImg";

// import "../css/ShortDescImgsContainer.css";
export default function ShortDescImgsContainer(){
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    useEffect(() => {
        const menuTimeout = setTimeout(() => {
        // Set the visibility state and trigger the fade-in
        setIsMenuVisible(true);
        }, 4000);
        return () => clearTimeout(menuTimeout);
    }, []);
    return(<>
        { isMenuVisible && <div className = "short-desc-imgs col-span-12 lg:col-span-7 relative">
            <DescImg className = "absolute top-[10%] left-[10%] w-2/6 h-3/6 animate-fadeInFromLeft object-cover" src = "static/my_photos/aboutme1.jpg" alt = "Zhongbob"/>
            <DescImg className = "object-cover absolute top-[10%] right-[10%] w-2/6 h-3/6 animate-fadeInFromRight animate-delay-500 animate-fill-backwards" src = "static/my_photos/greyctf_finals.jpg" alt = "Zhongbob"/>
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-3/5 h-2/5">
                <DescImg className = "object-cover w-full h-full animate-fadeInFromBottom animate-delay-1000 animate-fill-backwards" src = "static/my_photos/aboutme2.jpg" alt = "Zhongbob"/>
            </div>
        </div>
    }
    </>
    )
}