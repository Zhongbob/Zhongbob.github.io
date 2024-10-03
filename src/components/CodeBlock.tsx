import React,{useState} from "react";
import { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // You can customize the style
import DoubleArrow from "../icons/DoubleArrow";
interface CodeBlockProps {
    retract: boolean;
    language: string;
    children: string;
    className: string|undefined;
    props:any;
}
const CodeBlock: React.FC<CodeBlockProps> = ({language,children,className,retract,...props}) => {
    const lineCount = children.split("\n").length
    const short = lineCount <= 5
    console.log(lineCount)
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard");
    }
    const [expand,setExpand] = useState(!retract)
    const expandClick = ()=>{
        setExpand((expand)=>!expand)
    }
    console.log(expand)
    return (
        <div className={`relative rounded-lg border-2 border-highlightColor group`}>
            <button className={`${short?'hidden':''} bg-gradient-to-t from-black to-transparent w-full p-2 absolute bottom-0 group-hover:animate-pulse cursor-pointer`}
            onClick = {expandClick}>
                <div className="group-hover:animate-bounce">
                    {expand?'Hide Code':'Expand Code'}
                <DoubleArrow className={`
                    mx-4 w-3 h-3 scale-x-150 inline-block filter-svg-textColor2 mr-2 ${expand?'rotate-x-180':''}`} />
                </div>
            </button>
            <button
            className={`absolute 
            hover:brightness-125
            transition-all duration-200
            top-2 right-2 bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-sm
            ${expand?'':'hidden'}`}
            onClick={() => handleCopy(children)}
            >
            Copy
            </button>
            <SyntaxHighlighter className = {`transition-all duration-500 ${short?'':'!mb-12'} ${expand?'max-h-[200vh]':'max-h-20 !overflow-hidden'}`}
            codeTagProps={{"className":`${expand?'':'overflow-hidden'}`}}
            style={atomDark as any} language={language} PreTag="div" {...props}>
                {children}
            </SyntaxHighlighter>
        </div>
    )
}

export default CodeBlock