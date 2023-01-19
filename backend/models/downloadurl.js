const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const downloadSchema = new Schema({
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = mongoose.model('DownloadUrl', downloadSchema);
