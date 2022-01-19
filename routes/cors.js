const express = require('express');
const cors = require('cors');

const app = express();

const whiteList = ['https://localhost:3443','http://localhost:3000','http://localhost:3001'];

// configuring cors as per our requirements
const corsOptionsDelegate = (req,callback) => {
    var corsOptions;
    if(whiteList.indexOf(req.header('Origin')) !== -1) {
        // setting origin to true will allow cross origin request from that domain and send Access-Control-Allowed-Origin to response
        corsOptions = { origin : true };
    }
    else {
        corsOptions = { origin : false };
    }
    callback(null,corsOptions);
};

// exports.cors = cors() will allow all the cross origin requests to be allowed and Access-Control-Allowed-Origin 
// will be send as * for all the cross origin requests 
exports.cors = cors();

// exports.corsWithOptions = cors(corsOptionsDelegate) will allow only those cross origin requests which are allowed 
// inside the corsOptionsDelegate function and Access-Control-Allowed-Origin will be send for allowed requests 
exports.corsWithOptions = cors(corsOptionsDelegate);