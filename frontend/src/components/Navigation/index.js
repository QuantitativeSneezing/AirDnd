import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginFormModal from '../../context';
import { SignupFormModal } from '../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons'
// import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { useDropdown } from '../../context/DropdownContext';
import * as sessionActions from '../../store/session';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory();
    const dispatch = useDispatch();

    const { dropdown, setDropdown } = useDropdown();
    function goHome() {

        history.push('/')
    }
    const setDropDown = () => {
        dropdown ? setDropdown(false) : setDropdown(true)
    }

    const addSpot = () => {
        setDropDown(false)
        history.push('/spots/new')
    }
    // const addNewUser = () => {
    //     history.push('/signup')
    // }
    //changed to modal
    const logout = (e) => {
        e.preventDefault();
        setDropDown(false)
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
                    {dropdown && (
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
                    {dropdown && (
                        <div className="smallerProfile-dropdown" >
                            <LoginFormModal />
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
