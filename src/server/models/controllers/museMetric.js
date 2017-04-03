var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');
const express = require('express');

function MetricManager(maindb, accountdb, eventdb, errordb) {
    this.docdatabase = maindb;
    this.accountdatabase = accountdb;
    this.eventdatabase = eventdb;
    this.errordatabase = errordb;
}

MetricManager.prototype = {
    
    //add item to the accountinglog database
    addevent: function (req, callback) {
        var self = this;
        var item = req;
        
        if (!item.accountID || !item.file || !item.status) { //required parameters to log data
            callback.status(500).send({error: "Missing parameters to complete Eventlog entry."});
        } else {
            self.eventdatabase.addItem(item, function (err) {
                if (err) { //incase of internal error log it in the error database
                    var errorentry = {};
                    errorentry['file'] = item.file;
                    errorentry['Status'] = 'Could not add item to AccountingLog from the museMetric.';
                    self.adderror(errorentry, function (err) {
                       if (err){
                           callback(err);
                       } 
                    });
                } 
            });
        }
    },
    
    //add item to error databse
    adderror: function (req, callback) {
        var self = this;
        var item = req;
        
        self.errordatabase.addItem(item, function (err){
           if (err){
               throw(err);
           } 
        });
    },
    
    //post
    addReview: function(req, res){
        var self = this;
        var item = req.body;
        var token = req.header.auth.token;
        var responseHeader = {};
        var reviewee = {};
        var reviewer = {};
        
        if (!token){
            res.status(400).send({error: "Unauthorized"});
        }
        self.docdatabase.decodeauth(token, function(err, items){
            if (err){
                res.status(400).send({error: "Unauthorized"});
            }
            var AccountId = items.substring(2);
            self.accountdatabase.checkauth(token, function(err, authentication){
                if(err){
                    res.status(400).send({error: "Unauthorized"});
                } 
                self.accountdatabase.getItem(item.revieweeId, function(err, doc){
                    if(err){
                        res.status(500).send({statusText: "Database error could not get teacher data."}); //internal error

                        var errorentry = {}; //schema for errorlog
                        errorentry['file'] = "museMetric.addReview";
                        errorentry['Status'] = 'Could not get item from the accountLog.';

                        self.adderror(errorentry, function(err){ //log in error database
                           if (err){
                               callback(err);
                           } 
                        });
                    }
                    
                    reviewee['firstName'] = doc.firstName;
                    reviewee['lastName'] = doc.lastName;
                    reviewee['profImage'] = doc.profImage;
                    
                    item['reviewee'] = reviewee;
                    
                    self.accountdatabase.getItem(item.reviewerId, function(err, doc){
                        if(err){
                            res.status(500).send({statusText: "Database error could not get student data."}); //internal error

                            var errorentry = {}; //schema for errorlog
                            errorentry['file'] = "museMetric.addReview";
                            errorentry['Status'] = 'Could not get item from the accountLog.';

                            self.adderror(errorentry, function(err){ //log in error database
                               if (err){
                                   callback(err);
                               } 
                            });
                        }

                        reviewer['firstName'] = doc.firstName;
                        reviewer['lastName'] = doc.lastName;
                        reviewer['profImage'] = doc.profImage;

                        item['reviewer'] = reviewer;
                
                   
                        if (AccountId == item.reviewerId){
                            self.docdatabase.addItem(item, function(err){
                                if(err){
                                    res.status(500).send({statusText: "Database error could not add new review."}); //internal error

                                    var errorentry = {}; //schema for errorlog
                                    errorentry['file'] = "museMetric.addReview";
                                    errorentry['Status'] = 'Could not add item to metric from the museMetric.';

                                    self.adderror(errorentry, function(err){ //log in error database
                                       if (err){
                                           callback(err);
                                       } 
                                    });
                                }
                                var accountinglog = {};
                                accountinglog['accountID'] = AccountId;
                                accountinglog['file'] = 'museMetric.addReview';
                                accountinglog['status'] = 'New review added';

                                self.addevent(accountinglog, function(err){ //log event data
                                   if (err){
                                       throw(err);
                                   } 
                                });

                                self.accountdatabase.encodeauth(AccountId, function(err, token){
                                    if(err){
                                        throw(err);
                                    }
                                    var headers = [];
                                    var tokenarray = [];
                                    tokenarray['token'] = token;
                                    headers['auth'] = tokenarray;
                                    responseHeader['headers'] = headers;
                                    responseHeader['status'] = 200;
                                    responseHeader['statusText'] = 'Succesfully added new review.';

                                    console.log(responseHeader);
                                    res.status(200).send(responseHeader); //not sure if this is right
                                });

                            });
                        }else{
                            res.status(400).send({error: "Reviewer id does not match authentical id."});

                            var errorentry = {}; //schema for errorlog
                            errorentry['file'] = "museMetric.addReview";
                            errorentry['Status'] = 'Reviewer id does not match authentical id.';

                            self.adderror(errorentry, function(err){ //log in error database
                               if (err){
                                   callback(err);
                               } 
                            });
                        }
                    });
                });
            });
        });
    }, 
    
    getoverallRating: function(id){
         var querySpec = {
            query: 'SELECT * FROM root r WHERE r.revieweeId=@revieweeId',
            parameters: [{
                name:'@revieweeId',
                value: id
            }]
        };
         self.docdatabase.find(querySpec, function (err, items){
            if(err){
                throw(err);
            }
            var size = Object.keys(items).length;
             var count = 0;
             for (var i=0; i<size; i++){
                count = count + items[i].avgRating;
             }
             var avg = count/size;
             return avg; 
         });
    },
    
    //get 
    getReviews: function(req, res){
        var self = this;
        var item = req.query;
        var token = req.header.auth.token;
        var reviewerId = item.reviewerId;
        var revieweeId = item.revieweeId;
        var responseHeader = {};
        var userid = '';
        
        if(!token){
            res.status(400).send({error: "Unauthorized"});
        }
        if (reviewerId){
            self.accountdatabase.checkauth(token, function(err, authentication){
                if(err){
                    res.status(400).send({error: "Unauthorized"});
                }
                var data = [];

                var querySpec = {
                    query: 'SELECT * FROM root r WHERE r.reviewerId=@reviewerId',
                    parameters: [{
                        name:'@reviewerId',
                        value: reviewerId
                    }]
                };

                self.docdatabase.find(querySpec, function (err, items){
                    if(err){
                        throw(err);
                    }
                    var size = Object.keys(items).length;
                    if (size>5){
                        size =5;
                    }
                    for (var i=0; i<size; i++){
                        data[i] = items[i];
                    }
                    responseHeader['data'] = data;
                    self.accountdatabase.encodeauth(userid, function(err, token){
                        if (err){
                            throw(err);
                        }
                        var headers = [];
                        var tokenarray = [];
                        tokenarray['token'] = token;
                        headers['auth'] = tokenarray;
                        responseHeader['headers'] = headers;
                        responseHeader['status'] = 200;
                        responseHeader['statusText'] = 'Succesfully retrived data from login info.';

                        //fix after intergration
                        console.log(responseHeader);
                        res.status(200).send(responseHeader); //not sure if this is right
                    });        
                });                   
            });    
        } else if (revieweeId){
            self.accountdatabase.checkauth(token, function(err, authentication){
                if(err){
                    res.status(400).send({error: "Unauthorized"});
                }
                var data = [];

                self.accountdatabase.getItem(revieweeId, function(err, doc){
                   if(err){
                       throw(err);
                   }
                   var querySpec = {
                        query: 'SELECT * FROM root r WHERE r.revieweeId=@revieweeId',
                        parameters: [{
                            name:'@revieweeId',
                            value: revieweeId
                        }]
                    };

                    self.docdatabase.find(querySpec, function (err, items){
                        if(err){
                            throw(err);
                        }
                        var size = Object.keys(items).length;
                        if (size>5){
                            size =5;
                        }
                        for (var i=0; i<size; i++){
                            data[i] = items[i];
                        }
                        var avg = self.getoverallRating(revieweeId);
                        data['avgRating'] = avg;

                        responseHeader['data'] = data;
                        self.accountdatabase.encodeauth(userid, function(err, token){
                            if (err){
                                throw(err);
                            }
                            var headers = [];
                            var tokenarray = [];
                            tokenarray['token'] = token;
                            headers['auth'] = tokenarray;
                            responseHeader['headers'] = headers;
                            responseHeader['status'] = 200;
                            responseHeader['statusText'] = 'Succesfully retrived data from login info.';

                            //fix after intergration
                            console.log(responseHeader);
                            res.status(200).send(responseHeader); //not sure if this is right
                        });         
                    });
                });                    
            });    
        }
    }
};

module.exports = MetricManager;
