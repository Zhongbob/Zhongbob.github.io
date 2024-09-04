import React, { useState } from "react";
import ShortDescContainer from "./ShortDescContainer";
import ShortDescImgsContainer from "./ShortDescImgsContainer";
// import "../css/ShortDescSection.css";

export default function ShortDescSection(){
    return(
        <section className = "h-screen grid grid-cols-12 w-full">
            <ShortDescContainer/>
            <ShortDescImgsContainer />
        </section>
    )
}