import './IndividualSpotPage.css'
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spots";


function IndividualSpotPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        dispatch(spotActions.getAllSpots());
    }, [dispatch]);

    const movePage = () => {
        history.push("EDITPAGEFORM")
    }
    const { spotId } = useParams();
    const deleteThis = async () => {
        spotActions.deleteSpot(spotId)
        history.push ("/")
    }
    const spots = useSelector(state => state.spots.spots)
    const spot = spots.find(spot => spot.id = spotId)
    console.log ("ALL SPOTS: ",spots)
    console.log("CURRENT SPOT", spot)
    if (!spot){
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
