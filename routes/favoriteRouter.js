var express = require('express');
var bodyParser = require('body-parser');
var Favorites = require('../models/favorite');
var authenticate = require('../authenticate');
var cors = require('./cors');
const Dishes = require('../models/dishes');

var favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req,res)=> {res.sendStatus(200)})
.get(cors.corsWithOptions,authenticate.verifyUser ,(req,res,next) => {
    Favorites.findOne({user : req.user._id})
    .populate('dishes')
    .populate('user')
    .then((doc) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(doc);
    }, err => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user : req.user._id})
    .then((fav) => {
        if(fav) {
            req.body.forEach(dish => {
                fav.dishes.push(dish._id);
            });
            fav.save()
            .then((doc) => {
                Favorites.findById(doc._id)
                .populate('dishes')
                .populate('user')
                .then((favourite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favourite);
                },err => next(err))
                .catch((err) => next(err));
            }, err => next(err))
            .catch((err) => next(err));
        }
        else {
            Favorites.create({
                user : req.user._id,
                dishes : req.body.map((dish) => dish._id)
            })
            .then((fav) => {
                Favorites.findById(fav._id)
                .populate('dishes')
                .populate('user')
                .then((favourite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favourite);
                },err => next(err))
                .catch((err) => next(err));
            }, err => next(err))
            .catch((err) => next(err));
        }
    },err => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user : req.user._id})
    .populate('user')
    .then((dish) => {
        if(dish) {
            dish.remove()
            .then((prod) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(prod);
            },err => next(err))
            .catch((err) => next(err));
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({status : "You don't have any favorites to delete!"});
        }
    },err => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res)=> {res.sendStatus(200)})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user : req.user._id})
    .populate('user')
    .then((fav) => {
        if(!fav) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({status : "Favorites not added!",exists : false, favorites : fav});
        }
        else {
            if(fav.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json({status : "Dish is not added to favorites",exists : false, favorites : fav});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json({status : "Favorites Dish Found!",exists : true, favorites : fav});
            }
        }
    }, err => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
    Dishes.findOne({_id : req.params.dishId})
    .then((dish) => {
        if(dish) {
            Favorites.findOne({user : req.user._id})
            .populate('dishes')
            .populate('user')
            .then((fav) => {
                if(fav) {
                    if(fav.dishes.indexOf(req.params.dishId) == -1) {
                        fav.dishes.push(req.params.dishId);
                        fav.save()
                        .then((favDoc) => {
                            Favorites.findById(favDoc.id)
                            .populate('user')
                            .populate('dishes')
                            .then((result) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type','application/json');
                                res.json(result);
                            });
                        },err => next(err));
                    }
                    else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(fav);
                    }
                }
                else {
                    Favorites.create({
                        user : req.user._id,
                        dishes : [req.params.dishId]
                    })
                    .then((doc) => {
                        Favorites.findById(doc._id)
                        .populate('dishes')
                        .populate('user')
                        .then((favourite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type','application/json');
                            res.json(favourite);
                        },err => next(err))
                        .catch((err) => next(err));
                    },err => next(err))
                    .catch((err) => next(err));
                }
            }, err => next(err))
            .catch((err) => next(err));
        }
        else {
            var err = new Error('Requested dish does not exist on /dishes!');
            err.status = 404;
            return next(err);
        }
    })
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user : req.user._id})
    .then((fav) => {
        if(fav) {
            if(fav.dishes.indexOf(req.params.dishId) == -1) {
                var err = new Error("The requested dish is not added to your favorites!");
                err.status = 404;
                return next(err);
            }
            else {
                fav.dishes = fav.dishes.filter((dish) => dish != req.params.dishId);
                fav.save()
                .then((favDoc) => {
                    Favorites.findById(favDoc._id)
                    .populate('dishes')
                    .populate('user')
                    .then((favourite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favourite);
                    },err => next(err))
                    .catch((err) => next(err));
                },err => next(err))
                .catch((err) => next(err));
            }
        }
        else {
            var err = new Error("You have added nothing to the favorites!");
            err.status = 403;
            return next(err);
        }
    }, err => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;