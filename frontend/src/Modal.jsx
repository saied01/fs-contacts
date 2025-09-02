import ContactForm from "./ContactForm";

const ContactModal = ({isModalOpen, closeModal, openCreateModal, currentContact, onUpdate}) => {
    return (
      <>
        <button className='btn btn-primary custom-btn' onClick={openCreateModal}>
          Create new Contact
        </button>
        
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-custom">
              <div className="modal-content bg-dark text-light">
                <button
                  className="btn-close btn-close-white m-2"
                  aria-label="close"
                  onClick={closeModal}
                ></button>
                <ContactForm existingContact={currentContact} updateCallback={onUpdate}/>
              </div>
            </div>
          </div>
        )}
      </>
    )
}

export default ContactModal