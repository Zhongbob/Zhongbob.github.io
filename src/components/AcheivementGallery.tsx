import React from "react";
import AcheivementItem from "./AcheivementItem";
import { Acheivement } from "../misc/types";

interface AcheivementGalleryProps {
    acheivements: Acheivement[]
}

const AcheivementGallery: React.FC<AcheivementGalleryProps> = ({ acheivements }) => {
    acheivements.sort((a,b) => a.title.localeCompare(b.title))
    acheivements.sort((a, b) => a.importance - b.importance)
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8 h-[80vh] px-8 overflow-auto">
            {acheivements.map((acheivement) => (
                <AcheivementItem {...acheivement} />
            ))}
        </div>
    )
}

export default AcheivementGallery