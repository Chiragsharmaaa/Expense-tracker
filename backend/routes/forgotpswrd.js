const express = require('express');
const router = express.Router();
const forgotpasswordRoutes = require('../controllers/forgotpswrd');
const middleware = require('../middleware');

router.get('/forgotpassword',middleware.authentication, forgotpasswordRoutes );

module.exports = router;