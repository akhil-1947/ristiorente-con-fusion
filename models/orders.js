const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Currency = require('mongoose-currency');

const orderSchema = new Schema({
    orderId : {
        type : String,
        required : true
    },
    amount : {
        type : Currency,
        min : 0,
        required : true
    },
    paymentStatus : {
        type : Boolean,
        default : false
    },
    paymentId : {
        type : String,
        default : ""
    },
    signature : {
        type : String,
        default : ""
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    cart : [
        {
            dish : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Dish'
            },
            quantity : {
                type  : Number,
                required : true,
                min : 1
            }
        }
    ]
}, {
    timestamps : true,
});

const Orders = mongoose.model('Order', orderSchema);

module.exports = Orders;