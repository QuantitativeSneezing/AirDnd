import './HomePage.css'
import { useEffect } from 'react';
import {Link } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spots";



function HomePage() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(spotActions.getAllSpots());
    }, [dispatch]);

    const spots = useSelector(state => state.spots.spots)
    return (
        <div>
            {spots.map(spot =>


                <ul>
                    <Link to = {`spots/${spot.id}`}>CLICK IF YOU WANT TO KNOW [MORE!!!]</Link>
                    <li>
                        {spot.id} IS THE SPOT'S ID
                    </li>
                    <li>
                        {spot.name} IS THE SPOT'S NAME
                    </li>
                    <li>
                        IT IS LOCATED IN {spot.city}, {spot.country}
                    </li>
                </ul>
            )}
        </div>
    )
}
export default HomePage
