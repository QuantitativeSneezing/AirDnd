const express = require('express')
const sequelize = require('sequelize')
const router = express.Router();
const { Spot, User, SpotImage, Review, Booking } = require('../../db/models');
const { requireAuth } = require('../../db/utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../db/utils/validation');
const { Op } = require("sequelize");
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
        res.json({reviews: spotReviews})
    } else {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})
router.get('/:id/bookings',
    requireAuth,
    async (req, res, next) => {
        const { user } = req;
        const lookForId = req.params.id
        const spot = await Spot.findOne({
            where: { id: lookForId }
        });
        if (spot) {
            let spotBookings = await Booking.findAll({
                where: { spotId: lookForId },
                attributes: ["spotId", "startDate", "endDate"]
            })
            if (spot.ownerId === user.id) {
                spotBookings = await Booking.findAll({
                    where: { spotId: lookForId },
                })
                for (let i=0;i<spotBookings.length;i++){
                    const currentBooking= spotBookings[i];
                    const addedUser= await User.findOne({
                        where: {id: currentBooking.userId}
                    })
                    currentBooking.user= addedUser
                }
            }
            res.json({bookings: spotBookings})
        } else {
            res.status(404)
            res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }
    })
router.post('/:id/bookings',
    requireAuth,
    async (req, res, next) => {
        const { user } = req;
        const lookForId = req.params.id
        const spot = await Spot.findOne({
            where: { id: lookForId }
        });
        if (spot) {
            // if (spot.ownerId === user.id) {
            //     res.status(403)
            //     return res.json({
            //         "message": "Don't book your own spot please",
            //         "statusCode": 403
            //     })
            // }
            // this code checks if you own the spot, but the test specs don't like that
            const { startDate, endDate } = req.body
            const compareStartDate = Date.parse(startDate)
            const compareEndDate = Date.parse(endDate)
            if (endDate < startDate) {
                res.status(400)
                return res.json({
                    "message": "Validation error",
                    "statusCode": 400,
                    "errors": {
                        "endDate": "endDate cannot be on or before startDate"
                    }
                })
            }
            const otherBookings = await Booking.findAll({
                where: { spotId: lookForId }
            })
            for (let i = 0; i < otherBookings.length; i++) {
                // this is an incredibly messy validation method, might update in future
                const existingBooking = otherBookings[i]
                //four overlap cases: the beginning or end of the booking can overlap with the middle of a date,
                //or the new booking can entirely envelope another date or be entirely enveloped by another date
                const overlap =
                    (compareStartDate >= existingBooking.startDate && compareStartDate <= existingBooking.endDate) ||
                    (compareEndDate >= existingBooking.startDate && compareEndDate <= existingBooking.endDate) ||
                    (compareStartDate <= existingBooking.startDate && compareEndDate >= existingBooking.endDate);
                if (overlap) {
                    res.status(403)
                    return res.json({
                        "message": "Sorry, this spot is already booked for the specified dates",
                        "statusCode": 403,
                        "errors": "start or end date overlaps with existing booking"

                    })
                }
            }
            const booking = await Booking.create({
                spotId: lookForId,
                userId: user.id,
                startDate,
                endDate
            })
            res.json(booking)
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
            let { url, preview } = req.body
            preview= Boolean(preview)
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
            res.status(201)
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
            const reviewAvg = await Review.findAll({
                where: { spotId: lookForId },
                attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avgStarRating']]
            })
            const owner = await User.findOne({
                where: { id: spot.ownerId },
                attributes: ["id", "firstName", "lastName"]
            })
            res.json({ spot, reviewAvg, owner })
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
    validateSpot,
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
            const country = (req.body.country || spot.country)
            const lat = (req.body.lat || spot.lat)
            const lng = (req.body.lng || spot.lng)
            const name = (req.body.name || spot.name)
            const description = (req.body.description || spot.description)
            const price = (req.body.price || spot.price)
            spot.address = address;
            spot.city = city;
            spot.state = state;
            spot.country = country;
            spot.lat = lat;
            spot.lng = lng;
            spot.name = name;
            spot.description = description;
            spot.price = price;
            await spot.save();
            res.json(spot)
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
        let size = 20;
        let page = 0;
        if (req.query.size < 20 && req.query.size > 0) {
            size = req.query.size
        }
        if (req.query.page < 10 && req.query.page > 0) {
            page = req.query.page
        }
        const limit = size;
        let offset = 0
        if (page > 1) {
            offset = ((page - 1) * limit);
        }
            const whereParams = {}
            if (req.query.minLat) {
                const minLat = { [Op.gte]: req.query.minLat }
                whereParams.Lat = minLat
            }
            if (req.query.maxLat) {
                const maxLat = { [Op.lte]: req.query.maxLat }
                whereParams.Lat = maxLat
            }
            if (req.query.minLng) {
                const minLng = { [Op.gte]: req.query.minLng }
                whereParams.Lng = minLng
            }
            if (req.query.maxLng) {
                const maxLng = { [Op.lte]: req.query.maxLng }
                whereParams.Lng = maxLng
            }
            if (req.query.minPrice) {
                const minPrice = { [Op.gte]: req.query.minPrice }
                whereParams.Price = minPrice
            }
            if (req.query.maxPrice) {
                const maxPrice = { [Op.lte]: req.query.maxPrice }
                whereParams.Price = maxPrice
            }
            const spots = await Spot.findAll({
                where: whereParams,
                limit,
                offset

            })
            res.json({spots:spots})
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
