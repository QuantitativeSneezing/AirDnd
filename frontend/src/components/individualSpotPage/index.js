import './IndividualSpotPage.css'
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { Calendar } from 'react-calendar';
import * as spotActions from "../../store/spots";
import * as reviewActions from '../../store/reviews'
import * as bookingActions from '../../store/bookings'
// import 'react-calendar/dist/Calendar.css';
function IndividualSpotPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const sessionUser = useSelector(state => state.session.user);
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        dispatch(spotActions.getAllSpots());
    }, [dispatch]);

    useEffect(() => {
        dispatch(reviewActions.getSpotReviews(spotId))
        setLoaded(true)
    }, [dispatch]);

    useEffect(() => {
        dispatch(bookingActions.getSpotBookings(spotId))
    }, [dispatch]);

    const movePage = () => {
        history.push(`/spots/${spotId}/edit`)
    }

    const deleteThis = async () => {
        dispatch(spotActions.deleteSpot(spotId))
        history.push("/")
    }
    const deleteThisReview = async (reviewId) => {
        const deleteResult = dispatch(reviewActions.deleteReview(reviewId))
        console.log("RESULT :", deleteResult);
    }
    const reviewRedirect = () => {
        history.push(`/spots/${spotId}/reviews`)
    }
    const editReviewRedirect = (reviewId) => {
        // console.log("THIS IS BEING PASSED TO THE REDIRECT :",reviewId)
        history.push(`/reviews/${reviewId}/edit`)
    }
    const bookingRedirect = () => {
        history.push(`/spots/${spotId}/bookings`)
    }
    const checkOwnedBookings = () => {
        console.log("WILL REDIRECT")
    }
    const spots = useSelector(state => state.spots.spots)
    const allReviews = useSelector(state => state.reviews.reviews)
    const bookings = useSelector(state => state.bookings.bookings)
    console.log("BOOKINGS RETRIEVED :", bookings)
    let bookingItems
    if (bookings) {
        bookingItems = Object.values(bookings)
    }
    console.log("BOOKINGITEMS :", bookingItems)
    let reviews = [];
    if (allReviews) {
        reviews = Object.values(allReviews)
    }
    let spot;
    let reviewItems;
    let reviewAvg = NaN;
    let buttons;
    let addReviewButton;
    let bookingOptions;
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
    if (!loaded) {
        return null
    }
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
        if (notOwned) {
            bookingOptions =
                (<div className="preBookingInfo">
                    <div className='preBookFirstLine'>
                        <span className="preBookTop">
                            <span className="price">${spot.price}
                            </span>  night
                        </span>
                        {reviews && spot && (<span>
                            ★{reviewAvg} • {reviews.length} reviews
                        </span>
                        )}</div>
                    <div className='spacer'></div>
                    <button onClick={bookingRedirect} className='submitButton'> Book this spot</button>
                </div>)
        } else if (!notOwned) {
            bookingOptions =
                <div>
                    Bookings for this spot :
                    {bookingItems.map(booking => <div>1 Guest, from {booking.startDate.slice(0, 10)} to {booking.endDate.slice(0, 10)} </div>)}
                </div>
        }
        let yourReview
        console.log("ALL REVIEWS :", reviews)
        yourReview = reviews.find(review => review.userId == sessionUser.id)
        console.log("PERSONAL REVIEW :", yourReview)

        if (yourReview) {
            console.log(yourReview)
            personalReview =
                <div className='individualReview'>
                    <div>
                        <span style={{ fontWeight: 'bold', fontSize: "16 px" }}>{sessionUser.username} (You)</span>
                    </div>
                    <div>{yourReview.stars} ★</div>
                    <p className='individualReviewText'>{yourReview.review} </p>
                    <button onClick={() => editReviewRedirect(yourReview.id)} disabled={false} className="overrideButton" >
                        Edit Your Review
                    </button>
                    <button onClick={() => deleteThisReview(yourReview.id)} disabled={false} className="overrideButton"  >
                        Delete Your Review
                    </button>
                </div>
        } else if (notOwned) {
            addReviewButton = (
                <button onClick={reviewRedirect} className="overrideButton" >
                    Review this spot
                </button>)
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
                            <div className='individualReviewText'>{review.review} </div>
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
    let reviewCount
    reviews[0] ? reviewCount = `${reviews.length} reviews` : reviewCount = "No reviews yet"
    return (
        <div className='notSpotRoot'>
            <div id='calendarHolder'>
                <Calendar className="calendar" />
            </div>
            <div className='container'>
                <div className='title'>

                    <div className='bigTitle'>{spot.name}</div>
                    ★{reviewAvg} • {reviewCount} &nbsp;&nbsp; &nbsp;&nbsp; {spot.country}, {spot.state}, {spot.city}
                </div>
                <img src={image} className="mainImage"></img>
                {buttons}
                <div className='spotDesc'>
                    <p>
                        {spot.description}
                    </p>
                </div>
                <div className='spotInfo'>
                </div>
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
            <div className='bookings'>
                {sessionUser && bookingOptions}
            </div>

        </div>
    );
}
export default IndividualSpotPage
