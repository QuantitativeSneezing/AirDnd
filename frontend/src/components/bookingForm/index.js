import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import * as bookingActions from '../../store/bookings';
import './BookingForm.css'

function BookingFormPage({ }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(1)
    const [errors, setErrors] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);
    const [disableSubmit, setDisableSubmit] = useState(true)
    useEffect(() => {
        if (validationErrors.length === 0) {
            setDisableSubmit(false)
        } else {
            setDisableSubmit(true)
        }
    }, [validationErrors])

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

    const [nights, setNights] = useState(1)
    const updateNights = (e) => setNights(e.target.value);
    const spots = useSelector(state => state.spots.spots)
    const bookings = useSelector(state => state.bookings)
    console.log ("BOOKINGS IN STATE :", bookings)
    const spot = spots.find(spot => spot.id = spotId)
    async function handleSubmit(e) {
        e.preventDefault();
        history.push(`spots/${spotId}`)
    }
    if (!spot) {
        return null;
    }
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
