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
        var item = req.body.user;
        var token = req.header.auth.token;
        var responseHeader = {};
        
        if(!token){
            res.status(400).send({error: "Unauthorized"});
        }else{      
            self.docdatabase.checkauth(token, function(err, authentication){
                if(err){
                    res.status(400).send({error: "Unauthorized"});
                }
                var data = {};
                var querySpec = {
                    query: 'SELECT * FROM root r WHERE r.mlocation=@mlocation AND r.instruments[0].instr=@instruments.instr',
                    parameters: [{
                        name:'@mlocation',
                        value: item.mlocation
                    },{
                        name:'@instruments.instr',
                        value: item.instr
                    }]
                };

                self.docdatabase.find(querySpec, function (err, items){
                    if(err){
                        throw(err);
                    }else{
                        console.log(items);
                    }
                });
            });
        }
    }
};

module.exports = userSearchManager;
