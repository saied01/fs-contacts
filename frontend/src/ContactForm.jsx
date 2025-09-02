import { useState } from "react";

const ContactForm = ({ existingContact = {}, updateCallback }) => {
    const [firstName, setFirstName] = useState(existingContact.firstName || "");
    const [lastName, setLastName] = useState(existingContact.lastName || "");
    const [email, setEmail] = useState(existingContact.email || "");

    const updating = Object.entries(existingContact).length !== 0;


    const onSubmit = async (e) => {
        e.preventDefault();

        // create js object for contact
        const data = {
            firstName,
            lastName,
            email,
        };
        const url = "http://127.0.0.1:5000/" + (updating ? `update_contact/${existingContact.id}` : "create_contact");
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                'Content-Type': "application/json"
            },
            // make object to json string and include into body of request
            body: JSON.stringify(data)
        };

        const response = await fetch(url, options);
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json()
            alert(data.message);
        } else {
            updateCallback();
        };
    };

    return(
        <form className="container m-3" onSubmit={onSubmit}>
            <div className="form-group bg-dark text-light">
                <label htmlFor="firstName" className="form-label text-light">First Name:</label>
                <input type="text"
                className="form-control w-50 bg-dark text-light border-secondary"
                id="firstName" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}/>
            </div>
            <div className="form-group bg-dark text-light">
                <label htmlFor="lastName" className="form-label text-light">Last Name:</label>
                <input type="text" 
                className="form-control w-50 bg-dark text-light border-secondary"
                id="lastName" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}/>
            </div>
            <div className="form-group bg-dark text-light">
                <label htmlFor="email" className="form-label text-light">Email:</label>
                <input type="text"
                className="form-control w-50 bg-dark text-light border-secondary"
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <button type="submit" className="btn btn-success mt-3">{updating ? "Update" : "Create"}</button>
        </form>
    )
}

export default ContactForm