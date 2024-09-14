import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Nav(){
    // get current page
    const location = useLocation();
    return (<>
        <nav className = "flex bg-secondaryColor2/80 w-fit fixed right-0 top-2 gap-4 z-50 px-4">
            <Link to = "/" className = {`py-2 px-8 font-bold hover:backdrop-brightness-125 transition-all duration-200
                ${location.pathname === "/" ? "backdrop-brightness-150" : ""} `}>
                About</Link>
            <Link to = "/writeups" className = {`py-2 px-8 font-bold hover:backdrop-brightness-125 transition-all duration-200
                ${location.pathname === "/writeups" ? "backdrop-brightness-150" : ""} `}>Writeups</Link>
        </nav>
        </>
    )
}