import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, } from "react-redux";
import { useHistory } from "react-router-dom";
import * as bookingActions from '../../store/bookings';
import * as spotActions from "../../store/spots";
import './PersonalBookings.css'
function PersonalBookingPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isLoaded, setIsLoaded]= useState(false)
    const sessionUser = useSelector(state => state.session.user);
    const spots = useSelector(state => state.spots.spots)
    const bookings = useSelector(state => state.bookings)
    const deleteBooking = (bookingId) => {
        dispatch(bookingActions.deleteSpotBooking(bookingId))
    }
    useEffect(() => {
        dispatch(spotActions.getAllSpots());
    }, [dispatch]);
    const personalBookings = Object.values(bookings.bookings)
    console.log("PERSONALBOOKINGS :", personalBookings)
    useEffect(() => {
        dispatch(bookingActions.getPersonalBookings(sessionUser.id))
        setIsLoaded(true)
    }, [dispatch]);
    console.log("INFO IN BOOKINGS PAGE PERSONAL :", spots, bookings)
    let yourBookings = (
        <div>
            Sorry, no bookings found
        </div>
    )
    if (personalBookings.length && spots.length) {
        console.log("BOOKINGSARRAY :", personalBookings)
        yourBookings = personalBookings.map(group =>
            <div className="individualBooking">
                <div className="IndividualBookingInfo">
                    <div className="locations__location" onClick={() => history.push(`/spots/${group.Spot.id}`)}>
                        <div className='image__wrapper'>
                            <img src={group.Spot.SpotImages[0].url || 'https://i.imgur.com/g24gIGL.png'} alt="Spot" className='picture'></img>
                        </div>
                    </div>
                    {group.Spot.name}, from  {(group.startDate).slice(0, 10)} to {group.endDate.slice(0, 10)}
                </div>
                <button className="submitButton" onClick={() => deleteBooking(group.id)}>Delete this booking</button>
            </div>)
    }
    return (
        <div className="personalRoot">
            <div className="personalBookingsTitle">
                BOOKINGS OF YOU:

                <div className="wideBookings">
                    {isLoaded && yourBookings}
                </div>
            </div>
        </div>
    )
}

export default PersonalBookingPage
