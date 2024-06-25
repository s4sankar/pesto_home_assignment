const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
    },
    status : {
        type: String,
        required: true,
        enum: ['Todo', 'InProgress', 'Done'],
        default: 'Todo'
    },
    userId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
