import React, { useState, useEffect } from "react";
import { useDispatch, } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import * as reviewActions from '../../store/reviews';
import './ReviewForm.css'

function BookingFormPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(1)
    const [errors, setErrors] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);
    const [disableSubmit, setDisableSubmit] = useState(true)
return (
    <div>
        HELLOOOOO FROM BOOKING FORM
    </div>
)
}
export default BookingFormPage
