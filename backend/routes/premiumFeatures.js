const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expense');
const middleware = require('../middleware/auth');

router.get('/premiumleaderboard', middleware.authentication, expenseController.getAllUserExpenses);

module.exports = router;