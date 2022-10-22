import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { useDropdown } from "../../context/DropdownContext";

import './SignupForm.css'
function SignupFormPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [errors, setErrors] = useState([]);
  const { setDropdown } = useDropdown();

  if (sessionUser) return <Redirect to="/" />;
  const cancelSubmit = (e) => {
    history.push('/')
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log ("this is the pass, and confirm", password, confirmPassword)
    if (password === confirmPassword) {
      setErrors([]);
      const result =await dispatch(sessionActions.signup({ email, username, password, firstName, lastName }))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
      console.log("SIGNUP RESULT :", result)
      if (result) {
        // console.log ("should be fine now??? :",result)
        setDropdown(false)
        return result
      }
    } else{
      return setErrors(['Confirm Password field must be the same as the Password field']);
    }
  };

  return (
    <div className="signUpRoot">
      <form onSubmit={handleSubmit}>
        <div className="errors">
          {errors.map((error, idx) => <div key={idx} className="error">{error}</div>)}
        </div>
        <div className="formItem">
          Email

          <label>
            <input
              className="inputField"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="formItem">
          Username

          <label>
            <input
              className="inputField"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="formItem">
          Password
          <label>

            <input
              className="inputField"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="formItem">
          Confirm Password
          <label>
            <input
              className="inputField"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="formItem">
          First Name
          <label>

            <input
              className="inputField"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
        </div>


        <div className="formItem">
          Last Name
          <label>

            <input
              className="inputField"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label></div>
        <div className="formItem"> <button type="submit" className="submitButton">Sign Up</button></div>
        {/* <div className="formItem"> <button onClick={cancelSubmit} className="submitButton">Cancel</button></div> */}
      </form>
    </div>
  );
}

export default SignupFormPage;
