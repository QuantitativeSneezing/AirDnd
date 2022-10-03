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
        const deleteResult = await dispatch(reviewActions.deleteReview(reviewId))
        console.log("RESULT :", deleteResult);
    }
    const reviewRedirect = () => {
        history.push(`/spots/${spotId}/reviews`)
    }
    const editReviewRedirect = (reviewId) => {
        // console.log("THIS IS BEING PASSED TO THE REDIRECT :",reviewId)
        history.push(`/reviews/${reviewId}/edit`)
    }


    const spots = useSelector(state => state.spots.spots)
    const allReviews = useSelector(state => state.reviews.reviews)
    let reviews = [];
    if (allReviews[0]) {
        reviews = allReviews[0]
    }
    let spot;
    let reviewItems;
    let reviewAvg = NaN;
    let buttons;
    let addReviewButton;
    let notOwned = true;
    let notYourReviews = [];
    let personalReview;
    let image = 'https://i.imgur.com/g24gIGL.png';
    if (spots[0]) {
        spot = spots.find(spot => spot.id == spotId)
    }
    console.log("ALL REVIEWS", allReviews, "REVIEWS :", reviews)
    console.log("ALL SPOTS: ", spots)
    console.log("CURRENT SPOT", spot)
    console.log("USER :", sessionUser)
    if (spot) {
        if (spot.SpotImages[0]) {
            image = spot.SpotImages[0].url;
        }
    }
    if (spot) {
        if (reviews) {
            let reviewSum = 0;
            for (let j = 0; j < reviews.length; j++) {
                reviewSum += (reviews[j].stars)
            }
            reviewAvg = (Math.round((reviewSum / reviews.length) * 100)) / 100
            //Airbnb really does put ★ New for listings
            if (Number.isNaN(reviewAvg)) {
                reviewAvg = "New"
            }
            else {
                spot.average = reviewAvg
            }
        } else {
            reviewAvg = "New"
        }

        reviewItems =
            <div className='reviewAggregate'>
                <div className='reviewContents'>
                    {
                        reviews.map(review =>
                            <div key={review.id} className="individualReview">
                                {review.User && (
                                    <span style={{ fontWeight: 'bold', fontSize: "16 px" }}>{review.User.username}</span>
                                )}
                                <div>{review.stars} ★</div>
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

        if (sessionUser.id === spot.ownerId) {
            notOwned = false;
            buttons =
                <div>
                    <button onClick={deleteThis} className="ownerButton">
                        Delete this spot
                    </button>
                    <button onClick={movePage} className="ownerButton">
                        Edit this spot's details
                    </button>
                </div>
        }
        let yourReview = reviews.find(review => review.userId == sessionUser.id)
        if (yourReview) {
            console.log(yourReview)
            personalReview =
                <div className='individualReview'>
                    <div>{sessionUser.username}</div>
                    <div>{yourReview.stars} ★</div>
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
                console.log("INDIVIDUAL REVIEW :", reviews[i])
                notYourReviews.push(reviews[i])
            }
            console.log("NOT YOUR REVIEWS :", notYourReviews)
        }
        reviewItems =
            <div className='reviewAggregate'>
                {personalReview}
                {
                    notYourReviews.map(review =>
                        <div key={review.id} className="individualReview">
                            <div><span style={{ fontWeight: 'bold', fontSize: "16 px" }}>{review.User.username}</span></div>
                            <div>{review.stars} ★</div>
                            <div>{review.review} </div>
                        </div>
                    )
                }
            </div>

    }
    if (!spot) {
        return null;
    }
    console.log("WHY IS THIS CHANGING :", reviewAvg)
    if (Number.isNaN(reviewAvg)) {
        reviewAvg = "New"
    }
    console.log ("PERSONAL REVIEW :", personalReview)
    let reviewCount
    reviews[0] ? reviewCount = `${reviews.length} reviews` : reviewCount = "No reviews yet"
    return (
        <div className='notSpotRoot'>
            <div className='container'>
                <div className='title'>
                    <div className='bigTitle'>{spot.name}</div>
                    ★{reviewAvg} • {reviewCount} &nbsp;&nbsp; &nbsp;&nbsp; {spot.country}, {spot.state}, {spot.city}
                </div>
                <img src={image} className="mainImage"></img>
                <div className='spotInfo'>
                </div>
                {buttons}
                <div className='separator'></div>
                <div className='reviewHeader'>
                    {reviews && spot && (<span>
                        ★{reviewAvg} • {reviews.length} reviews
                    </span>
                    )}
                    <div className='reviewItems'>
                        {reviewItems}
                        <div className='spacer'></div>
                        {addReviewButton}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default IndividualSpotPage
