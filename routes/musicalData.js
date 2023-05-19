const express = require('express');
const router = express.Router();
const musicalFormController = require('../controllers/musicalFormController');

router.post('/', musicalFormController.handleFormData);

module.exports = router;