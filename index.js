'use strict';

import express from 'express';
import * as http from 'http';
import * as querystring from 'querystring';
import * as data from './data.js';
import { Visitors } from "./models/Visitors.js";
import cors from 'cors';

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', cors()); // set Access-Control-Allow-Origin header for api route
app.set('view engine', 'ejs'); // set the view engine to ejs

//defined routes with mongodb
app.get('/', (req, res, next) => {
    Visitors.find({}).lean()
      .then((visitors) => {
        // respond to browser only after db query completes
        res.render('home', { visitors:JSON.stringify(visitors)});
      })
      .catch(err => next(err))
});

app.get('/visitor/:lname', (req, res, next) => {
    Visitors.findOne({ "lname": req.params.name }).lean()
        .then((visitor) => {
            res.render('detail', {visitor: visitor} );
            })
        .catch(err => next(err));
});

//api's
app.get('/api/visitors', (req, res, next) => {
    Visitors.find({}).then((err, result) => {
        if(err || !results) return next(err);
        res.json(result);
    });
});

app.get('/api/visitor/:lname', (req, res, next) => {
    let name = req.params.name;
    console.log(name);
    Visitors.findOne({name: name}).then((visitor) => {
        res.json(visitor);
        })
    .catch(err => next(err));
});

app.get('/api/delete/:name', (req,res, next) => {
    Visitors.deleteOne({"name":req.params.lname }).then((err, result) => {
        if (err) {
            return next(err);
        }
        else {
        // return # of items deleted
        console.log(result)
        res.json({"deleted": result});
        }
    });
});

app.post('/api/savetimein/', (req,res, next) => {
    // find & update existing item, or add new 
    if(!req.body.name) {
        let visitor = new Visitors(req.body);
        visitor.save((err, newVisitor) => {
            if(err) return next(err);
            res.json({updated: 0, name: newVisitor.lname});
        });
    }

    else {
        Visitors.updateOne({fname: req.body.fname}, {lname: req.body.lname, timein: req.body.timein, timeout: req.body.timeout, date: req.body.date, company: req.body.company}, (err, result) => {
            if(err) return next(err);
            res.json({updated: result.nModified, name: req.body.lname});
        });
    }
});

app.post('/api/savetimeout/', (req,res, next) => {
    // find & update existing item, or add new 
    if(!req.body.name) {
        let visitor = new Visitors(req.body);
        visitor.save((err, newVisitor) => {
            if(err) return next(err);
            res.json({updated: 0, name: newVisitor.lname});
        });
    }
});

// define 404 handler
app.use((req,res) => {
 res.type('text/plain'); 
 res.status(404);
 res.send('404 - Not found');
});

//started app
app.listen(app.get('port'), () => {
  console.log('Express started'); 
});