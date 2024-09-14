import React from "react";
import { Acheivement } from "../misc/types";

const AcheivementItem: React.FC<Acheivement> = ({ title, desc, image, href, dateToFrom }) => {
    return (
        <a className="flex flex-col items-center row-span py-4 hover:backdrop-brightness-125 transition-all duration-200 rounded-lg" href = {href} target = "_blank">
            <img src={`static/acheivements/${image}`} alt={title} className="w-24 h-24 rounded-full my-4 bg-white border-2 border-highlightColor"/>
            <h3 className="text-lg font-semibold w-10/12 text-center">{title} <span className="text-textColor2">({dateToFrom})</span></h3>
            <p className="text-sm text-center w-8/12">{desc}</p>
        </a>
    )
}
export default AcheivementItem