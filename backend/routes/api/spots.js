const express = require('express')
const router = express.Router();
const { Spot, User } = require('../../db/models');
const { requireAuth } = require('../../db/utils/auth')
router.get('/',
    async (req, res, next) => {
        const spots = await Spot.findAll({
            include: {
                model: User
            }
        })
        res.json(spots)
    }
)
router.get('/:id',
    async (req, res, next) => {
        const lookForId = req.params.id
        const spot = await Spot.findOne({
            where: { id: lookForId }
        })
        // TODO: eager load images
        if (spot) {
            res.json(spot)
        } else {
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
router.post('/',
    async (req, res, next) => {
        const { ownerId, address, city, state, country, lat, lng, name, description, price } = req.body
        const newSpot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price });
        res.json(newSpot)
    })
module.exports = router
