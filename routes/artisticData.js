const express = require('express');
const router = express.Router();
const artisticFormController = require('../controllers/artisticFormController');

router.post('/', artisticFormController.handleFormData);

module.exports = router;