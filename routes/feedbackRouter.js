const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Feedback = require('../models/feedback');

const feedbackRouter = express.Router();
feedbackRouter.use(bodyParser.json());

feedbackRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200)})
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Feedback.find(req.query)
    .then((feedback) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(feedback);
    }, err => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    req.body.user = req.user._id;
    Feedback.create(req.body)
    .then((feedback) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(feedback);
    }, err => next(err))
    .catch((err) => next(err));
});


feedbackRouter.route('/:docId')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200)})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Feedback.findOne({user : req.user._id, _id : req.params.docId})
    .then((feedback) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(feedback);
    }, err => next(err))
    .catch((err) => next(err));
});

module.exports = feedbackRouter;