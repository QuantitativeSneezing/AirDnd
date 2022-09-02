const express = require('express')
const sequelize= require('sequelize')
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
    requireAuth,
    validateSpotImage,
    async (req, res, next) => {
        const { user } = req;
        //for validating that the spot is owned by the user
        const lookForId = req.params.id
        const spot = await Spot.findOne({
            where: { id: lookForId }
        });

        if (spot) {
            if (user.id !== spot.ownerId) {
                res.status(403)
                return res.json({
                    "message": "Forbidden",
                    "statusCode": 403
                })
                //error out if unauthorized first
            }
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
router.post('/:id/reviews',
    requireAuth,
    validateReview,
    async (req, res, next) => {
        const { user } = req;
        const lookForId = req.params.id
        const spot = await Spot.findOne({
            where: { id: lookForId }
        });

        if (spot) {
            const checkForExistingReview = await Review.findOne({
                where: { userId: user.id }
            })
            if (checkForExistingReview) {
                res.status(403)
                return res.json({
                    "message": "User already has a review for this spot",
                    "statusCode": 403
                })
            }
            const { review, stars } = req.body
            const spotReview = await Review.create({ spotId: lookForId, review, stars, userId: user.id })
            res.json(spotReview)
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
            const reviewAvg= await Review.findAll({
                where: {spotId: lookForId},
                attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avgStarRating']]
            })
            const owner= await User.findOne({
                where: {id:spot.ownerId},
                attributes: ["id", "firstName", "lastName"]
            })
            res.json({spot,reviewAvg,owner})
        } else {
            res.status(404)
            res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }
    })
router.put('/:id',
    requireAuth,
    async (req, res, next) => {
        const { user } = req;
        //for validating that the spot is owned by the user
        const lookForId = req.params.id
        const spot = await Spot.findOne({
            where: { id: lookForId },
            include: {
                model: SpotImage
            }
        })

        if (spot) {
            if (user.id !== spot.ownerId) {
                res.status(403)
                return res.json({
                    "message": "Forbidden",
                    "statusCode": 403
                })
                //error out if unauthorized first
            }
            const address = (req.body.address || spot.address)
            const city = (req.body.city || spot.city)
            const state = (req.body.state || spot.state)
            const country= (req.body.country ||spot.country)
            const lat= (req.body.lat||spot.lat)
            const lng= (req.body.lng||spot.lng)
            const name= (req.body.name|| spot.name)
            const description= (req.body.description||spot.description)
            const price= (req.body.price||spot.price)
            spot.address= address;
            spot.city= city;
            spot.state= state;
            spot.country= country;
            spot.lat= lat;
            spot.lng= lng;
            spot.name= name;
            spot.description= description;
            spot.price= price;
        } else {
            res.status(404)
            res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }
    })
router.delete('/:id',
    requireAuth,
    async (req, res, next) => {
        const { user } = req;
        //for validating that the spot is owned by the user
        const lookForId = req.params.id
        const spot = await Spot.findOne({
            where: { id: lookForId },
            include: {
                model: SpotImage
            }
        })

        if (spot) {
            if (user.id !== spot.ownerId) {
                res.status(403)
                return res.json({
                    "message": "Forbidden",
                    "statusCode": 403
                })
                //error out if unauthorized first
            }
            spot.destroy();
            res.status(200)
            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
            })
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
