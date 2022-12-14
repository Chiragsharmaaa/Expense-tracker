const bcrypt = require('bcrypt');

const User = require('../models/user');

exports.postSignup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findAll({ where: { email } });
        if (user.length > 0) {
            return res.status(550).json({ message: 'user already exists!' });
        };

        const saltRounds = 10;

        bcrypt.hash(password, saltRounds, async (err, hash) => {
            console.log(err)
            await User.create({ name, email, password: hash });
            return res.status(201).json({ message: 'user created!' });
        });

    } catch (err) {
        res.status(500).json(err);
    };
};
exports.postLogin = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Enter all fields' })
        }

        const user = await User.findAll({ where: { email } })

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' })
        }
        const existingUser = user[0];

        bcrypt.compare(password, existingUser.password, (err, result) => {
            if (err) {
                return new Error('Something went wrong')
            };
            if (result === true) {
                return res.status(200).json({ success: true, message: 'User logged in successfully!' });
            } else {
                return res.status(400).json({ success: false, message: 'Password is incorrect' })
            }
        });

    } catch (err) {
        return res.status(500).json({ message: err, success: false })
    }
}