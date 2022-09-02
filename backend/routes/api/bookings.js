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
                "message": "no Bookings/User found",
                "statusCode": 404
            });
    });
router.put('/:id',
    requireAuth,
    async (req, res, next) => {
        const { user } = req;
        //for validating that the spot is owned by the user
        const lookForId = req.params.id
        const booking = await Booking.findOne({
            where: { id: lookForId },
        })
        if (booking) {
            if (user.id !== booking.userId) {
                res.status(403)
                return res.json({
                    "message": "Forbidden",
                    "statusCode": 403
                })
                //error out if unauthorized first
            }
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
                where: { id: lookForId }
            })
            for (let i = 0; i < otherBookings.length; i++) {
                // this is an incredibly messy validation method, might update in future
                const existingBooking = otherBookings[i]

                //four overlap cases: the beginning or end of the booking can overlap with the middle of a date,
                //or the new booking can entirely envelope another date or be entirely enveloped by another date
                let overlap =
                    (compareStartDate >= existingBooking.startDate && compareStartDate <= existingBooking.endDate) ||
                    (compareEndDate >= existingBooking.startDate && compareEndDate <= existingBooking.endDate) ||
                    (compareStartDate <= existingBooking.startDate && compareEndDate >= existingBooking.endDate);
                if (existingBooking.id == lookForId) {
                    overlap = false
                }
                // exclude existing booking from potential overlaps
                if (overlap) {
                    res.status(403)
                    return res.json({
                        "message": "Sorry, this spot is already booked for the specified dates",
                        "statusCode": 403,
                        "errors": "start or end date overlaps with existing booking"

                    })
                }
            }
            if (startDate && startDate instanceof Date) {
                booking.startDate = startDate
            }
            if (endDate && endDate instanceof Date) {
                booking.endDate = endDate
            }
            res.json(booking)
        } else res.json(
            {
                "message": "no Booking found",
                "statusCode": 404
            });
    })
module.exports = router
