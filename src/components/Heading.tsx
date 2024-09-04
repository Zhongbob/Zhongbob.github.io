import React, { useEffect, useState } from "react";

interface HeadingProps {
    children: string;
}

const Heading: React.FC<HeadingProps> = ({ children }) => {
    const [idx, setIdx] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIdx(idx => idx + 1);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <h2 className = "text-headerColor text-6xl font-bold text-center my-2">
            "
            {children.substring(0, idx)}
            <span className="border-r-[5px] border-white border-solid animate-type"></span>
            "
        </h2>
    );
};

export default Heading;
