import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginFormModal from '../../context';
import { SignupFormModal } from '../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import onClickOutside from "react-onclickoutside";
// import { faGithub } from '@fortawesome/free-brands-svg-icons'
import DropdownProvider, { useDropdown } from '../../context/DropdownContext';
import * as sessionActions from '../../store/session';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory();
    const dispatch = useDispatch();

    const { dropdown, setDropdown, sessionLinksClass, setSessionLinksClass } = useDropdown();
    function goHome() {
        history.push('/')
    }
    const dropDownHandle = () => {
        sessionUser ? setSessionLinksClass("profile-dropdown") : setSessionLinksClass("smallerProfile-dropdown")
        setDropDown();
    }
    const setDropDown = () => {
        console.log("new Links class :", sessionLinksClass)
        dropdown ? setDropdown(false) : setDropdown(true)
    }
    useEffect(() => {
        console.log("NEW DROPDOWN :", dropdown)
    }, [dropdown])
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
    }
    let dropDownRef= useRef();
    //Allows menu to close on click outside
    //Why is this so complicated lol
    // useEffect(() => {
    //     if (!dropdown) return;

    //     const closeMenu = (e) => {
    //         if (!dropDownRef.current.contains(e.target))
    //         setDropDown(false);
    //     };

    //     document.addEventListener('click', closeMenu);

    //     return () => document.removeEventListener("click", closeMenu);
    // }, [dropdown]);
    let sessionLinks;
    // const hideeClass= () =>{
    //     sessionLinksClass= "hidden"
    // }

    if (sessionUser) {
        sessionLinks =
            <>
                <div ref={dropDownRef}>
                    <div className={"circle"} onClick={dropDownHandle} >
                        <FontAwesomeIcon icon={faBars} />
                        &nbsp;
                        <FontAwesomeIcon icon={faUserCircle} className="userIcon" />
                    </div>
                    {dropdown && (
                        <div className={sessionLinksClass}>
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
                <div ref={dropDownRef}>
                    <div className="circle" onClick={dropDownHandle}>
                        <FontAwesomeIcon icon={faBars} />
                        &nbsp;
                        <FontAwesomeIcon icon={faUserCircle} className="userIcon" />
                    </div>
                    {dropdown && (
                        <div className={sessionLinksClass} >
                            <LoginFormModal />
                            <SignupFormModal />
                        </div>
                    )}
                </div>
            </>
        );
    }
    return (
        <div>
            <div className='navBar' >
                <div className='navLinks'>
                    <img src='https://i.imgur.com/Jo809dL.png' className='logo' onClick={goHome} alt="return to homepage" />
                    <div className='search'> </div>
                    {/* <LoginFormModal />
                    <SignupFormModal /> */}
                    {isLoaded && sessionLinks}
                </div>
            </div>

        </div>
    );
}

export default Navigation;
