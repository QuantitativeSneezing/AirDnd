import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import LoginFormPage from '../components/loginFormPage'
import SignUpFormPage from '../components/SignupFormPage'
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

export function SignupFormModal() {
  const [showModal, setShowModal] = useState(false);
function modalHandler () {
  setShowModal(true)
  // setDropdown(false)
}
;
return (
  <>
    <div className='modalRoot'>
      <div onClick={modalHandler} className="redirector">Sign Up</div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <SignUpFormPage />
        </Modal>
      )}
    </div>
  </>
);
}
export default LoginFormModal;
