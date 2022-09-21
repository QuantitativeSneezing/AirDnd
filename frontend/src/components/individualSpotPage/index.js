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
        dispatch(spotActions.deleteSpot(spotId))
        history.push("/")
    }
    const spots = useSelector(state => state.spots.spots)
    let spot;
    if (spots[0]) {
        spot = spots.find(spot => spot.id == spotId)
    }
    const allReviews= useSelector(state=> state.reviews.reviews)
    console.log ("ALL REVIEWS :",allReviews)
    console.log("ALL SPOTS: ", spots)
    console.log("CURRENT SPOT", spot)
    if (!spot) {
        return null;
    }
    return (
        <div>
            <p>
                WELCOME TO THE SPOT
            </p>
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

        </div>
    );
}
export default IndividualSpotPage
