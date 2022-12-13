const User = require('../models/user');

exports.postSignup = async(req, res, next) => {
    try{
        const {name, email, password} = req.body;
        const user = await User.findAll({where:{email}});
        if(user.length>0) {
            return res.status(402).json({message: 'user already exists!'});
        }
        await User.create({name, email, password});
        return res.status(200).json({message: 'user created!'});
    } catch(err) {
        res.status(500).json(err);
    };
};