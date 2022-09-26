import './IndividualSpotPage.css'
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spots";
import * as reviewActions from '../../store/reviews'

function IndividualSpotPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const sessionUser = useSelector(state => state.session.user);
    const [canReview, setCanReview] = useState(true)
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
    let reviewItems;
    let buttons;
    let addReviewButton;
    let notOwned = true;
    let notYourReviews = [];
    let personalReview;
    let image = 'https://i.imgur.com/g24gIGL.png';
    if (spots[0]) {
        spot = spots.find(spot => spot.id == spotId)
    }
    const allReviews = useSelector(state => state.reviews.reviews)
    let reviews = allReviews[0]
    if (allReviews[1]) {
        reviews = [allReviews[1]]
    }
    console.log("ALL REVIEWS :", allReviews, "REVIEWS :", reviews)
    console.log("ALL SPOTS: ", spots)
    console.log("CURRENT SPOT", spot)
    console.log("USER :", sessionUser)
    if (spot) {
        if (spot.SpotImages[0]) {
            image = spot.SpotImages[0].url;
        }

    }
    if (reviews) {
        if (spot) {
            reviewItems =
                <div className='reviewAggregate'>
                    <div className='reviewContents'>
                        {
                            reviews.map(review =>

                                <div key={review.id} className="individualReview">

                                    <div>{review.User.username}</div>
                                    <div>{review.stars} stars</div>
                                    <div>{review.review} </div>
                                </div>
                            )
                        }
                    </div>
                </div>
        }

        // if (reviews instanceof Object){
        //     reviews= [reviews]
        // }


        if (sessionUser && spot) {
            let reviewSum = 0;
            for (let j = 0; j < reviews.length; j++) {
                reviewSum += (reviews[j].stars)
            }
            const reviewAvg = (Math.round((reviewSum / reviews.length) * 100)) / 100
            //Airbnb really does put ★ New for listings
            if (Number.isNaN(reviewAvg)) {
                spot.average = "New"
            }
            else {
                spot.average = reviewAvg
            }
            if (sessionUser.id === spot.ownerId) {
                notOwned = false;
                buttons =
                    <div>
                        <button onClick={deleteThis} className="optionButton">
                            Delete this spot
                        </button>
                        <button onClick={movePage} className="optionButton">
                            Edit this spot's details
                        </button>
                    </div>
            }
            let yourReview = reviews.find(review => review.userId == sessionUser.id)
            if (yourReview) {
                personalReview =
                    <div className='individualReview'>
                        <div>{sessionUser.username}</div>
                        <div>{yourReview.stars} stars</div>
                        <div>{yourReview.review} </div>
                        <button onClick={() => editReviewRedirect(yourReview.id)} disabled={false} className="overrideButton" >
                            Edit Your Review
                        </button>
                        <button onClick={() => deleteThisReview(yourReview.id)} disabled={false} className="overrideButton"  >
                            Delete Your Review
                        </button>
                    </div>
            } else if (notOwned) {
                addReviewButton =
                    <button onClick={reviewRedirect} className="overrideButton" >
                        Review this spot
                    </button>
            }
            for (let i = 0; i < reviews.length; i++) {
                if (reviews[i].userId !== sessionUser.id) {
                    notYourReviews.push(reviews[i])
                }
            }
            reviewItems =
                <div className='reviewAggregate'>

                    {personalReview}
                    <div className='reviewContents'>
                        {
                            notYourReviews.map(review =>
                                <div key={review.id} className="individualReview">
                                    <div>{review.User.username}</div>
                                    <div>{review.stars} stars</div>
                                    <div>{review.review} </div>
                                </div>
                            )
                        }
                    </div>
                </div>
        }
    }
    if (!spot) {
        return null;
    }
    return (
        <div className='notSpotRoot'>
            <div className='container'>
                {reviews &&
                    (<div className='title'>
                        <div className='bigTitle'>{spot.name}</div>
                        ★{spot.average}, {reviews.length} reviews
                    </div>)
                }

                <img src={image} className="mainImage"></img>
                <div className='spotInfo'>

                </div>
                <div className='separator'></div>
                {buttons}
                <div className='reviewHeader'>
                    Reviews:
                    {reviews && spot && (<span>
                        ★{spot.average} • {reviews.length} reviews
                    </span>
                    )}
                    <div className='reviewItems'>
                        {reviewItems}
                        {addReviewButton}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default IndividualSpotPage
