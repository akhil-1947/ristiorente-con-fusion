const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Comments = require('../models/comments');

const commentRouter = express.Router();

commentRouter.use(bodyParser.json());

commentRouter.route('/')
.options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
.get(cors.cors, (req,res,next) => {
    Comments.find(req.query)
    .populate('author')
    .then((comments) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(comments);
    }, error => next(error))
    .catch((error) => next(error));
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
    if(req.body != null) {
        req.body.author = req.user._id;
        Comments.create(req.body)
        .then((comment) => {
            Comments.findById(comment._id)
            .populate('author')
            .then((comment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(comment);
            },err => next(err));
        }, err => next(err))
        .catch((err) => next(err));
    }
    else {
        var err= new Error('Comment not found inside the body of request!');
        err.status = 404;
        return next(err);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /comments');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    Comments.remove(req.query)
    .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    }, err => next(err))
    .catch((err) => next(err));
});

commentRouter.route('/:commentId')
.options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
.get(cors.cors, (req,res,next) => {
    Comments.findById(req.params.commentId)
    .populate('author')
    .then((comment) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(comment);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req,res) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /comments/'+req.params.commentId);
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
    Comments.findById(req.params.commentId)
    .then((comment) => {
        if(comment != null) {
            if(comment.author.toString() == req.user._id.toString()) {
                req.author = req.user._id;
                Comments.findByIdAndUpdate(comment._id,{$set : req.body}, {new : true})
                .populate('author')
                .then((comment) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(comment);
                }, err => next(err));
            }
            else {
                var err = new Error(`you are not authorised to edit this comment as you did not posted this!`);
                err.status = 403;
                return next(err);
            }
        }
        else {
            var err = new Error(`comment ${req.params.commentId} is null`);
            err.status = 404;
            return next(err);
        }
    }, err => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
    Comments.findById(req.params.commentId)
    .then((comment) => {
        if(comment != null) {
            if(comment.author.toString() == req.user._id.toString()) {
                Comments.findByIdAndRemove(comment._id)
                .then((commentDoc) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(commentDoc);
                }, err => next(err))
                .catch((err) => next(err));
            }
            else {
                var err = new Error(`you are not authorised to delete this comment as you did not posted this!`);
                err.status = 403;
                return next(err);
            }
        }
        else {
            var err = new Error(`comment ${req.params.commentId} is null`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = commentRouter;