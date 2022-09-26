import React, { useState } from 'react';
import { Modal } from './Modal';
import LoginFormPage from '../components/loginFormPage'
function LoginFormModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className='modalRoot'>
        <div onClick={() => setShowModal(true)} className="redirector">Log In</div>
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <LoginFormPage />
          </Modal>
        )}
      </div>
    </>
  );
}

export default LoginFormModal;
