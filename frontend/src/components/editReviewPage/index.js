import React, { useState } from "react";
import { useDispatch} from "react-redux";
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

            <button type="submit">
                Update Review
            </button>
        </form>
    );
}
export default EditReviewFormPage
