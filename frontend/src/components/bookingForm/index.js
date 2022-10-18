import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import * as bookingActions from '../../store/bookings';
import * as spotActions from "../../store/spots";
import './BookingForm.css'

function BookingFormPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(1)
    const [errors, setErrors] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);
    const [disableSubmit, setDisableSubmit] = useState(true)
    // const sessionUser = useSelector(state => state.session.user);
    const [nights, setNights] = useState(1)
    const [startDate, setStartDate]= useState ("")
    const updateNights = (e) => setNights(e.target.value);
    const spots = useSelector(state => state.spots.spots)
    const bookings = useSelector(state => state.bookings)
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
        if (review && review.length < 3) {
            errors.push("Reviews must be at least 3 characters long")
        }
        setValidationErrors(errors);
    }, [stars, review])

    useEffect(() => {
        dispatch(bookingActions.getSpotBookings(spotId))
    }, [dispatch]);


    console.log("BOOKINGS IN STATE :", bookings)
    const spot = spots.find(spot => spot.id = spotId)
    async function handleSubmit(e) {
        e.preventDefault();
        const bookingToSend = {
            startDate: `2023-01-01 00:00:00`,
            endDate: "2024-01-01 00:00:00",
            spotId,
        }
        const done = dispatch(bookingActions.addSpotBooking(bookingToSend))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors([data.errors]);
                console.log("ERRORS RETURNED :", data.errors)
            });
        console.log("FINISHED DISPATCH TO BOOKINGS RESULT :", done)
        history.push(`spots/${spotId}`)
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
                    Nights
                    <label>
                        <select onChange={updateNights} value={nights} className="inputField" >
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </select>
                    </label>
                </div>

                <div className="totals">
                    ${spot.price * nights} total
                </div>
                <div>
                    <button type="submit" disabled={disableSubmit} className="submitButton">Book this Spot</button>

                </div>
            </form>
        </div>
    );
}
export default BookingFormPage
