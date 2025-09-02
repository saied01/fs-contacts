import { useState, useEffect } from 'react'
import ContactList from './ContactList';
import ContactForm from './ContactForm';
import './App.css'

function App() {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // fetchin contacts list
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const response = await fetch('http://127.0.0.1:5000/contacts');
    const data = await response.json();
    setContacts(data.contacts);
    console.log(data.contacts);
  };

  const closeModal = () => setIsModalOpen(false);
  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true);
  };

  return (
    <>
    <ContactList contacts={contacts}/>
    <button className='btn btn-primary custom-btn' onClick={openCreateModal}>Create new Contact</button>
    { isModalOpen && (
      
      <div className="modal bg-dark text-light mt-4 custom-modal" tabIndex="-1">
      <div className='modal-content bg-dark text-light'>
        <span className="btn-close btn-close-white" onClick={closeModal}></span>
        <ContactForm/>
      </div>
    </div>
    )}
    </>
  )
}

export default App
