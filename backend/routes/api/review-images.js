const express = require('express')
const sequelize = require('sequelize')
const router = express.Router();
const { Spot, User, SpotImage, Review, Booking } = require('../../db/models');
const { requireAuth } = require('../../db/utils/auth');
const { route } = require('./spots');

router.delete('/:id',
    requireAuth,
    async (req, res, next) => {
        const { user } = req;
        //for validating that the spot is owned by the user
        const lookForId = req.params.id
        const reviewImage = await reviewImage.findOne({
            where: { id: lookForId },
        })


        if (reviewImage) {
            const review = await Review.findOne({
                where: { id: reviewImage.reviewId }
            })
            if (user.id !== review.userId) {
                res.status(403)
                return res.json({
                    "message": "Forbidden",
                    "statusCode": 403
                })
                //error out if unauthorized first
            }
            reviewImage.destroy();
            res.status(200)
            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
            })
        } else {
            res.status(404)
            res.json({
                "message": "Review image couldn't be found",
                "statusCode": 404
            })
        }
    })
module.exports = router;
