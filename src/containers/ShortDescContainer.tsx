import React, {useRef,useEffect,useState} from "react";
import Cursor from "../components/Cursor";
import Highlight from "../components/Highlight";

interface ShortDescContainerProps{
    toDisplay: [boolean, React.Dispatch<React.SetStateAction<boolean>>]

}

const ShortDescContainer: React.FC<ShortDescContainerProps> = (props) => {
    const descRef = useRef(null)
    const menuRef = useRef(null)
    const [toDisplay, setToDisplay] = props.toDisplay
    useEffect(() => {
        setTimeout(() => {
            // if (descRef.current) {
            //     descRef.current.style.animation = "descMove 0.6s forwards";
            // }
            // setTimeout(() => {
            //     setToDisplay(true);
            //     if (menuRef.current) {
            //         menuRef.current.style.backgroundPosition = "0 0";
            //     }
            // }, 2000);
        }, 2100);
    }, []);
    return(
        <>
        <div className = "relative w-5/12 bg-secondaryColor1 h-full">
            <div ref = {descRef} className = "short-desc-container">
                <div className = "bg-secondaryColor2 py-1 px-2 font-bold">
                    ABOUT-ME
                </div>
                {toDisplay && 
                <div className = "ml-3 border-l-2 px-3 my-4 h-[80vh]">
                    <h1 className = "underline text-6xl font-bold leading-[6rem]">Chua<br/>Zhong Ding</h1>
                    <p className = "ml-4 m-6">An Aspiring Software Developer with a passion for creating Software that <br/> <Highlight>improves people's lives.</Highlight> </p>
                    <p className = "text-base text-highlightColor underline">Scroll for More</p>
                </div>}
            </div>
            <Cursor />
        </div>
        
        </>
    )
}

export default ShortDescContainer;