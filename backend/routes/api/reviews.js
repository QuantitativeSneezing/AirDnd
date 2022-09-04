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
        const { user } = req;
        const review = await Review.findOne({
            where: { id: lookForId }
        });
        if (review) {
            //first check if owner
            const { url } = req.body
            if (user.id !== review.userId) {
                res.status(403)
                return res.json({
                    "message": "Forbidden",
                    "statusCode": 403
                })
            }
            const associatedImages = await ReviewImage.findAll({
                where: { userId: user.id }
            })
            if (associatedImages){
                if (associatedImages.length > 9) {
                    res.status(403)
                    return res.json({
                        "message": "Maximum number of images for this resource was reached",
                        "statusCode": 403
                    })
                }
            }
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
router.put('/:id',
    // requireAuth,
    async (req, res, next) => {
        const { user } = req;
        //for validating that the spot is owned by the user
        const lookForId = req.params.id
        const review = await Review.findOne({
            where: { id: lookForId },
        })

        if (review) {
            if (user.id !== review.userId) {
                res.status(403)
                return res.json({
                    "message": "Forbidden",
                    "statusCode": 403
                })
            }
            //error out if unauthorized first
            const newReview = (req.body.review || review.review)
            const stars = (req.body.stars || review.stars)
            review.review = newReview
            review.stars = stars
            review.save();
            res.json(review)
        } else {
            res.status(404)
            res.json({
                "message": "Review couldn't be found",
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
        const review = await Review.findOne({
            where: { id: lookForId },
        })

        if (review) {
            if (user.id !== review.userId) {
                res.status(403)
                return res.json({
                    "message": "Forbidden",
                    "statusCode": 403
                })
                //error out if unauthorized first
            }
            review.destroy();
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
module.exports = router
