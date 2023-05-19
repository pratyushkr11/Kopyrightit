const express = require('express');
const router = express.Router();
const literaryFormController = require('../controllers/literaryFormController');

router.post('/', literaryFormController.handleFormData);

module.exports = router;