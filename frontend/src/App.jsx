import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './AuthContext'
import ContactList from './ContactList'
import ContactModal from './Modal'
import AuthPage from './AuthPage'
import Navbar from './Navbar'
import './App.css'

// Componente principal de la aplicación que maneja los contactos
const ContactsApp = () => {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({});
  const { isAuthenticated } = useAuth();

  // fetching contacts list
  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    }
  }, [isAuthenticated]);

  const fetchContacts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/contacts', {
        credentials: 'include', // Importante para enviar cookies de sesión
      });
      
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
        console.log(data.contacts);
      } else {
        console.error('Failed to fetch contacts');
        setContacts([]);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
    }
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
      <Navbar />
      <div className="bg-dark min-vh-100">
        <ContactList 
          contacts={contacts} 
          updateContact={openEditModal} 
          updateCallback={onUpdate}
        />
        <ContactModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          openCreateModal={openCreateModal}
          currentContact={currentContact}
          onUpdate={onUpdate}
        />
      </div>
    </>
  )
}

// Componente wrapper que decide qué mostrar basado en el estado de autenticación
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <ContactsApp /> : <AuthPage />;
}

// Componente principal que envuelve todo con el AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
