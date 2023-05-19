const express = require('express');
const router = express.Router();
const soundFormController = require('../controllers/soundFormController');

router.post('/', soundFormController.handleFormData);

module.exports = router;