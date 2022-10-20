import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useDropdown } from '../../context/DropdownContext';
import './LoginForm.css';
function LoginFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const { setDropdown } = useDropdown();
    if (sessionUser) return (
        <Redirect to="/" />
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const result = await dispatch(sessionActions.login({ credential, password }))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
            if (result) {
                // console.log ("should be fine now??? :",result)
                setDropdown(false)
                return result
              }
    }
    async function demoLogin() {
        const result = await dispatch(sessionActions.login({ credential: "demo@user.io", password: "password" }))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
            if (result) {
                // console.log ("should be fine now??? :",result)
                setDropdown(false)
                return result
              }
    }
    return (
        <div className='notLoginRoot'>
            <form onSubmit={handleSubmit} id="login">
                <div className='errors'>
                    {errors.map((error, idx) => <div key={idx}>{error}</div>)}
                </div>
                <div className="formItem">
                    Username or Email
                    <label>
                        <input
                            className="inputField"
                            type="text"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
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
                <div>
                    <button type="submit" className='submitButton'>Continue</button>
                </div>
                <div>
                    <button onClick={demoLogin} className='submitButton'>Continue as Demo user</button>
                </div>
            </form>

        </div>
    );
}

export default LoginFormPage;
