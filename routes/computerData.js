const express = require('express');
const router = express.Router();
const computerFormController = require('../controllers/computerFormController');

router.post('/', computerFormController.handleFormData);

module.exports = router;