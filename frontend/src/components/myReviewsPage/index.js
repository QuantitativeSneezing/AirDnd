// this is currently deprecated
import './IndividualSpotPage.css'
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import * as reviewActions from '../../store/reviews'

function myReviews() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    useEffect(() => {
        dispatch(reviewActions.getSpotReviews(spotId))
    }, [dispatch]);

    const allReviews = useSelector(state => state.reviews.reviews)
    const reviews = allReviews[0]
    let reviewItems;

    if (reviews) {
        reviewItems =
            <ul>
                {
                    reviews.map(review =>
                        <li key={review.id}>
                            <div>{review.stars} stars</div>
                            <div>{review.review} </div>
                            <button onClick={() => editReviewRedirect(review.id)} disabled={false} >
                                EDIT THIS REVIEW
                            </button>
                            <button onClick={() => deleteThisReview(review.id)} disabled={false} >
                                DELETE THIS REVIEW
                            </button>
                        </li>
                    )
                }
            </ul>
    }
    return (
        <div>
            YOUR REVIEWS:
            {reviewItems}
            <button onClick={homeRedirect} disabled={false} >
                HOME
            </button>
        </div>
    );
}
export default myReviews
