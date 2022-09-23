import './IndividualSpotPage.css'
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spots";
import * as reviewActions from '../../store/reviews'

function IndividualSpotPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(spotActions.getAllSpots());
    }, [dispatch]);

    useEffect(() => {
        dispatch(reviewActions.getSpotReviews(spotId))
    }, [dispatch]);

    const movePage = () => {
        history.push(`/spots/${spotId}/edit`)
    }

    const deleteThis = async () => {
        await dispatch(spotActions.deleteSpot(spotId))
        history.push("/")
    }
    const deleteThisReview = async (reviewId) => {
        dispatch(reviewActions.deleteReview(reviewId))
    }
    const reviewRedirect = () => {
        history.push(`/spots/${spotId}/reviews`)
    }
    const editReviewRedirect = (reviewId) => {
        // console.log("THIS IS BEING PASSED TO THE REDIRECT :",reviewId)
        history.push(`/reviews/${reviewId}/edit`)
    }


    const spots = useSelector(state => state.spots.spots)
    let spot;
    if (spots[0]) {
        spot = spots.find(spot => spot.id == spotId)
    }
    const allReviews = useSelector(state => state.reviews.reviews)
    let reviews = allReviews[0]
    if (allReviews[1]){
        reviews=[allReviews[1]]
    }
    console.log("ALL REVIEWS :",allReviews, "REVIEWS :", reviews)
    console.log("ALL SPOTS: ", spots)
    console.log("CURRENT SPOT", spot)
    let reviewItems;
    if (reviews) {
        // if (reviews instanceof Object){
        //     reviews= [reviews]
        // }
        let notYourReviews= reviews;
        if (sessionUser){
            // notYourReviews.filter()
        }
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
    if (!spot) {
        return null;
    }
    return (
        <div>
          <img src=''></img>
            <ul>
                <li>
                    {spotId} IS THE SPOT'S ID
                </li>
                <li>
                    {spot.name} IS THE SPOT'S NAME
                </li>
                <li>
                    IT IS LOCATED IN {spot.city}, {spot.country}
                </li>
            </ul>
            <button onClick={deleteThis}>
                DELETE THIS SPOT
            </button>
            <button onClick={movePage} >
                EDIT THIS SPOT
            </button>
            <div>
                REVIEWS FOR THIS SPOT:
                {reviewItems}
                <button onClick={reviewRedirect} disabled={false} >
                    ADD YOUR OWN REVIEW
                </button>
            </div>
        </div>
    );
}
export default IndividualSpotPage
