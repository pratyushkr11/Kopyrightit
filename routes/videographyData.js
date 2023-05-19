const express = require('express');
const router = express.Router();
const videographyFormController = require('../controllers/videographyFormController');

router.post('/', videographyFormController.handleFormData);

module.exports = router;