const Expense = require('../models/expense');

exports.postAddExpense = async(req, res, next) => {
    const {amount, description, category} = req.body;

    try {
        const data = await Expense.create({amount, description, category});
        res.status(201).json({data, message:'expense added!'});
    } catch(err) {
        res.status(500).json({message:'Cannot add Expense!'});
    };
};

exports.getExpenses = async(req, res, next) => {
    try {
        let data = await Expense.findAll();
        res.status(200).json(data);
    } catch(err) {
        res.status(500).json({message:'unable to load expenses!'});
    };  
};

exports.deleteExpense = async(req, res, next) => {
    try{
        const expenseId = req.params.id;
        console.log(req.params.id)
        await Expense.destroy({where:{id:expenseId}});
        res.status(200).json({message:'expense deleted successfully!'})
    } catch(err) {
        res.status(500).json({message: 'unable to delete expenses!'});
    };
};