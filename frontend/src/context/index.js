import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import LoginFormPage from '../components/loginFormPage'
import SignUpFormPage from '../components/SignupFormPage'
import { useDropdown } from './DropdownContext';
function LoginFormModal() {
  const [showModal, setShowModal] = useState(false);
  const { setSessionLinksClass } = useDropdown();
  const closeHandle = () => {
    console.log("CLOSED")
    setShowModal(false)
  }
  const openHandle = () => {
    console.log("OPENED")
    setShowModal(true)
    setSessionLinksClass("hidden")
  }
  return (
    <>
      <div className='modalRoot'>
        <div onClick={openHandle} className="redirector">Log In</div>
        {showModal && (
          <Modal onClose={closeHandle}>
            <LoginFormPage />
          </Modal>
        )}
      </div>
    </>
  );
}

export function SignupFormModal() {
  const [showModal, setShowModal] = useState(false);
  const { setSessionLinksClass } = useDropdown();
  let redirectionclass = "redirector"

  function modalHandler() {
    setShowModal(true)
    setSessionLinksClass("hidden")
    redirectionclass= "hidden"
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
