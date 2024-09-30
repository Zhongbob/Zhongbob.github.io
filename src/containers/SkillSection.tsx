import React from "react";
import { Skill } from "../misc/types";
import SkillItem from "../components/SkillItem";
import Highlight from "../components/Highlight";
import Heading from "../components/Heading";

const skills : Array<Skill> = [
    {
        name: "Python",
        image: "python.png",
        level: "Proficient",
        years: 4
    },
    {
        name: "Javascript",
        image: "javascript.png",
        level: "Proficient",
        years: 3
    },
    {
        name: "HTML",
        image: "html.webp",
        level: "Proficient",
        years: 3
    },
    {
        name: "CSS",
        image: "CSS.png",
        level: "Proficient",
        years: 3
    },
    {
        name: "SQL",
        image: "SQL.webp",
        level: "Proficient",
        years: 3
    },
    {
        name: "PHP",
        image: "PHP.png",
        level: "Intermediate",
        years: 3
    },
    
    {
        name: "C++",
        image: "CPP.png",
        level: "Intermediate",
        years: 1
    },
    {
        name: "React",
        image: "React.png",
        level: "Beginner",
        years: 1
    },
    {
        name: "TailwindCSS",
        image: "tailwind.png",
        level: "Beginner",
        years: 0
    },
    {
        name: "NextJS",
        image: "nextjs.svg",
        level: "Beginner",
        years: 0
    },
    {
        name: "Typescript",
        image: "typescript.webp",
        level: "Beginner",
        years: 0
    }
]

const SkillSection: React.FC = () => {
    return (
        <section>
            <Heading className = "mt-8">Technical Skills</Heading>
        <div className="flex flex-wrap w-full justify-center gap-4">
            {skills.map((skill) => (
                <SkillItem {...skill} />
            ))}
        </div>
        </section>
    )
}

export default SkillSection