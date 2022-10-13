import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginFormModal from '../../context';
import { SignupFormModal } from '../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import * as sessionActions from '../../store/session';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory();
    const dispatch = useDispatch();

    const [dropped, setDropped] = useState(false)
    function goHome() {
        history.push('/')
    }
    const setDropDown = () => {
        dropped ? setDropped(false) : setDropped(true)


    }

    const addSpot = () => {
        history.push('/spots/new')
    }
    const addNewUser = () => {
        history.push('/signup')
    }
    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };
    let sessionLinks;

    if (sessionUser) {
        sessionLinks =
            <>
                <div>
                    <div className='circle' onClick={setDropDown} >
                        <FontAwesomeIcon icon={faBars} />
                        &nbsp;
                        <FontAwesomeIcon icon={faUserCircle} className="userIcon" />
                    </div>
                    {dropped && (
                        <div className="profile-dropdown">
                            <div>{sessionUser.username}</div>
                            <div className="redirector" onClick={addSpot}><span className='centerRedirector'> Add a spot</span></div>
                            <div className='redirector' onClick={logout}><span className='centerRedirector'>Log Out</span></div>
                        </div>
                    )}
                </div>
            </>

    } else {
        sessionLinks = (
            <>
                <div>
                    <div className="circle" onClick={setDropDown}>
                        <FontAwesomeIcon icon={faBars} />
                        &nbsp;
                        <FontAwesomeIcon icon={faUserCircle} className="userIcon" />
                    </div>
                    {dropped && (
                        <div className="smallerProfile-dropdown" >
                                <LoginFormModal/>
                            {/* <div className='redirector' onClick={addNewUser}>Sign Up</div>
                             */}
                             <SignupFormModal />
                        </div>
                    )}
                </div>
            </>
        );
    }
    return (
        <div>
            <div className='navBar'>
                <div className='navLinks'>
                    <img src='https://i.imgur.com/Jo809dL.png' className='logo' onClick={goHome} alt="return to homepage" />
                    <div className='search'> </div>
                    {isLoaded && sessionLinks}
                </div>
            </div>

        </div>
    );
}

export default Navigation;
