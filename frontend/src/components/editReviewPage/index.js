import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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
    useEffect(() => {
        if (validationErrors.length === 0) {
            setDisableSubmit(false)
        } else {
            setDisableSubmit(true)
        }
    }, [validationErrors])
    useEffect(() => {
        const errors = [];
        if (!review) {
            errors.push("Please add text to your review")
        }
        setErrors(errors);
    }, [stars, review])
    const updateStars = (e) => setStars(e.target.value);
    function handleSubmit(e) {
        e.preventDefault();
        const reviewToSend = { review, stars: Number(stars) }
        const done = dispatch(reviewActions.updateReview(reviewToSend, reviewId))
        if (done) {
            history.goBack();
        }
    }
    return (
        <div className="notRoot">
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
                        <input
                            className="inputField"
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
                        <select onChange={updateStars} value={stars} className="inputField" >
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </select>
                    </label>
                </div>

                <button type="submit" disabled={disableSubmit} className="submitButton">Edit Review</button>
            </form>
        </div>
    );
}
export default EditReviewFormPage
