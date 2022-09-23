import './HomePage.css'
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spots";

// "https://img.pokemondb.net/artwork/avif/rayquaza-mega.avif"

function HomePage() {
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        dispatch(spotActions.getAllSpots());
    }, [dispatch]);

    const spots = useSelector(state => state.spots.spots)
    if (!spots[0]) {
        return null;
    }

    return (
        <div className='locations__container'>
            <div className='locations__group'>
                {spots.map(spot =>
                    <div className='fullLocation___container' onClick={() => history.push(`spots/${spot.id}`)}>
                        <div className="locations__location">
                            <div className='image__wrapper'>
                                <img src='https://upload.wikimedia.org/wikipedia/commons/4/49/A_black_image.jpg' alt= "Spot" className='picture'></img>
                            </div>
                        </div>
                        <div className='location__details'>
                            <div className='title'>
                                &nbsp;&nbsp;&nbsp; {spot.city}, {spot.state} &nbsp;&nbsp;&nbsp;
                            </div>
                            <div className='description'>
                                &nbsp;&nbsp;&nbsp; {spot.address}
                            </div>
                            <div className='description'>
                                &nbsp;&nbsp;&nbsp; <span style={{ fontWeight: 'bold', fontSize: "16 px" }} > ${spot.price}</span> night
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}
export default HomePage
