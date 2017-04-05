var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');
const express = require('express');

function userSearchManager(maindb, eventdb, errordb) {
    this.docdatabase = maindb;
    this.eventdatabase = eventdb;
    this.errordatabase = errordb;
}

userSearchManager.prototype = {
    
    //README for this api call to work you need to send the following:
    //req.query{'userId', "useridstring", 'mlocation':'location', 'instrument':'instrumnetnameinlowercase'}    
    //search by location and instrument
    searchdatabase: function (req, res) {
        var self = this;
        var item = req.query;
        var token = req.headers.auth;
        var responseHeader = {};
        
        if(!token){
            res.status(400).send({error: "Unauthorized"}).end();
            return;
        }     
        console.log(item);
        self.docdatabase.checkauth(token, function(err, authentication){
            if(err){
                res.status(400).send({error: "Unauthorized"}).end();
                return;
            };

            var data = [];
            var querySpec = {
                query: 'SELECT * FROM root r WHERE r.mlocation=@location',
                parameters: [{
                    name:'@location',
                    value: item.mlocation
                }]
            };

            self.docdatabase.find(querySpec, function (err, docs){
                if(err){
                    throw(err);
                }
                var size = Object.keys(docs).length;
                var count = 0;
                for (var i =0; i<size; i++){
                    if(docs[i].Account.status == 1){
                        for (var k=0; k<3; k++){
                            if(docs[i].instruments[k] && docs[i].instruments[k].instr == item.instrument){
                                delete docs[i].Account;
                                delete docs[i].verify;
                                delete docs[i].dateCreated;
                                delete docs[i].dateUpdated;
                                data[count] = docs[i];
                                count++;
                            }
                        }
                    }
                }

                //console.log("docs", docs);

                self.docdatabase.decodeauth(token, function(err, items){
                    if (err || !items){
                        res.status(400).send({error: "Unauthorized"}).end();
                        return;
                    }
                
                    var id = items.substring(2);
                    self.docdatabase.encodeauth(id, function(err, token){
                       if(err){
                           throw(err);
                           return;
                       } 
                        var headers = {};
                        headers['token'] = token;
                        responseHeader['data'] = data;
                        responseHeader['headers'] = headers;
                        responseHeader['status'] = 200;
                        responseHeader['statusText'] = 'Query completed';
                        
                        console.log(responseHeader);
                        res.status(200).send(responseHeader);
                    });
                });
            });
        });
    }
};

module.exports = userSearchManager;