const express = require('express')
const router = express.Router();
const { Spot, User, SpotImage, Review, Booking } = require('../../db/models');
const { requireAuth } = require('../../db/utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../db/utils/validation');
const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required.'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];
const validateSpotImage = [
    check('url')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a url'),
    handleValidationErrors
];
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

router.get('/:id/reviews', async (req, res, next) => {
    const lookForId = req.params.id
    const spot = await Spot.findOne({
        where: { id: lookForId }
    });
    if (spot) {
        const spotReviews = await Review.findAll({
            where: { spotId: lookForId }
        })
        res.json(spotReviews)
    } else {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})
router.get('/:id/bookings', async (req, res, next) => {
    const lookForId = req.params.id
    const spot = await Spot.findOne({
        where: { id: lookForId }
    });
    if (spot) {
        const spotBookings = await Booking.findAll({
            where: { spotId: lookForId }
        })
        res.json(spotBookings)
    } else {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})
router.post('/:id/images',
    validateSpotImage,
    async (req, res, next) => {
        const lookForId = req.params.id
        const spot = await Spot.findOne({
            where: { id: lookForId }
        });
        if (spot) {
            const { url, preview } = req.body
            const newSpotImage = await SpotImage.create({ spotId: lookForId, url, preview })
            res.json(newSpotImage)
        } else {
            res.status(404)
            res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }
    })

router.get('/current',
    requireAuth,
    async (req, res, next) => {
        const { user } = req;
        if (user) {
            const id = user.id;
            const userSpots = await (Spot.findAll({
                where: {
                    ownerId: id
                },
            }))
            return res.json(userSpots);
        } else return res.json("No spots found");
    });
router.get('/:id',
    async (req, res, next) => {

        const lookForId = req.params.id
        const spot = await Spot.findOne({
            where: { id: lookForId },
            include: {
                model: SpotImage
            }
        })

        if (spot) {
            res.json(spot)
        } else {
            res.status(404)
            res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }
    })



router.get('/',
    async (req, res, next) => {
        const spots = await Spot.findAll({
        })
        res.json(spots)
    }
)

router.post('/',
    requireAuth,
    validateSpot,
    async (req, res, next) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body
        const { user } = req;
        const ownerId = user.id;
        const newSpot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price });
        newSpot.save();
        res.json(newSpot)
    })

module.exports = router
