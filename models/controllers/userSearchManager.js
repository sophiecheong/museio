var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');
const express = require('express');

function userSearchManager(maindb, eventdb, errordb) {
    this.docdatabase = maindb;
    this.eventdatabase = eventdb;
    this.errordatabase = errordb;
}

userSearchManager.prototype = {
    
    //search by location and instrument
    searchdatabase: function (res, req){
        var self = this;
        var item = req.url;
        var token = item.split('auth=')[1];
        token = token.split('&')[0];
        var location = item.split('location=')[1];
        location = location.split('&')[0];
        var instrument = item.split('instrument=')[1];
        instrument = instrument.split('&')[0];
        var responseHeader = {};
        
        if(!token){
            res.status(400).send({error: "Unauthorized"});
        }else{
            self.docdatabase.decodeauth(token, function(err, items){
                if(err){
                    throw(err);
                }else{
                    userid = items.substring(2);
                    
                    self.docdatabase.checkauth(token, function(err, authentication){
                        if(err){
                            res.status(400).send({error: "Unauthorized"});
                        } else{
                            var data = {};
                            
                            var querySpec = {
                                query: 'SELECT * FROM root r WHERE r.mlocation=@mlocation, r.instruments.instr=@instruments.instr',
                                parameters: [{
                                    name:'@mlocation',
                                    value: location
                                },{
                                    name:'@instruments.instr',
                                    value: instrument
                                }]
                            };
                            
                            self.docdatabase.find(querySpec, function (err, items){
                                if(err){
                                    throw(err);
                                }else{
                                    console.log(items);
                                }
                            });
                        }
                    });
                }
            });
        }
    }
};

module.exports = userSearchManager;