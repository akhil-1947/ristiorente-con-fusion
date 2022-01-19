const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const authenticate = require('../authenticate');
const Cart = require('../models/cart');
const Dishes = require('../models/dishes');

const cartRouter = express.Router();
cartRouter.use(bodyParser.json());

cartRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200)})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Cart.findOne({user : req.user._id})
    .populate('items.dish')
    .then((cart) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(cart);
    }, err => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Cart.findOne({user : req.user._id})
    .then((cart) => {
        if(cart) {
            Cart.findByIdAndRemove(cart._id)
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(response);
            }, err => next(err));
        }
        else {
            var err = new Error('cart does not exist');
            err.status = 404;
            return next(err);
        }
    },err => next(err))
    .catch((err) => next(err));
});

cartRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200)})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish) {
            Cart.findOne({user : req.user._id})
            .then((cart) => {
                if(cart) {
                    var alreadyExists = cart.items.filter((item) => item.dish.toString() === req.params.dishId.toString());
                    if(alreadyExists.length > 0) {
                        res.statusCode = 403;
                        res.setHeader('Content-Type','application/json');
                        res.json({err : 'Dish already exist in the cart'});
                    } 
                    else {
                        cart.items.push({
                            dish : dish._id,
                            quantity : req.body.quantity
                        });
                        cart.totalAmount = cart.totalAmount + req.body.quantity* dish.price;
                        cart.save()
                        .then((cart) => {
                            Cart.findById(cart._id)
                            .populate('items.dish')
                            .then((response) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type','application/json');
                                res.json(response);
                            }, err => next(err));
                        }, err => next(err))
                        .catch((err) => next(err));
                    }
                }
                else {
                    Cart.create({
                        user : req.user._id,
                        totalAmount : req.body.quantity*dish.price,
                        items : [
                            {
                                dish : dish._id,
                                quantity : req.body.quantity
                            }
                        ]
                    }).then((cart) => {
                        Cart.findById(cart._id)
                        .populate('items.dish')
                        .then((response) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type','application/json');
                            res.json(response);
                        }, err => next(err));
                    }, err => next(err));
                }
            }, err => next(err))
            .catch((err) => next(err));
        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type','application/json');
            res.json({err : 'Dish does not exist in /dishes'});
        }
    }, err => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Cart.findOne({user : req.user._id})
    .then((cart) => {
        if(cart) {
            var removed;
            cart.items.forEach((item) => {
                if(item.dish.toString() === req.params.dishId.toString()) {
                    removed = item;
                }
            });
            if(removed != null) {
                cart.items = cart.items.filter((item) => item.dish.toString() !== req.params.dishId.toString());
                Dishes.findById(removed.dish)
                .then((dish) => {
                    cart.totalAmount = cart.totalAmount - removed.quantity*dish.price;
                    cart.save()
                    .then((cart) => {
                        Cart.findById(cart._id)
                        .populate('items.dish')
                        .then((response) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type','application/json');
                            res.json(response);
                        }, err => next(err));
                    }, err => next(err))
                }, err => next(err))
                .catch((err) => next(err));
            }
            else {
                res.statusCode = 404;
                res.setHeader('Content-Type','application/json');
                res.json({err : "Dish does not exist in cart"});
            }
        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type','application/json');
            res.json({err : "cart does not exist!"});
        }
    },err => next(err))
    .catch((err) => next(err));
});

module.exports = cartRouter;