import React, { useState } from "react";
import ShortDescContainer from "./ShortDescContainer.js";
import ShortDescImgsContainer from "./ShortDescImgsContainer.js";
import "../css/ShortDescSection.css";
export default function ShortDescSection(){
    const [toDisplay, setToDisplay] = useState(false)
    console.log(toDisplay)
    return(
        <section className = "short-desc-section">
            <ShortDescContainer toDisplay = {[toDisplay, setToDisplay]}/>
            {toDisplay && <ShortDescImgsContainer />}
        </section>
    )
}