const express = require('express')
const router = express.Router();
const { Spot, User, SpotImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../db/utils/auth')

router.get('/current',
    requireAuth,
    async (req, res, next) => {
        const { user } = req;
        if (user) {
            const id = user.id;
            const userBookings = await (Booking.findAll({
                where: {
                    userId: id
                },
            }))
            return res.json(userBookings);
        } else res.json(
            {
                "message": "Spot couldn't be found",
                "statusCode": 404
            });
    });


module.exports = router
