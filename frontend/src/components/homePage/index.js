import './HomePage.css'
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spots";
import { useDropdown } from '../../context/DropdownContext';
import Carousel from '../carousel';

// "https://img.pokemondb.net/artwork/avif/rayquaza-mega.avif"

function HomePage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { setDropdown } = useDropdown();
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        dispatch(spotActions.getAllSpots());
        setLoaded(true);
        setDropdown(false)
    }, [dispatch]);

    const spots = useSelector(state => state.spots.spots)
    if (!spots[0]) {
        return null;
    }
    if (!loaded) {
        return null
    }
    for (let i = 0; i < spots.length; i++) {
        const spot = spots[i]
        let reviews = spot.reviews.reviews
        let reviewSum = 0;
        for (let j = 0; j < reviews.length; j++) {
            reviewSum += (reviews[j].stars)
        }
        const reviewAvg = (Math.round((reviewSum / reviews.length) * 100)) / 100
        //Airbnb really does put ★ New for listings
        if (Number.isNaN(reviewAvg)) {
            spots[i].average = "New"
        }
        else {
            spots[i].average = reviewAvg
        }
        // console.log ("LOOP SPOT :",spot)
        spot.displayImage = 'https://i.imgur.com/g24gIGL.png'
        if (spot.SpotImages[0]) {
            spot.displayImage = `${spot.SpotImages[0].url}`
        }
    }
    return (
            <div className='locations__container'>
                     <Carousel />
                <div className='locations__group'>
                    {spots.map(spot =>
                        <div className='fullLocation___container' onClick={() => history.push(`spots/${spot.id}`)}>
                            <div className="locations__location">
                                <div className='image__wrapper'>
                                    <img src={spot.displayImage} alt="Spot" className='picture'></img>
                                </div>
                            </div>
                            <div className='location__details'>
                                <div className='title'>
                                    {spot.city}, {spot.state}
                                    &nbsp;&nbsp;★{spot.average}
                                </div>

                                <div className='description'>
                                    {spot.address}
                                </div>
                                <div className='description'>
                                    <span style={{ fontWeight: 'bold', fontSize: "16 px", color: "black" }} > ${spot.price}</span> night
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div >
    )
}
export default HomePage
