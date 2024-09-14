import React from "react";

interface TagProps {
    tag: string
}

const generateTagColor = (tag: string) => {
    const defaultColors = {
        "Web":"#FF6B6B",
        "Easy":"#48BB78",
        "Medium":"#F6E05E",
        "Hard":"#F56565",
    }
}
const Tag: React.FC<TagProps> = ({tag}) => {
    return (
        <span className="bg-secondaryColor2 text-white text-xs px-2 py-1 rounded-lg">{tag}</span>
    )
}