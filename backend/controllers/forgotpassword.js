const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

exports.forgotpassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json('No user found!');
        }
        const id = uuid.v4();
        await Forgotpassword.create({ active: true, userId: user._id, uuid: id });
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email, // Change to your recipient
            from: 'chiragsharma250999@gmail.com', // Change to your verified sender
            subject: 'Reset your password!',
            text: 'Click on the link below to reset password',
            html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
        };

        sgMail.send(msg).then(response => {
            return res.json({ message: 'Link to reset password sent to your mail id', success: true });
        }).catch(err => {
            throw new Error(err);
        });
    } catch (err) {
        return res.json({ message: err, success: false });
    };
};

exports.resetpassword = async (req, res, next) => {
    let id = req.params.id;
    try {
        let forgotpasswordrequest = await Forgotpassword.findOne({ uuid: id })
        if (!forgotpasswordrequest) {
            return res.status(404).json('User doesnt exist')
        }
        forgotpasswordrequest.update({ active: false });
        res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
        )
        res.end();
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

exports.updatepassword = async (req, res, next) => {
    const { newpassword } = req.query;
    const id = req.params.resetpasswordid;

    try {
        const resetpasswordrequest = await Forgotpassword.findOne({ uuid: id })
        const user = await User.findById({ _id: resetpasswordrequest.userId })
        if (!user) {
            return res.status(404).json({ error: 'No user Exists', success: false })
        };
        const salt = 10;
        bcrypt.hash(newpassword, salt, async (err, hash) => {
            if (err) {
                throw new Error(err);
            }
            user.password = hash;
            await user.save();
            res.status(201).json({ message: 'Successfuly updated new password' })
        });
    } catch (error) {
        return res.status(403).json({ error, success: false });
    };
};