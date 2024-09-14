import React from "react";
import { Skill } from "../misc/types";

const SkillItem: React.FC<Skill> = ({ name, years, level, image }) => {
    return (
        <div className="w-24 lg:w-32 flex flex-col items-center row-span py-4 hover:backdrop-brightness-125 transition-all duration-200 rounded-lg">
            <img src={`static/skills/${image}`} alt={name} className="w-16 h-16 lg:w-24 lg:h-24 rounded-full my-4 bg-white border-2 border-highlightColor object-contain" />
            <h3 className="text-base lg:text-lg font-semibold w-10/12 text-center">{name}</h3>
            <p className="text-xs lg:text-sm text-center w-full text-highlightColor">{level}</p>
            <p className="text-xs lg:text-sm text-center w-full text-textColor2">{years !== 0 ? (
                <>
                    {years} year{years === 1 ? '' : 's'} of <br /> Experience
                </>
            ) : (
                'Just Started'
            )}</p>
        </div>
    )
}
export default SkillItem