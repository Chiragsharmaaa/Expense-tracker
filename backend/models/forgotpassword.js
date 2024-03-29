const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const forgotPassSchema = new Schema({
    active: {
        type: Boolean,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    uuid: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Forgotpassword', forgotPassSchema);
