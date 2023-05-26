const express = require("express");
const router = express.Router();

let {getSeats, reserveSeats } = require('../controllers/seat_controller');


router.get('/seats', getSeats);
router.post('/reserve-seats', reserveSeats);

module.exports = router;