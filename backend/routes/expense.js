const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expense');

router.post('/add-expense', expenseController.postAddExpense);
router.get('/', expenseController.getExpenses);
router.delete('/delete-expense/:id', expenseController.deleteExpense);

module.exports = router;