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
    
    addReview: function(req, res){
        var self = this;
        var item = req.body;
        //var auth = req.header;
        var token = item.auth; //temp need to change
        delete item.auth; //temp delete after testing
        var responseHeader = {};
        var AccountId = '';
        
        if (!token){
            res.status(400).send({error: "Unauthorized"});
        }else{
            self.docdatabase.decodeauth(token, function(err, items){
                if (err){
                    res.status(400).send({error: "Unauthorized"});
                }else{
                    AccountId = items.substring(2);
                    self.accountdatabase.checkauth(token, function(err, authentication){
                        if(err){
                            res.status(400).send({error: "Unauthorized"});
                        } else{
                            self.accountdatabase.getItem(item.revieweeid, function(err, doc){
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
                                }else{
                                    item['firstName'] = doc.firstName;
                                    item['lastName'] = doc.lastName;
                                    item['profImage'] = doc.profImage;
                                    
                                    if (AccountId == item.reviewerid){
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
                                            }else{
                                                var accountinglog = {};
                                                accountinglog['accountID'] = item.id;
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
                                                    }else{
                                                        var headers = {};
                                                        headers['token'] = token;
                                                        responseHeader['headers'] = headers;
                                                        responseHeader['status'] = 200;
                                                        responseHeader['statusText'] = 'Succesfully added new review.';

                                                        console.log(responseHeader);
                                                        res.redirect('/api'); // temp change
                                                    }
                                                });
                                            }
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
                                }
                            });
                        }
                    });
                }
            });
        }
    }, 
    
    getoverallRating: function(req, res){
        
    },
    
    getReviews: function(req, res){
        var self = this;
        var item = req.url;
        var token = item.split('auth=')[1];
        token = token.split('&')[0];
        var reviewer = item.split('reviewer=')[1];
        reviewer = reviewer.split('&')[0];
        var reviewee = item.split('reviewee=')[1];
        reviewee = reviewee.split('&')[0];
        var responseHeader = {};
        var userid ='';
        
        if(!token){
            res.status(400).send({error: "Unauthorized"});
        }else{
            self.docdatabase.decodeauth(token, function(err, items){
                if(err){
                    throw(err);
                    return;
                }
                userid = items.substring(2);
                
                self.accountdatabase.checkauth(token, function(err, authentication){
                    if(err){
                        res.status(400).send({error: "Unauthorized"});
                    } else{
                        var data = {};

                        self.accountdatabase.getItem(userid, function(err, doc){
                           if(err){
                               throw(err);
                           } else {
                                var reviewer = [];
                               reviewer['firstName'] = doc.firstName;
                               reviewer['lastName'] = doc.lastName;
                               reviewer['id'] = userid;
                               reviewer['profImage'] = doc.profImage;

                               var querySpec = {
                                    query: 'SELECT * FROM root r WHERE r.reviewerid=@reviewerid',
                                    parameters: [{
                                        name:'@reviewerid',
                                        value: userid
                                    }]
                                };

                                self.docdatabase.find(querySpec, function (err, items){
                                    if(err){
                                        throw(err);
                                    }else{
                                        var reviewinfo = [];
                                        var reviewee = [];
                                        for (var i=0; i<5; i++){
                                            reviewinfo['dateCreated'] = items[i].dateCreated;
                                            reviewinfo['avgRating'] = items[i].avgRating;
                                            reviewinfo['review'] = items[i].review;
                                            reviewee['firstName'] = items[i].firstName;
                                            reviewee['lastName'] = items[i].lastName;
                                            reviewee['profImage'] = items[i].profImage;
                                            reviewinfo['reviewer'] = reviewer;
                                            reviewinfo['reviewee'] = reviewee;
                                            data[items[i].revieweeid] = reviewinfo;

                                            if(Object.keys(data).length ==5){
                                                if (reviewer){
                                                    responseHeader['data'] = data;
                                                    self.accountdatabase.encodeauth(userid, function(err, token){
                                                        if (err){
                                                            throw(err);
                                                        }else{
                                                            var headers = {};
                                                            headers['token'] = token;
                                                            responseHeader['headers'] = headers;
                                                            responseHeader['status'] = 200;
                                                            responseHeader['statusText'] = 'Succesfully retrived data from login info.';

                                                            //fix after intergration
                                                            console.log(responseHeader);
                                                            res.render('index');
                                                        }
                                                    });    
                                                }else{
                                                    //get average data    
                                                }
                                            }
                                            reviewinfo = [];
                                            reviewee = [];
                                        }     
                                    }
                                });
                            }
                        });                    
                    }
                });
                
            });
        }
    }
};

module.exports = MetricManager;
