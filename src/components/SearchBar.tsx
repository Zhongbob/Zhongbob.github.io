import React, { useEffect } from "react";
interface SearchBarProps {
    searchQuery: string,
    onChange: (search: string) => void,
    className?: string
}
const SearchBar: React.FC<SearchBarProps> = ({searchQuery,onChange,className}) => {
    return (
            <input type="text" placeholder="Search" 
            value={searchQuery} 
            onChange={(e) => onChange(e.target.value)} className={`w-full py-2 px-4
                hover:bg-highlightColor/70
                focus:outline-none focus:ring-2 focus:ring-secondaryColor2 focus:ring-opacity
            transition-all duration-200 ease-out 
            text-base
            border-2 border-secondaryColor2 rounded-lg
             bg-highlightColor/60 text-white
             placeholder-textColor3/50 ${className}`}/>
    )
}
export default SearchBar