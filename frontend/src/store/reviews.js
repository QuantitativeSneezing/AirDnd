import { csrfFetch } from './csrf';

const GET_SPOT_REVIEWS = '/';
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
    return dispatch(addReview(data));
};
export const deleteReview = (reviewId) => async dispatch => {
    console.log("TRYING TO DELETE")
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    return dispatch(removeReview(data.id));
};
export const getSpotReviews = (spotId) => async dispatch => {
    console.log("GETTING SPOT REVIEWS")
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
        const reviews = await response.json();
        console.log("REVIEWS RETRIEVED:", reviews)
        const result = dispatch(getReviews(reviews.reviews))
        console.log("RESULT OF DISPATCHING TO REVIEWS :", result)
        return result
    }
};
export const getPersonalReviews = () => async dispatch => {
    const response = await csrfFetch(`/api/reviews`);
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
    return dispatch(addReview(data));
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
            // if there is a review already, skip this and go straight to overwriting it
            if (!state[action.review.id]) {
                newState = {
                    ...state,
                    [action.review.id]: action.review
                };
                const reviewList = newState.reviews.map(id => newState[id]);
                reviewList.push(action.review);
                newState.reviews = reviewList;

                return newState;
            }
            return {
                ...state,
            };
        case REMOVE_REVIEW:
            const newReviews = state.reviews.filter(review => review.id === action.reviewId)
            newState = { ...state, reviews: newReviews }
            return newState;
        default:
            return state;
    }
};

export default reviewReducer;
