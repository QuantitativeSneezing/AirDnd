const express = require('express')
const router = express.Router();
const { Spot, User, ReviewImage, Review } = require('../../db/models');
const { requireAuth } = require('../../db/utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../db/utils/validation');
const validateReviewImage = [
    check('url')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a url'),
    handleValidationErrors
];
router.get('/current',
    requireAuth,
    async (req, res, next) => {
        const { user } = req;
        if (user) {
            const id = user.id;
            const userReviews = await (Review.findAll({
                where: {
                    userId: id
                },
            }))
            return res.json(userReviews);
        } else return res.json("ERROR");
    });
router.post('/:id/images',
    validateReviewImage,
    async (req, res, next) => {
        const lookForId = req.params.id
        const review = await Review.findOne({
            where: { id: lookForId }
        });
        if (review) {
            const { url } = req.body
            const newSpotImage = await ReviewImage.create({ reviewId: lookForId, url })
            res.json(newSpotImage)
        } else {
            res.status(404)
            res.json({
                "message": "Review couldn't be found",
                "statusCode": 404
            })
        }
    })
module.exports = router
