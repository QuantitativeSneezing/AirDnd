import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import * as reviewActions from '../../store/reviews';
import './EditReviewForm.css'

function EditReviewFormPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { reviewId } = useParams();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(1)
    const [errors, setErrors] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);
    const [disableSubmit, setDisableSubmit] = useState(true)
    // const spotIdSaved = useSelector((state) => state.session);
    // const spots = useSelector(state => state.spots.spots)
    // const spot = spots.find(spot=> spot.id = spotId)
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
    const updateStars = (e) => setStars(e.target.value);
    function handleSubmit(e) {
        e.preventDefault();
        const reviewToSend = { review, stars: Number(stars) }
        const done = dispatch(reviewActions.updateReview(reviewToSend, reviewId))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
        if (done) {
            history.goBack();
        }
    }
    return (
        <div className="notReviewRoot">
            <form onSubmit={handleSubmit} className="reviewForm">
                <div className="errors">
                    {errors.map((error, idx) => <div key={idx}>{error}</div>)}
                    {
                        validationErrors.map(error => (
                            <div key={error}>{error}</div>
                        ))}
                </div>
                <div div className="formItem">
                    Review
                    <label>
                        <textarea
                            className="inputFieldLarge"
                            type="text"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div div className="formItem">
                    Stars
                    <label>
                        <select onChange={updateStars} className="inputField" >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>
                    </label>
                </div>
                <div>
                    <button type="submit" disabled={disableSubmit} className="submitButton">Edit Review</button>

                </div>
            </form>


        </div>
    );
}
export default EditReviewFormPage
