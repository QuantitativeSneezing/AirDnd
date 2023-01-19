import { csrfFetch } from './csrf';

const GET_SPOT_REVIEWS = '/spots/:id/reviews';
const GET_USER_REVIEWS = '/reviews/current'
const REMOVE_REVIEW = 'reviews/:id/delete';
const ADD_REVIEW = '/reviews/new'

export const removeReview = reviewId => ({
    type: REMOVE_REVIEW,
    reviewId
})
export const addReview = review => ({
    type: ADD_REVIEW,
    review
});

export const getUserReviews = (reviews) => ({
    type: GET_USER_REVIEWS,
    reviews
});

const getReviews = (reviews) => ({
    type: GET_SPOT_REVIEWS,
    reviews
})


export const createReview = (fullReview, spotId) => async (dispatch) => {
    console.log("CREATING REVIEW")
    const { review, stars } = fullReview;
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            review,
            stars
        }),
    });
    const data = await response.json();
    console.log("REVIEW HERE :", data)
    const result = await dispatch(addReview(data));
    console.log("rEVIEW ADDING RESULT :", result)
    return result
};
export const deleteReview = (reviewId) => async dispatch => {
    console.log("TRYING TO DELETE")
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    if (data) {
        return dispatch(removeReview(reviewId))
    };
};
export const getSpotReviews = (spotId) => async dispatch => {
    console.log("GETTING SPOT REVIEWS")
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    console.log("SPOT REVIEW RESPONSE", response)
    if (response.ok) {
        const reviews = await response.json();
        console.log("REVIEWS RETRIEVED:", reviews)
        const result = dispatch(getReviews(reviews.reviews))
        console.log("RESULT OF DISPATCHING TO REVIEWS :", result)
        return result
    }
};
export const getPersonalReviews = () => async dispatch => {
    console.log("getting personal reviews")
    const response = await csrfFetch(`/api/reviews/current`);
    console.log("personal reviews response :", response)
    if (response.ok) {
        const reviews = await response.json();
        console.log("THUNK REVIEWS :", reviews)
        const result = dispatch(getUserReviews(reviews.userReviews))
        console.log("RESULT OF DISPATCHING REVIEWS:", result)

    }
};
export const updateReview = (fullReview, reviewId) => async (dispatch) => {
    const { review, stars } = fullReview;
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            review,
            stars
        }),
    });
    const data = await response.json();
    console.log("REVIEW HERE :", data)
    return dispatch(addReview(data))
};
const initialState = {
    reviews: {},
}
const reviewReducer = (state = initialState, action) => {
    let newState;
    let reviewObj;
    switch (action.type) {
        case GET_SPOT_REVIEWS:
            // return { ...newState, reviews: [...action.reviews] };
            console.log("GET SPOT REVIEWS ACTION :", action.reviews)
            reviewObj = {}
            for (let i = 0; i < action.reviews.length; i++) {
                const key = action.reviews[i].id
                reviewObj[key] = action.reviews[i]
            }
            console.log("NEW OBJECT in get spot:", reviewObj)
            newState=  { ...state, reviews: reviewObj}
            console.log ("NEW STATE AFTER RETRIEVING REVIEWS", newState)
            return newState
        case GET_USER_REVIEWS:
            console.log("GET USER REVIEWS ACTION :", action.reviews)
            reviewObj = {}
            for (let i = 0; i < action.reviews.length; i++) {
                const key = action.reviews[i].id
                reviewObj[key] = action.reviews[i]
            }
            console.log("NEW OBJECT :", reviewObj)
            return { ...state, reviews: reviewObj }
        case ADD_REVIEW:
            newState = { ...state }
            const newId = action.review.id;
            console.log("ID FOR REVIEW TO BE ADDED :", newId)
            newState.reviews[newId] = action.review
            return newState
        case REMOVE_REVIEW:
            newState = { ...state }
            const id = action.reviewId
            console.log("REVIEW ID TO BE DELETED :", action.reviewId)
            console.log("NEWSTATE REVIEWS :", newState.reviews)
            console.log("REVIEW TO BE DELETED :", newState.reviews[id])
            const reviewArr = Object.values(newState.reviews)
            console.log("arr is :", reviewArr)
            reviewObj = {}
            for (let i = 0; i < reviewArr.length; i++) {
                if (!(reviewArr[i].id == action.reviewId)) {
                    const key = reviewArr[i].id
                    reviewObj[key] = reviewArr[i]
                }
            }
            newState.reviews= reviewObj;
            // delete newState.reviews[id]
            console.log("UPDATED NEWSTATE REVIEWS :", newState.reviews)
            return { ...newState }
        default:
            return state;
    }
};

export default reviewReducer;
