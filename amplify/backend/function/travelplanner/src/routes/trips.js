const express = require('express');
const router = express.Router();

const trip_controller = require('../controllers/tripController');


// POST request to creating Trip
router.post('/create', trip_controller.trip_create);

// DELETE request to delete Trip
router.delete('/:id/delete/', trip_controller.trip_delete);

// PUT request to update Trip
router.put('/:id/update/', trip_controller.trip_update);

// GET request for one Trip
router.get('/:id', trip_controller.trip_detail);

// GET request for list of all Trip items
router.get('/', trip_controller.trip_list);

module.exports = router;