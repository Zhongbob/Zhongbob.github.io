import React from "react";
import { Writeup } from "../misc/types";
import { Link } from "react-router-dom";
interface WriteupItemProps {
    writeupDetails: Writeup,
}
const AcheivementItem: React.FC<WriteupItemProps> = ({ writeupDetails:{title, desc, image, datePosted, category,id, competition,difficulty}}) => {
    return (
        <Link to={`/writeups/${id}`}>
            <div className="flex flex-col 
            items-center row-span 
            p-4 hover:brightness-125 
            hover:shadow-textColor2/30 
            shadow-md
            shadow-
            bg-secondaryColor2
            transition-all duration-200 rounded-lg
            h-[26rem] overflow-hidden
            ">
                
                <div className="grid grid-cols-5 w-full items-center shrink-0">
                    <h3 className="col-span-3 text-left font-bold">{title}</h3>
                    <p className="col-span-2 text-sm text-right text-textColor2">{datePosted.toLocaleDateString()}</p>
                </div>
                <div className="grid grid-cols-5 w-full items-center shrink-0">
                <p className="col-span-3 text-sm text-left text-highlightColor font-bold">{competition}</p>
                    <p className="col-span-2 text-right text-sm text-textColor3">{category} <b>({difficulty})</b></p>
                    
                </div>
                <div className="w-full h-52 rounded-lg my-4 bg-white border-2 shrink-0">
                    <img src={`static/writeups/photos/${image}`} alt={title} className="w-full h-full rounded-lg bg-white border-2 object-contain" />
                </div>
                <div className="text-base text-center w-10/12 overflow-auto h-20 shrink-0 grow-0">{desc}</div>
                
            </div>
        </Link>
    )
}
export default AcheivementItem