import React, { useState } from "react";
import ShortDescContainer from "./ShortDescContainer";
import ShortDescImgsContainer from "./ShortDescImgsContainer.js";
// import "../css/ShortDescSection.css";

export default function ShortDescSection(){
    const [toDisplay, setToDisplay] = useState(false)
    console.log(toDisplay)
    return(
        <section className = "h-screen">
            <ShortDescContainer toDisplay = {[toDisplay, setToDisplay]}/>
            {toDisplay && <ShortDescImgsContainer />}
        </section>
    )
}