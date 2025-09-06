import React from "react";

const ContactList = ({contacts, updateContact, updateCallback}) => {

    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE",
            }
            const response = await fetch(`http://127.0.0.1:5000/api/contacts/delete_contact/${id}`, options);
            if (response.status === 200) updateCallback();
            else console.error("Failed to delete.");
        } catch (e) {
            alert(error);
        };
    };

    return(
        <div className="container mt-4 bg-dark text-light">
            <h2>Contacts</h2>
            <table className="table table-striped table-bordered table-dark">
                <thead className="thead-dark">
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => (
                        <tr key={contact.id}>
                            <td>{contact.firstName}</td>
                            <td>{contact.lastName}</td>
                            <td>{contact.email}</td>
                            <td>
                                <button onClick={() => updateContact(contact)} className="btn btn-primary btn-sm me-2">Update</button>
                                <button onClick={() => onDelete(contact.id)} className="btn btn-danger btn-sm">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ContactList