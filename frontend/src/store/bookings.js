import { csrfFetch } from './csrf';

const ADD_BOOKING = "bookings/new";
const REMOVE_BOOKING = "bookings/:id/delete"
const GET_SPOT_BOOKINGS = "spots/:spotid/bookings"
const GET_USER_BOOKINGS = 'bookings/current'

export const removeBooking = bookingId => ({
    type: REMOVE_BOOKING,
    bookingId
})
export const addBooking = booking => ({
    type: ADD_BOOKING,
    booking
});

export const getUserBookings = (bookings) => ({
    type: GET_USER_BOOKINGS,
    bookings
});

export const getBookings = (bookings) => ({
    type: GET_SPOT_BOOKINGS,
    bookings
})

export const getSpotBookings = (spotId) => async dispatch => {
    console.log("GETTING SPOT BOOKINGS")
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`);
    console.log("SPOT BOOKING RESPONSE", response)
    if (response.ok) {
        const bookings = await response.json();
        console.log("BOOKINGS RETRIEVED:", bookings)
        const result = dispatch(getBookings(bookings.bookings))
        console.log("RESULT OF DISPATCHING TO BOOKINGS :", result)
        return result
    }
};
export const getPersonalBookings = (userId) => async dispatch => {
    console.log("GETTING SPOT BOOKINGS")
    const response = await csrfFetch(`/api/bookings/current`);
    console.log("SPOT BOOKING RESPONSE", response)
    if (response.ok) {
        const bookings = await response.json();
        console.log("BOOKINGS RETRIEVED:", bookings)
        const result = dispatch(getBookings(bookings.userBookings))
        console.log("RESULT OF DISPATCHING TO BOOKINGS :", result)
        return result
    }
};
export const addSpotBooking = ({ startDate, endDate, spotId }) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            startDate,
            endDate
        }),
    });
    const data = await response.json();
    console.log("BOOKING HERE :", data)
    const result = dispatch(addBooking(data));
    console.log("BOOKING ADDING RESULT :", result)
    return result
}
export const deleteSpotBooking = (bookingId) => async dispatch => {
    console.log("TRYING TO DELETE")
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    if (data) {
        return dispatch(removeBooking(bookingId))
    };
}
const initialState = {
    bookings: {},
}
const bookingReducer = (state = initialState, action) => {
    let newState;
    let bookingObj;
    switch (action.type) {
        case GET_SPOT_BOOKINGS:
            // return { ...newState, bookings: [...action.bookings] };
            console.log("GET SPOT BOOKINGS ACTION :", action.bookings)
            bookingObj = {}
            for (let i = 0; i < action.bookings.length; i++) {
                const key = action.bookings[i].id
                bookingObj[key] = action.bookings[i]
            }
            console.log("NEW OBJECT :", bookingObj)
            return { ...state, bookings: bookingObj }
        case GET_USER_BOOKINGS:
          console.log("GET SPOT BOOKINGS ACTION :", action.bookings)
            bookingObj = {}
            for (let i = 0; i < action.bookings.length; i++) {
                const key = action.bookings[i].id
                bookingObj[key] = action.bookings[i]
            }
            console.log("NEW OBJECT :", bookingObj)
            return { ...state, bookings: bookingObj }
        case ADD_BOOKING:
            newState = { ...state }
            const newId = action.booking.id;
            console.log("ID FOR BOOKING TO BE ADDED :", newId)
            newState.bookings[newId] = action.booking
            return newState
        case REMOVE_BOOKING:
            newState = { ...state }
            const id = action.bookingId
            console.log("BOOKING ID TO BE DELETED :", action.bookingId)
            console.log("NEWSTATE BOOKINGS :", newState.bookings)
            console.log("BOOKING TO BE DELETED :", newState.bookings[id])
            delete newState.bookings[id]
            console.log("UPDATED NEWSTATE BOOKINGS :", newState.bookings)
            return { ...newState }
        default:
            return state;
    }
};
export default bookingReducer
