import React, { useEffect, useState } from "react";

interface HeadingProps {
    children: string;
    className?: string;
}

const Heading: React.FC<HeadingProps> = ({ children , className}) => {
    const [idx, setIdx] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIdx(idx => idx + 1);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <h2 className = {`my-2 ${className} text-headerColor text-5xl lg:text-6xl font-bold text-center w-full`}>
            "
            {children.substring(0, idx)}
            <span className="border-r-[5px] border-white border-solid animate-type"></span>
            "
        </h2>
    );
};

export default Heading;
