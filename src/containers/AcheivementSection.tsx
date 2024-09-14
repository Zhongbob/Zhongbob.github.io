import React, { useEffect, useState } from "react";
import Heading from "../components/Heading";
// import "../css/ShortDescImgsContainer.css";
import { Acheivement } from "../misc/types";
import AcheivementGallery from "../components/AcheivementGallery";
import Highlight from "../components/Highlight";
import acheivementDetails from "../data/acheivementDetails";
export default function AcheivementSection(){
    return(<>
        <section>
            <Heading>Acheivements</Heading>
            <AcheivementGallery acheivements = {acheivementDetails}/>
        </section>
    </>
    )
}