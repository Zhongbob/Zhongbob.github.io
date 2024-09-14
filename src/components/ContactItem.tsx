import React from "react";
import { Contact } from "../misc/types";

const ContactItem: React.FC<Contact> = ({ icon, href, method }) => {
    return (
        <a className="w-12 h-12 lg:w-16 lg:h-16 flex flex-col items-center row-span hover:backdrop-brightness-125 transition-all duration-200 rounded-lg" target = "_blank" href = {href}>
            <img src={`static/contact/${icon}`} alt={method} className="w-full h-full rounded-full bg-white border-2 border-white object-contain" />
        </a>
    )
}
export default ContactItem