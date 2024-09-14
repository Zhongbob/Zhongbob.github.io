import React from "react";
import { Contact } from "../misc/types";
import ContactItem from "../components/ContactItem";
import Highlight from "../components/Highlight";
import Heading from "../components/Heading";
import contactDetails from "../data/contactDetails";

const ContactSection: React.FC = () => {
    return (
        <section>
            <Heading className="mt-8">Contact Me</Heading>
        <div className="flex flex-wrap w-10/12 mx-auto my-8 justify-center gap-8">
            {contactDetails.map((contact: Contact) => (
                <ContactItem {...contact} />
            ))}
        </div>
        </section>
    )
}

export default ContactSection