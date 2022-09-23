import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../../context';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <>
                <div className='profileNav'>
                    <ProfileButton user={sessionUser} />
                    <NavLink to="/spots/new" className="link"> Add a spot</NavLink>
                </div>
            </>
        );
    } else {
        sessionLinks = (
            <>
                <div className='profileNav'>
                    <LoginFormModal /> &nbsp;
                    <NavLink to="/signup">Sign Up       </NavLink>
                </div>
            </>
        );
    }

    return (
        <ul>
            <li className='navLinks'>
                <NavLink exact to="/" className="link">Home  </NavLink>
                {isLoaded && sessionLinks}
            </li>
        </ul>
    );
}

export default Navigation;
