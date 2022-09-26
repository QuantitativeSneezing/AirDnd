// import React, { useState, useEffect } from "react";
// import { useDispatch } from 'react-redux';
// import { useHistory } from "react-router-dom";
// import * as sessionActions from '../../store/session';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faBars, faUser } from '@fortawesome/free-solid-svg-icons'
// // import './Profile.css'
// function ProfileButton({ user }) {
//     const history = useHistory();
    // const dispatch = useDispatch();
//     const [showMenu, setShowMenu] = useState(false);

//     const openMenu = () => {
//         if (showMenu) return;
//         setShowMenu(true);
//     };

//     useEffect(() => {
//         if (!showMenu) return;

//         const closeMenu = () => {
//             setShowMenu(false);
//         };

//         document.addEventListener('click', closeMenu);

//         return () => document.removeEventListener("click", closeMenu);
//     }, [showMenu]);

    // const logout = (e) => {
    //     e.preventDefault();
    //     dispatch(sessionActions.logout());
    // };
    // const addSpot = () => {
    //     history.push('/spots/new')
    // }
//     return (
//         <div className="notRoot">

//             <div onClick={openMenu} className="profile">
                // <FontAwesomeIcon icon={faBars} />
//             </div>
            // {showMenu && (
            //     <div className="profile-dropdown">
            //         <div>{user.username} user.email}</div>
            //         <div className="redirector" onClick={addSpot}> Add a spot</div>
            //         <div>
            //             <button onClick={logout}>Log Out</button>
            //         </div>
            //     </div>
            // )}
//         </div>
//     );
// }
// export default ProfileButton;
