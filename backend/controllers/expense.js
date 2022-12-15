const Expense = require('../models/expense');

exports.postAddExpense = async(req, res, next) => {
    const {amount, description, category} = req.body;

    try {
        const data = await req.user.createExpense({amount, description, category});
        res.status(201).json({data, message:'expense added!'});
    } catch(err) {
        res.status(500).json({message:'Cannot add Expense!'});
    };
};

exports.getExpenses = async(req, res, next) => {
    try {
        let data = await req.user.getExpenses();
        res.status(200).json(data);
    } catch(err) {
        res.status(500).json({message:'unable to load expenses!'});
    };  
};

exports.deleteExpense = async(req, res, next) => {
    try{
        const expenseId = req.params.id;
        await req.user.getExpenses({where:{id:expenseId}})
        .then(expense => {
            let foundExpense = expense[0];
            foundExpense.destroy();
            res.status(200).json({message:'Successfully deleted Expense!'});
        })
    } catch(err) {
        res.status(500).json({message:'Cannot delete Expense!'})
    };
};