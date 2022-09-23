import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import * as reviewActions from '../../store/reviews';
import './ReviewForm.css'

function ReviewFormPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(1)
    const [errors, setErrors] = useState([]);

    const updateStars = (e) => setStars(e.target.value);
    function handleSubmit(e) {
        e.preventDefault();
        const reviewToSend= {review, stars: Number(stars)}
        const done = dispatch(reviewActions.createReview(reviewToSend, spotId))
        if (done){
            console.log ("DONE NOW :", done)
        history.push(`/spots/${spotId}`);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <label>
                Review
                <input
                    type="text"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                />
            </label>
            <label>
                Stars
                <select onChange={updateStars} value={stars}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
            </label>

            <button type="submit">Create Review</button>
        </form>
    );
}

export default ReviewFormPage;
