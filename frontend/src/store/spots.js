import { csrfFetch } from './csrf';

const GET_SPOTS = '/';
const GET_ONE_SPOT = '/spots/:id'
const REMOVE_SPOT = 'spots/:id/delete';
const ADD_SPOT = '/spots/new'

export const removeSpot = spotId => ({
  type: REMOVE_SPOT,
  spotId
})
export const addSpot = spot => ({
  type: ADD_SPOT,
  spot
});

export const getSpot = (spot) => ({
  type: GET_ONE_SPOT,
  spot
});

const getSpots = (spots) => ({
  type: GET_SPOTS,
  spots
})
export const addSpotPhoto = (spotId, url) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      preview: true
    }),
  });
  const data = await response.json();
  return data;
}

export const createSpot = (spot) => async (dispatch) => {
  const { address, city, state, country, lat, lng, name, description, price } = spot;
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    }),
  });
  const data = await response.json();
  return data;
};
export const deleteSpot = (spotId) => async dispatch => {
  console.log("TRYING TO DELETE")
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  console.log("DELETING :", data)
  return dispatch(removeSpot(data.id));
};
export const getAllSpots = () => async dispatch => {
  const response = await csrfFetch(`/api/spots`);
  if (response.ok) {
    const spots = await response.json();
    console.log("THUNK SPOTS :", spots)
    console.log("TRYING TO KEY IN :", spots.spots[0])
    for (let i = 0; i < spots.spots.length; i++) {
      const reviews = await csrfFetch(`/api/spots/${spots.spots[i].id}/reviews`)
      const retrieved = await reviews.json()
      spots.spots[i].reviews = retrieved;
    }
    const result = dispatch(getSpots(spots.spots))
    console.log("RESULT OF DISPATCHING :", result)
    return result
  }
};
export const getSomeSpots = (params) => async dispatch => {
  console.log("SEARCH PARAMS :", params)
  const response = await csrfFetch(`/api/spots${params}`);
  if (response.ok) {
    const spots = await response.json();
    console.log("THUNK SPOTS :", spots)
    console.log("TRYING TO KEY IN :", spots.spots[0])
    for (let i = 0; i < spots.spots.length; i++) {
      const reviews = await csrfFetch(`/api/spots/${spots.spots[i].id}/reviews`)
      const retrieved = await reviews.json()
      spots.spots[i].reviews = retrieved;
    }
    const result = dispatch(getSpots(spots.spots))
    console.log("RESULT OF DISPATCHING :", result)
    return result
  }
};
export const updateSpot = (spot, spotId) => async (dispatch) => {
  const { address, city, state, country, lat, lng, name, description, price } = spot;
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    }),
  });
  const data = await response.json();
  return dispatch(addSpot(data));
};
const initialState = {
  spots: [],
}
const spotReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_SPOTS:
      console.log("GET SPOTS ACTION :", action)
      return { ...newState, spots: [...action.spots] };
    case GET_ONE_SPOT:
      newState = { ...state, [action.spot.id]: action.spot }
      return newState
    case ADD_SPOT:
      // if there is a spot already, skip this and go straight to overwriting it
      if (!state[action.spot.id]) {
        newState = {
          ...state,
          [action.spot.id]: action.spot
        };
        const spotList = newState.spots.map(id => newState[id]);
        spotList.push(action.spot);
        newState.spots = spotList;

        return newState;
      }
      return {
        ...state,
      };
    case REMOVE_SPOT:
      const newSpots = state.spots.filter(spot => spot.id === action.spotId)
      newState = { ...state, spots: newSpots }
      return newState;
    default:
      return state;
  }
};

export default spotReducer;
