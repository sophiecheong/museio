var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');
const express = require('express');

function ScheduleManager(maindb, eventdb, errordb) {
    this.docdatabase = maindb;
    this.eventdatabase = eventdb;
    this.errordatabase = errordb;
}

ScheduleManager.prototype = {
    
    getSchedules: function(req, res){
        var self = this;
        var item = req.query;
        var token = req.header.auth.token;
        var responseHeader = {};
        
        if(!token){
            res.status(400).send({error: "Unauthorized"});
        }
        self.docdatabase.checkauth(token, function(err, authentication){
            if(err){
                res.status(400).send({error: "Unauthorized"});
            }
            var querySpec = {
                query: 'SELECT * FROM root r WHERE r.userId=@userId',
                parameters: [{
                    name:'@userId',
                    value: item.userId
                }]
            };
            self.docdatabase.find(querySpec, function (err, items){
                if(err){
                    throw(err);
                }
                responseHeader['data'] = items;
                self.docdatabase.encodeauth(item.userId, function(err, token){
                    if (err){
                        throw(err);
                    }
                    var headers = [];
                    var tokenarray = [];
                    tokenarray['token'] = token;
                    headers['auth'] = tokenarray;
                    responseHeader['headers'] = headers;
                    responseHeader['status'] = 200;
                    responseHeader['statusText'] = 'Query finished running.';

                    console.log(responseHeader);
                    res.status(200).send(responseHeader); //not sure if this is right
                });
            });
        });
        
    }, 
    
    addSchedule: function(req, res){
        var self = this;
        var item = req.body;
        var token = req.header.auth.token;
        var responseHeader = {};
        
        if(!token){
            res.status(400).send({error: "Unauthorized"});
        }
        self.docdatabase.checkauth(token, function(err, authentication){
            if(err){
                res.status(400).send({error: "Unauthorized"});
            }
            var id = authentication.substring(2);
            if(!item.userId || !item.date || !item.startTime || !item.endTime){
                //send back error response
                res.status(400).send({statusText: "Missing Parameters"}); //bad request    
            } 
            if (!item['repeats']){
                item['repeats'] = 0;
            }
            item['available'] = true;
            
            self.docdatabase.addItem(item, function(err){
                if(err){
                    res.status(500).send({statusText: "Database error could not add schedule."}); //internal error
                }
                self.docdatabase.encodeauth(id, function(err, token){
                    if (err){
                        throw(err);
                    }
                    var headers = [];
                    var tokenarray = [];
                    tokenarray['token'] = token;
                    headers['auth'] = tokenarray;
                    responseHeader['headers'] = headers;
                    responseHeader['status'] = 200;
                    responseHeader['statusText'] = 'Succesfully added new schedule.';

                    console.log(responseHeader);
                    res.status(200).send(responseHeader); //not sure if this is right
                });
            });
        });
    }
};
module.exports = ScheduleManager;