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
    console.log ("rEVIEW ADDING RESULT :",result )
};
export const deleteReview = (reviewId) => async dispatch => {
    console.log("TRYING TO DELETE")
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    if(data){
    return dispatch(removeReview(reviewId))
    };
};
export const getSpotReviews = (spotId) => async dispatch => {
    console.log("GETTING SPOT REVIEWS")
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    console.log ("SPOT REVIEW RESPONSE" ,response)
    if (response.ok) {
        const reviews = await response.json();
        console.log("REVIEWS RETRIEVED:", reviews)
        const result = dispatch(getReviews(reviews.reviews))
        console.log("RESULT OF DISPATCHING TO REVIEWS :", result)
        return result
    }
};
export const getPersonalReviews = () => async dispatch => {
    const response = await csrfFetch(`/api/reviews/current`);
    if (response.ok) {
        const reviews = await response.json();
        console.log("THUNK REVIEWS :", reviews)
        const result = dispatch(getUserReviews(reviews.reviews))
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
    reviews: [],
}
const reviewReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_SPOT_REVIEWS:
            // return { ...newState, reviews: [...action.reviews] };
            return { ...state, reviews: [action.reviews] }
        case GET_USER_REVIEWS:
            newState = { ...state, [action.review.id]: action.review }
            return newState
        case ADD_REVIEW:
            if (!state[action.review.id]) {
                newState = {
                    ...state,
                };
                const reviewList = [...newState.reviews]
                reviewList.push(action.review);
                console.log (reviewList)
                return {...newState};
            }
            return {
                ...state,
            };
        case REMOVE_REVIEW:
            console.log ("REMOVING REVIEWS ACTION :",action)
            let newReviews= [];
            const oldReviews= state.reviews[0]
            for (let i=0;i<oldReviews.length;i++){
                if(oldReviews[i].id !== action.reviewId){
                    newReviews.push(oldReviews[i])
                }
            }
            console.log ("NEW REVIEWS :",newReviews)
            newState = { ...state, reviews: [newReviews] }
            console.log("NEWSTATE :",newState)
            return {...newState};
        default:
            return state;
    }
};

export default reviewReducer;
