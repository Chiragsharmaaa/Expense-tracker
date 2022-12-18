const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('sequelize')
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

exports.getAllUserExpenses = async(req, res, next) => {
    try {
        if(req.user.ispremiumuser) {

            const leaderboard = await User.findAll({
                attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'totalExpense']],
                include: [
                    {
                    model: Expense,
                    attributes:[]
                    }
                ],
                group:['user.id'],
                order:[['totalExpense','DESC']]
            });
            
            return res.status(200).json({success : true, data : leaderboard});
        };
        return res.status(400).json({message : 'user is not a premium user' });
    } catch(err) {
        res.status(500).json({success : false, data : err});
    }
}
// exports.getLeaderboardUserExpense = async(req,res,next)=>{
//     try {
//         if(req.user.ispremiumuser){
//             let userId = req.body.userId;

//             let user = await User.findOne({where:{id:userId}})
//             const expenses = await user.getExpenses();

//            return res.status(200).json({success:true , data: expenses })
//         }
//         return res.status(400).json({message : 'user is not premium user' });
//     } catch (error) {
//         res.status(500).json({success : false, data : error});
//     }
// }