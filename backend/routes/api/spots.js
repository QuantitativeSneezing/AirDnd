const express = require('express')
const router = express.Router();
const { Spot } = require('../../db/models');

router.get('/',
    (req, res) => {
        const spots= await Spot.findall()
        res.json(spots)
    }
)

module.exports = router
