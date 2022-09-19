import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
//   lat, lng, name, description, price
import './SpotForm.css'
const States = ["Alaska", "Alabama", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "South Carolina", "Tennessee",
    "Texas", "Utah", "Vermont", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
// I did actually type these all out, don't want to run afoul of copy/paste rules lol
function SpotFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry]= useState("")
    const [lat, setLat]= useState(0)
    const [long, setLong]= useState(0)
    const updateState = (e) => setState(e.target.value);

    // this should probably be a dropdown/scroll menu
    const [errors, setErrors] = useState([]);

    if (sessionUser) return <Redirect to="/" />;
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({ credential, password }))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
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
                    step= "0.1"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    required
                />
            </label>
            <label>
                Last Name
                <input
                    type="number"
                    step= "0.1"
                    value={long}
                    onChange={(e) => setLong(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Sign Up</button>
        </form>
    );
}

export default SpotFormPage;
