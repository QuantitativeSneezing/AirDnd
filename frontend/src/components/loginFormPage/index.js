import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import './LoginForm.css';
function LoginFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    if (sessionUser) return (
        <Redirect to="/" />
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({ credential, password }))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
    }
    function demoLogin() {
        return dispatch(sessionActions.login({ credential: "demo@user.io", password: "password" }))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
    }
    return (
        <div className='notLoginRoot'>
            <form onSubmit={handleSubmit} id="login">
                <div>
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
                <div className='centerButtons'>
                <button type="submit">Log In</button>
                <button onClick={demoLogin}>Log in as Demo user</button>
                </div>
            </form>

        </div>
    );
}

export default LoginFormPage;
