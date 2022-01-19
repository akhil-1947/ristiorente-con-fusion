const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const authenticate = require('../authenticate');
const Cart = require('../models/cart');
const Orders = require('../models/orders');
const Razorpay = require('razorpay');

const instance = new Razorpay({
    key_id : 'rzp_test_XGENogoPB0Rsw4',
    key_secret : '0QETnoxCtcVyIJ8FgqkmsB9i'
});

const ordersRouter = express.Router();
ordersRouter.use(bodyParser.json());

ordersRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200)})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Orders.find({user : req.user._id})
    .populate('cart.dish')
    .then((orders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(orders);
    }, err => next(err))
    .catch((err) => next(err));
});

ordersRouter.route('/createOrder')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200)})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Cart.findOne({user : req.user._id})
    .then((cart) => {
        if(cart) {
            Orders.findOne({user : req.user._id, paymentStatus : false, amount : cart.totalAmount})
            .then((order) => {
                if(order) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json({response : order, success : true, message : 'Order has already been created!'});
                }
                else {
                    var options = {
                        amount : cart.totalAmount,
                        currency : 'USD'
                    };
                    instance.orders.create(options)
                    .then((result) => {
                        Orders.create({
                            orderId : result.id,
                            amount : result.amount,
                            user : req.user._id,
                            cart : cart.items.map((item) => {
                                return {
                                    dish : item.dish,
                                    quantity : item.quantity
                                };
                            })
                        })
                        .then((order) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type','application/json');
                            res.json({response : order, success : true});
                        }, err => next(err));
                    })
                    .catch(err => next(err));
                }
            }, err => next(err))
            .catch((err) => next(err));
        }
        else {
            res.statusCode = 400;
            res.setHeader('Content-Type','application/json');
            res.json({response : "Cart does not have any item!", success : false});
        }
    }, err => next(err))
    .catch((err) => next(err));
});

ordersRouter.route('/:docId')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200)})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Cart.findOne({user : req.user._id})
    .then((cart) => {
        if(cart) {
            Orders.findById(req.params.docId)
            .then((order) => {
                if(order) {
                    order.paymentStatus = true;
                    order.paymentId = req.body.paymentId;
                    order.signature = req.body.signature;
                    order.save()
                    .then((order) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json({response : order, success : true});
                    }, err => next(err));
                }
                else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type','application/json');
                    res.json({success : false, message : 'Order not found!'});
                }
            }, err => next(err))
            .catch((err) => next(err));
        }
        else {
            res.statusCode = 400;
            res.setHeader('Content-Type','application/json');
            res.json({response : "Cart does not have any item!", success : false});
        }
    }, err => next(err))
    .catch((err) => next(err));
});

module.exports = ordersRouter;