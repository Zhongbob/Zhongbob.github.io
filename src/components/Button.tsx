import React from "react";
interface ButtonProps {
    href?: string;
    className?: string;
    children: React.ReactNode;
}
const Button: React.FC<ButtonProps> = ({ href, className, children }) => {
    const actualButton = (
        <button className = {`
            font-bold bg-highlightColor/50 text-white px-4 py-2 rounded-lg my-4 hover:brightness-125 transition-all duration-200
            ${className} `}>{children}</button>
    )
    return (
        <>{
        href?
        <a href={href} target="_blank">
            {actualButton}
        </a>:
        {actualButton}
        }</>
    )
}

export default Button