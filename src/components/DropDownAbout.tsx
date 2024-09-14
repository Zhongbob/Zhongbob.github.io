import React, {useState,useEffect} from "react";
export default function DropDown(){
    const [down, setDown] = useState(false);
    useEffect(() => {
        // var idx = 0;
        const downTimeout = setTimeout(() => {
            setDown(true)
        },3500)
        
        return () => clearTimeout(downTimeout);
    }, [])
    return(<>
            <div
            className="inline-block w-6 h-6 bg-no-repeat bg-cover mr-2"
            style={{ 
                backgroundImage: "url('dropdown.png')", 
                backgroundPosition: down?"0 0":"-24px 0" 
            }}
            >
            </div>
            </>
        )
}