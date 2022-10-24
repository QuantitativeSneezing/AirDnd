import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import * as spotActions from "../../store/spots";
import './EditPage.css'
function EditSpotFormPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const sessionUser = useSelector((state) => state.session.user);
    const spots = useSelector(state => state.spots.spots)
    let spot;
    if (spots[0]) {
        spot = spots.find(spot => spot.id == spotId)
    }
    console.log("SPOT FOR PREPOPULATE :", spot)
    const [address, setAddress] = useState(spot?.address);
    const [city, setCity] = useState(spot?.city);
    const [state, setState] = useState(spot?.state);
    const [country, setCountry] = useState(spot?.country)
    const [lat, setLat] = useState(spot?.lat)
    const [lng, setLong] = useState(spot?.lng)
    const [name, setName] = useState(spot?.name)
    const [description, setDescription] = useState(spot?.description)
    const [price, setPrice] = useState(spot?.price)
    const [validationErrors, setValidationErrors] = useState([])

    // this should probably be a dropdown/scroll menu
    const [errors, setErrors] = useState([]);
    const [disableSubmit, setDisableSubmit] = useState(true)

    const cancelSubmit = () => {
        history.push(`/spots/${spotId}`);
    }
    useEffect(() => {
        if (validationErrors.length === 0) {
            setDisableSubmit(false)
        } else {
            setDisableSubmit(true)
        }
    }, [validationErrors])
    useEffect(() => {
        const currentErrors = [];
        if (description && description.length < 10) {
            currentErrors.push("Please add a longer description")
        }
        if (description && description.length > 254) {
            currentErrors.push("Please shorten your description")
        }
        // if (price) {
        //     console.log("CHECK PRICE IS NUMBER : ", parseFloat(price))
        //     if (Number.isNaN(parseFloat(price))) {
        //         currentErrors.push("Price must be a number")
        //     }
        // }
        setValidationErrors(currentErrors);
    }, [description])

    if (!sessionUser) return <Redirect to="/" />;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const payload = {
            address, city, state, country, lat, lng, name, description, price
        }

        const spot = await dispatch(spotActions.updateSpot(payload, spotId))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
        console.log("SPOT :", spot)
        if (spot) {
            history.push(`/spots/${spotId}`);
        }
    }



    return (
        <div className='notSpotCreatorRoot'>
            <form onSubmit={handleSubmit} className="form">
                <div className="errors">
                    {errors.map((error, idx) => <div key={idx}>{error}</div>)}
                    {
                        validationErrors.map(error => (
                            <div key={error}>{error}</div>
                        ))}
                </div>
                <div className="formItem">
                    Address
                    <label>
                        <input
                            className="inputField"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="formItem">
                    City
                    <label>
                        <input
                            className="inputField"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="formItem">
                    State
                    <label>
                        <input
                            className="inputField"
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="formItem">
                    Country
                    <label>
                        <input
                            className="inputField"
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </label>
                    {/* I am not making a dropdown for every country lol */}
                </div>
                <div className="formItem">
                    Latitude (optional)
                    <label>
                        <input
                            className="inputField noWheel"
                            type="number"
                            step="0.1"
                            value={lat}
                            onWheel={(e) => e.target.blur()}
                            //getting rid of those wheels is really annoying lol, had to use this and css to hide them
                            onChange={(e) => setLat(e.target.value)}
                        />
                    </label>
                </div>
                <div className="formItem">
                    Longitude (optional)
                    <label>
                        <input
                            className="inputField noWheel"
                            type="number"
                            onWheel={(e) => e.target.blur()}
                            //getting rid of those wheels is really annoying lol, had to use this and css to hide them
                            step="0.1"
                            value={lng}
                            onChange={(e) => setLong(e.target.value)}
                        />
                    </label>
                </div>
                <div className="formItem">
                    Name
                    <label>
                        <input
                            className="inputField"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="formItem">
                    Description
                    <label>
                        <textarea
                            className="inputFieldLarge"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please write a brief description of your spot"
                            required
                        />
                    </label>
                </div>
                <div className="formItem">
                    Price
                    <label>
                        <input
                            className="inputField noWheel"
                            type="number"
                            step={0.01}
                            onWheel={(e) => e.target.blur()}
                            //getting rid of those wheels is really annoying lol, had to use this and css to hide them
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="formItem">
                    <button type="submit" className="submitButton" disabled={disableSubmit}>Update spot</button>
                </div>

                <div className="formItem">
                    <div className="formItem"> <button onClick={cancelSubmit} className="submitButton">Cancel</button></div>
                </div>
            </form>
        </div>
    );
}

export default EditSpotFormPage;
