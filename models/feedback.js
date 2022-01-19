const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    telnum : {
        type : Number,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    agree : {
        type : Boolean,
        default : true
    },
    contactType : {
        type : String,
        default : 'Tel.'
    },
    feedback : {
        type : String,
        default : ''
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
}, {
    timestamps : true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;