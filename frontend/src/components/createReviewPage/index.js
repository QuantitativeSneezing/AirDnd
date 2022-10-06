import React, { useState, useEffect } from "react";
import { useDispatch, } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import * as reviewActions from '../../store/reviews';
import './ReviewForm.css'

function ReviewFormPage() {
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
    const updateStars = (e) => setStars(e.target.value);

    async function handleSubmit(e) {
        e.preventDefault();
        const reviewToSend = { review, stars: Number(stars) }
        const done = dispatch(reviewActions.createReview(reviewToSend, spotId))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
        if (done) {
            console.log("DONE NOW :", done)
            history.push(`/spots/${spotId}`);
        }
    }
    return (
        <div className="notReviewRoot">
            <form onSubmit={handleSubmit} className="reviewForm">
                <div className="spacer">    </div>
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
                        <select onChange={updateStars} value={stars} className="inputField" >
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </select>
                    </label>
                </div>
                <div>
                    <button type="submit" disabled={disableSubmit} className="submitButton">Create Review</button>

                </div>
            </form>
        </div>
    );
}

export default ReviewFormPage;
