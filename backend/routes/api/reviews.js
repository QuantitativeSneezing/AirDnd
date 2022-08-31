const express = require('express')
const router = express.Router();
const { Spot, User, ReviewImage, Review } = require('../../db/models');
const { requireAuth } = require('../../db/utils/auth')

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

module.exports = router
