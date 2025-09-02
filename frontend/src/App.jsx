import { useState, useEffect } from 'react'
import ContactList from './ContactList';
import ContactModal from './Modal'
import './App.css'

function App() {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({});

  // fetching contacts list
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const response = await fetch('http://127.0.0.1:5000/contacts');
    const data = await response.json();
    setContacts(data.contacts);
    console.log(data.contacts);
  };

  const closeModal = () => {
    if (isModalOpen) setIsModalOpen(false);
  };
  const openCreateModal = () => {
    setCurrentContact({});
      if (!isModalOpen) setIsModalOpen(true);
  };
  const openEditModal = (contact) => {
    if (isModalOpen) return;
    setCurrentContact(contact);
    setIsModalOpen(true);
  };

  const onUpdate = () => {
    closeModal();
    fetchContacts();
  };

  return (
    <>
    <ContactList contacts={contacts} updateContact={openEditModal} updateCallback={onUpdate}/>
    <ContactModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        openCreateModal={openCreateModal}
        currentContact={currentContact}
        onUpdate={onUpdate}
      />
    </>
  )
}

export default App
