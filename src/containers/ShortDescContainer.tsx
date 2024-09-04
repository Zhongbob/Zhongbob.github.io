import React, {useRef,useEffect,useState} from "react";
import Cursor from "../components/Cursor";
import Highlight from "../components/Highlight";
import DropDown from "../components/DropDown";

const ShortDescContainer: React.FC = () => {

    
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isDescVisible, setIsDescVisible] = useState(false);
    const descRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const menuTimeout = setTimeout(() => {
        // Set the visibility state and trigger the fade-in
        setIsMenuVisible(true);
        
        const descTimeout = setTimeout(() => {
            setIsDescVisible(true)
        }, 2200);
        
        return () => clearTimeout(descTimeout);
        }, 1100);

        return () => clearTimeout(menuTimeout);
    }, []);
    return(
        <>
        <div className= "w-full h-full relative col-span-5">
            <div className = {`relative w-full bg-secondaryColor1 h-full 
                            ${isMenuVisible ? "translate-x-0":"-translate-x-full"}
                            transform transition-transform duration-[700ms] ease-out`}>
                <div ref = {descRef} className = "short-desc-container">
                    <div className = "bg-secondaryColor2 py-1 px-2 font-bold">
                        <DropDown />
                        ABOUT-ME
                    </div>
                    <div className = {`ml-3 border-l-2 px-3 my-4 h-[80vh] overflow-hidden transition-all duration-700 ${isDescVisible ? "max-h-[80vh]":"max-h-0"}`}>
                        <h1 className = "underline text-6xl font-bold leading-[6rem]">Chua<br/>Zhong Ding</h1>
                        <p className = "ml-4 m-6">An Aspiring Software Developer with a passion for creating Software that <br/> <Highlight>improves people's lives.</Highlight> </p>
                        <p className = "text-base text-highlightColor underline">Scroll for More</p>
                    </div>
                </div>
                
            </div>
            <Cursor />
        </div>
        </>
    )
}

export default ShortDescContainer;