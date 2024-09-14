import React, {AnchorHTMLAttributes, useEffect} from "react";
import writeupDetails from "../data/writeupDetails";
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Heading from '../components/Heading';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // You can customize the style
import { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { Link } from "react-router-dom";
interface CodeProps extends React.HTMLAttributes<HTMLElement> {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }


const nextPreviousUI: any = (id:number) => {
   return <div className="flex w-full justify-center gap-4">
          {
            id > 0 && 
            <Link to={`/writeups/${id - 1}`}>
              <button className="font-bold bg-highlightColor/50 text-white px-4 py-2 rounded-lg my-4 hover:brightness-125 transition-all duration-200">Previous Writeup</button>
            </Link>
          }
          {id < writeupDetails.length - 1 &&
          <Link to={`/writeups/${id + 1}`}>
            <button className="font-bold bg-highlightColor/50 text-white px-4 py-2 rounded-lg my-4 hover:brightness-125 transition-all duration-200">Next Writeup</button>
          </Link>
          }
          
        </div>
}
const Writeup: React.FC = () => {
    const {id} = useParams();
    const [markdownContent, setMarkdownContent] = React.useState<string>("");
    const [zoomImage, setZoomImage] = React.useState<string>("");
    const writeup = writeupDetails[parseInt(id ?? "")];

    const exitZoom = () => {
        setZoomImage("");
    }
    useEffect(() => {
        if (id == undefined || writeup == undefined) {
            return;
        }
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        fetch(`/static/writeups/files/${writeup.writeupFile}`)
        .then((response) => response.text())
        .then((text) => {
            setMarkdownContent(text);
        })

    }, [id])
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard");
    }
    // Function to render code blocks with syntax highlighting
    const components = {
        code: ({ inline, className, children, ...props }: CodeProps) => {
          const match = /language-(\w+)/.exec(className || '');
          const codeString = String(children).replace(/\n$/, '');
          return !inline && match ? (
            <div className="relative">
                 <button
            className="absolute 
            hover:brightness-125
            transition-all duration-200
            top-2 right-2 bg-gray-200 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-sm"
            onClick={() => handleCopy(codeString)}
          >
            Copy
          </button>
            <SyntaxHighlighter className = "rounded-lg border-2 border-highlightColor"
            style={atomDark as any} language={match[1]} PreTag="div" {...props}>
              {codeString}
            </SyntaxHighlighter>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
            <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100" {...props}>{children}</h1>
          ),
          h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 w-full border-b-2 border-highlightColor py-3 my-2" {...props}>{children}</h2>
          ),
          h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100" {...props}>{children}</h3>
          ),
          strong: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
            <strong className="font-bold text-textColor3" {...props}>{children}</strong>
          ),
          p: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
            <p className="text-textColor1 my-4" {...props}>{children}</p>
          ),
          em: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
            <em className="italic text-textColor3 bg-secondaryColor2 px-1" {...props}>{children}</em>
          ),
          a: ({ children, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
            <a className="text-highlightColor hover:brightness-125 transition-all duration-200" {...props}>{children}</a>
          ),
          li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
            <li className="text-textColor1 my-4" {...props}>{children}</li>
          ),
          ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
            <ol className="list-decimal list-inside ml-8" {...props}>{children}</ol>
            ),
            ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
                <ul className="list-disc list-inside" {...props}>{children}</ul>
            ),  
            img: ({ children, ...props }: React.HTMLAttributes<HTMLImageElement> & { src?: string }) => (
                <img className="rounded-lg border-2 border-highlightColor max-w-screen max-h-80 lg:max-w-[60vw] object-contain
                hover:brightness-125 transition-all duration-200 cursor-pointer
                " {...props} 
                onClick = {()=>setZoomImage(props.src??"")}/>
            )
      };

    if (id == undefined || writeup == undefined) {
        return <>
            <h1 className="text-4xl font-bold px-8 box-border">Writeup not found</h1>
        </>
    }
    return <>
    <div className="mx-8">

        <Heading className="text-4xl font-bold px-8 box-border">{writeup.title}</Heading>
        <p className="text-sm text-textColor2 my-4 text-center">Published On: {writeup.datePosted.toDateString()}</p>
        {nextPreviousUI(parseInt(id))}
        <div className="flex flex-col gap-2 text-base lg:text-xl">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 w-full border-b-2 border-highlightColor py-3 my-2">Challenge Details</h2>
            {writeup.solves !== null && <p className="text-textColor1" >Solves: <b className="text-textColor3">{writeup.solves}</b></p>}
            {writeup.points !== null && <p className="text-textColor1" >Points: <b className="text-textColor3">{writeup.points}</b></p>}

            <p className="text-textColor1" >Category: <b className="text-textColor3">{writeup.category}</b></p>
            <p className="text-textColor1" >Difficulty: <b className="text-textColor3">{writeup.difficulty}</b></p>
            <p className="text-textColor1" >Competition: <b className="text-textColor3">{writeup.competition}</b></p>
            {writeup.sourceCode && <a
            href={writeup.sourceCode}
            className="text-highlightColor hover:brightness-125 transition-all duration-200 "
            >
            Source Code/Distri 
            </a>}
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 w-full border-b-2 border-highlightColor py-3 my-2">Challenge Description</h2>
            <p className="text-textColor1" >{writeup.desc}</p>
            {
                writeup.hints && writeup.hints.length > 0 && <>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 w-full border-b-2 border-highlightColor py-3 my-2">Hints</h2>
                <ul className="list-disc list-inside ml-8">
                    {writeup.hints?.map((hint) => {
                        return <li className="text-textColor1">{hint}</li>
                    })}
                </ul>
                </>
            }

        </div>
        <ReactMarkdown
        className = "text-base lg:text-xl"
            children={markdownContent}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]} // This allows raw HTML (like images) to be rendered
            components={components} // Use custom renderer for code blocks
            
        />
        {nextPreviousUI(parseInt(id))}
      </div> 
      {zoomImage && 
      <div className="fixed w-screen h-screen inset-0 bg-black/50 flex justify-center items-center" onClick = {exitZoom}>
            <img className = "max-w-[80vw] max-h-[80vh] "src = {zoomImage}/>
      </div>
      }
      </>
}

export default Writeup