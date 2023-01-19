import React, { useState, useEffect, } from "react";
import { useDispatch, useSelector, } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import * as bookingActions from '../../store/bookings';
import * as spotActions from "../../store/spots";
// import DatePicker from "react-datepicker";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './BookingForm.css'
function BookingFormPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const [errors, setErrors] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);
    const [disableSubmit, setDisableSubmit] = useState(true)
    const [date, setDate] = useState(new Date());
    // const sessionUser = useSelector(state => state.session.user);
    const spots = useSelector(state => state.spots.spots)
    const bookings = useSelector(state => state.bookings)
    let nights = 0
    if (date&& date.length>1){
        //formula to get nights lol
        date[1].setHours(0,0,0)
        nights= Math.floor((date[1].getTime()- date[0].getTime())/ (1000 * 3600 * 24))
        console.log ("CALCULATED NIGHTS :", nights)
    }
    useEffect(() => {
        if (validationErrors.length === 0) {
            setDisableSubmit(false)
        } else {
            setDisableSubmit(true)
        }
    }, [validationErrors])
    useEffect(() => {
        dispatch(spotActions.getAllSpots());
    }, [dispatch]);

    useEffect(() => {
        const errors = [];
        if (false) {
            errors.push("Should not happen")
        }
        setValidationErrors(errors);
    }, [])

    useEffect(() => {
        dispatch(bookingActions.getSpotBookings(spotId))
    }, [dispatch]);


    console.log("THIS IS THE DATE :", date)
    console.log("BOOKINGS IN STATE :", bookings)
    const spot = spots.find(spot => spot.id == spotId)
    async function handleSubmit() {
        if (date.length>1){
            console.log("SUBMITTING BOOKING")
            // e.preventDefault();
            const bookingToSend = {
                startDate: date[0],
                endDate: date[1],
                spotId,
            }
            const booking = await dispatch(bookingActions.addSpotBooking(bookingToSend))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors([data.errors]);
                    console.log("ERRORS RETURNED :", data.errors)
                });
            console.log("FINISHED DISPATCH TO BOOKINGS RESULT :", booking)
            if (booking) {
                console.log("NO ERROR DETECTED AT FIRST")
                history.push(`/bookings/personal`);
            }
        }
    }
    if (!spot) {
        return (
            null
        )
    }
    console.log("ERROR ARRAY :", errors)
    return (
        <div className="bookingRoot">
            <form onSubmit={handleSubmit} className="reviewForm">
                <div className="spacer">    </div>
                <div className="errors">
                    {errors.map((error, idx) => <div key={idx}>{error}</div>)}
                    {
                        validationErrors.map(error => (
                            <div key={error}>{error}</div>
                        ))}
                </div>
                <div className="bookingInfo">
                    <div className="bookingformTop"><span className="price">${spot.price}</span>  night</div>
                </div>
                <div div className="formItem">
                    {/* <DatePicker /> */}
                    {/* <DatePicker
                        controls={['calendar']}
                        display="inline"
                        touchUi={true}
                    /> */}
                    {/* (TEMPORARY NIGHT COUNT) */}
                    {/* <label>
                        <select onChange={updateNights} value={nights} className="inputField" >
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </select>
                    </label> */}
                </div>
                <Calendar
                    onChange={setDate}
                    value={date}
                    selectRange={true}
                    // set minDate to be now to prevent booking before then
                    minDate= {new Date()}
                />

                <div className="totals">
                    ${spot.price * nights} total
                </div>
                <div>
                    <button onClick={handleSubmit} type="button" disabled={disableSubmit} className="submitButton">Book this Spot</button>
                    {/* <button type="submit" disabled={disableSubmit} className="submitButton">Book button instead</button> */}

                </div>
            </form>
        </div>
    );
}
export default BookingFormPage
