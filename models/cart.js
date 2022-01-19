const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Currency = require('mongoose-currency');

const cartSchema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    totalAmount : {
        type : Currency,
        required : true,
        min : 0
    },
    items : [
        {
            dish : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Dish'
            },
            quantity : {
                type : Number,
                required : true,
                min : 1
            }
        }
    ]
}, {
    timestamps : true,
});

var Cart = mongoose.model('Cart',cartSchema);

module.exports = Cart;