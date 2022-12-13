const User = require('../models/user');

exports.postSignup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findAll({ where: { email } });
        if (user.length > 0) {
            return res.status(550).json({ message: 'user already exists!' });
        }
        await User.create({ name, email, password });
        return res.status(201).json({ message: 'user created!' });
    } catch (err) {
        res.status(500).json(err);
    };
};

exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findAll({ where: { email } });
        if (user.length == 0) {
            return res.status(403).json({ message: `user doesn't exists!` })
        }

        const existingUser = user[0];

        if (existingUser.password != password) {
            return res.status(401).json({ message: 'Please check your password!' })
        };
        return res.status(200).json(user);
    } catch(error) {
        return res.status(500).json(error);
    }
}