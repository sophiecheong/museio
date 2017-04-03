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
        var token = req.header;
        var responseHeader = {};
        
        if(!token){
            res.status(400).send({error: "Unauthorized"});
        }
        self.docdatabase.checkauth(token, function(err, authentication){
            if(err){
                res.status(400).send({error: "Unauthorized"});
                res.end();
                return;
            }
            var querySpec = {
                query: 'SELECT * FROM root r WHERE r.userId=@userId',
                parameters: [{
                    name:'@userId',
                    value: item.userId
                }]
            };
            self.docdatabase.find(querySpec, function (err, items){
                if(err || !items){
                    throw(err);
                }
                responseHeader['data'] = items;
                self.docdatabase.encodeauth(item.userId, function(err, token){
                    if (err){
                        throw(err);
                    }
                    responseHeader['headers'] = token;
                    responseHeader['status'] = 200;
                    responseHeader['statusText'] = 'Query finished running.';

                    console.log(responseHeader);
                    res.status(200).send(responseHeader); //not sure if this is right
                });
            });
        });
        
    }
};
module.exports = ScheduleManager;