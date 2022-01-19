const express = require('express');
const bodyParser = require('body-parser');

const Promotions = require('../models/promotions');

const promotionRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
.get(cors.cors, (req,res,next) => {
    Promotions.find(req.query)
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotions);
    }, err => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    Promotions.create(req.body)
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    }, err => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('put operation not supported on /promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, err => next(err))
    .catch((err) => next(err));
});

promotionRouter.route('/:promoId')
.options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
.get(cors.cors, (req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    }, err => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('post operation not supported on promotion/'+ req.params.promoId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    Promotions.findByIdAndUpdate(req.params.promoId,{
        $set : req.body
    }, {
        new : true,
    })
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    }, err => next(err))
    .catch((err) => next(err));
});

module.exports = promotionRouter;