import React,{useEffect,useState} from "react";
export default function Heading(props){
    const [idx,setIdx] = useState(0)
    useEffect(()=>{
        const interval = setInterval(()=>{
            setIdx(idx=>idx+1)
        },100)
        return ()=>clearInterval(interval)
    })
    return(
        <h2>"{props.children.substring(0,idx)}<span class = "type"></span>"</h2>

    )
}