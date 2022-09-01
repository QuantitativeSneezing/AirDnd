const express = require('express')
const router = express.Router();
const { Spot, User, SpotImage, Review, Booking } = require('../../db/models');
const { requireAuth } = require('../../db/utils/auth')

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

router.get('/',
    async (req, res, next) => {
        const spots = await Spot.findAll({
        })
        res.json(spots)
    }
)

router.post('/',
    async (req, res, next) => {
        const { ownerId, address, city, state, country, lat, lng, name, description, price } = req.body
        const newSpot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price });
        res.json(newSpot)
    })

module.exports = router
