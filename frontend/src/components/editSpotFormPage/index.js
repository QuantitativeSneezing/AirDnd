import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import * as spotActions from "../../store/spots";
import './EditPage.css'
//this is basically the same as the add spot honestly
const States = ["Alaska", "Alabama", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "South Carolina", "Tennessee",
    "Texas", "Utah", "Vermont", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
// I did actually type these all out, don't want to run afoul of copy/paste rules lol
function EditSpotFormPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector((state) => state.session.user);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("Alaska");
    const [country, setCountry] = useState("")
    const [lat, setLat] = useState(0)
    const [lng, setLong] = useState(0)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState(0)
    const updateState = (e) => setState(e.target.value);

    // this should probably be a dropdown/scroll menu
    const [errors, setErrors] = useState([]);
    const { spotId } = useParams();

    if (!sessionUser) return <Redirect to="/" />;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const payload = {
            address, city, state, country, lat, lng, name, description, price
        }

        const spot = await dispatch(spotActions.updateSpot(payload, spotId))
        console.log("SPOT :" ,spot)
        if (spot) {
            history.push(`/spots/${spotId}`);
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <label>
                Address
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
            </label>
            <label>
                City
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
            </label>
            <label>
                State
                <select onChange={updateState} value={state}>
                    {States.map(state =>
                        <option key={state}>{state}</option>
                    )}
                </select>
            </label>
            <label>
                Country
                <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                />
            </label>
            {/* I am not making a dropdown for every country lol */}
            <label>
                Latitude
                <input
                    type="number"
                    step="0.1"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    required
                />
            </label>
            <label>
                Longitude
                <input
                    type="number"
                    step="0.1"
                    value={lng}
                    onChange={(e) => setLong(e.target.value)}
                    required
                />
            </label>
            <label>
                Name
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </label>
            <label>
                Description
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </label>
            <label>
                Price
                <input
                    type="number"
                    step="0.1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Update spot</button>
        </form>
    );
}

export default EditSpotFormPage;
