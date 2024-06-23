const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    status : {
        type: String,
        required: true,
        enum: ['Todo', 'InProgress', 'Done'],
        default: 'Todo'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
