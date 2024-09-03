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
        <h2 className = "text-headerColor text-6xl font-bold text-center">
            "
            {children.substring(0, idx)}
            <span className="type"></span>
            "
        </h2>
    );
};

export default Heading;
