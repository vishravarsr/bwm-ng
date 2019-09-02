const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');

router.get('', function(req, res) {
  Rental.find({}, function(err, foundRental) {
    res.json(foundRental);
  });
});

router.get('/:id', function(req, res) {
  const rentalId = req.params.id;
  Rental.findById(rentalId, function(err, foundRental) {

    if(err) {
      res.status(422).send({errors: [{title: 'Rental error!', detail: 'cound not find rental!'}]});
    }

    res.json(foundRental);
  })
});

module.exports = router;
