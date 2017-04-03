var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');
var express = require('express');
var atob = require('atob');

function ProfileManager(maindb, eventdb, errordb) {
    this.docdatabase = maindb;
    this.eventdatabase = eventdb;
    this.errordatabase = errordb;
}

ProfileManager.prototype = {
    
    //database management
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
                    errorentry['Status'] = 'Could not add item to AccountingLog from the profileManager.';
                    self.adderror(errorentry, function (err) {
                       if (err){
                           callback(err);
                       } 
                    });
                } 
            });
        }
    },
    
    //database management
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
    
    addorUpdateTeacher: function (req, res) {
        var self = this;
        var item = req.body.user;
        var token = req.header.auth.token;
        var responseHeader = {};
        var id ='';
        
        //check update or new user 
        if(!token){ //if no token is given
            console.log('No authetication token recieved, new user.');
            
            //error handling for new user
            if (!item.email || !item.psw || !item.firstName || !item.lastName || !item.mlocation || !item.hrRate || !item.instruments){
                //send back error response
                res.status(400).send({statusText: "Missing Parameters"}); //bad request
                
            }            
            item['verify'] = false;
            for (data in item){
                if (item[data] != 'profImage'){
                    item['profImage'] = '';
                }
                if (item[data] != 'bio'){
                    item['bio'] = ''
                }
            }
            
            item['Account'] = {
                'status': 1,
                'email': item['email'],
                'psw': item['psw']
            };
            
            item['instruments'] = item.instruments;
            delete item.status;
            delete item.email;
            delete item.psw;

            //add user to database
            self.docdatabase.addItem(item, function (err, doc) {
                if (err) {
                    res.status(500).send({statusText: "Database error could not add new user."}); //internal error

                    var errorentry = {}; //schema for errorlog
                    errorentry['file'] = "profileManager.addorUpdateTeacher";
                    errorentry['Status'] = 'Could not add item to AccountLog from the profileManager.';

                    self.adderror(errorentry, function(err){ //log in error database
                       if (err){
                           callback(err);
                       } 
                    });
                }

                var accountinglog = {};
                accountinglog['accountId'] = doc.id;
                accountinglog['file'] = 'profileManager.addorUpdateTeacher';
                accountinglog['status'] = 'New service provider';

                self.addevent(accountinglog, function(err){ //log event data
                   if (err){
                       throw(err);
                   } 
                });

                self.docdatabase.encodeauth(doc.id, function(err, token){
                    if (err){
                        throw(err);
                    }
                    var headers = [];
                    var tokenarray = [];
                    tokenarray['token'] = token;
                    headers['auth'] = tokenarray;
                    responseHeader['headers'] = headers;
                    responseHeader['status'] = 200;
                    responseHeader['statusText'] = 'Succesfully added new teacher.';

                    console.log(responseHeader);
                    res.status(200).send(responseHeader); //not sure if this is right
                });
            });
        }else{          
            id = item.userId; //check if this is what you give me
            self.docdatabase.checkauth(token, function(err, authentication){
                if(err){
                    res.status(400).send({statusText: "Unauthorized"});
                }
                self.docdatabase.getItem(id, function(err, doc){
                    if (err) {
                        res.status(400).send({statusText: "Could not retrive user data."}); //internal error

                        var errorentry = {}; //schema for errorlog
                        errorentry['file'] = "profileManager.addorUpdateTeacher";
                        errorentry['Status'] = 'Could not retrive user data from AccountLog using the profileManager.';

                        self.adderror(errorentry, function(err){ //log in error database
                           if (err){
                               callback(err);
                           } 
                        });
                    } 
                    if (item.mlocation){
                        doc.mlocation = item.mlocation;
                    }else if (item.hrRate){
                        doc.hrRate = item.hrRate;
                    }else if (item.profImage){
                        doc.profImage = item.profImage;
                    }else if (item.bio){
                        doc.bio = item.bio;
                    }else if (item.instruments){
                        doc.instruments = item.instruments;
                    }
                    self.docdatabase.UpdateItem(id, doc, function(err){
                        if(err) {
                            res.status(500).send({statusText: "Database error could not update user."}); //internal error

                            var errorentry = {}; //schema for errorlog
                            errorentry['file'] = "profileManager.addorUpdateTeacher";
                            errorentry['Status'] = 'Could not update AccountLog from the profileManager.';

                            self.adderror(errorentry, function(err){ //log in error database
                               if (err){
                                   callback(err);
                               } 
                            });
                        }
                        var accountinglog = {};
                        accountinglog['accountID'] = id;
                        accountinglog['file'] = 'profileManager.addorUpdateTeacher';
                        accountinglog['status'] = 'Update service provider';

                        self.addevent(accountinglog, function(err){ //add event item
                           if (err){
                               throw(err);
                           } 
                        });

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
                            responseHeader['statusText'] = 'Succesfully updated teacher.';

                            console.log(responseHeader);
                            res.status(200).send(responseHeader); //not sure if this is right
                        });
                    });
                });
            });
        }
    }, 
    
    addorUpdateStudent: function (req, res) {
        var self = this;
        var item = req.body.user;
        var token = req.header.auth.token;
        var id = '';
        var responseHeader = {};
        
        //check update or new user 
        if(!token){
            console.log('No authetication token recieved, new user.');
            
            //error handling for new user
            if (!item.email || !item.psw || !item.firstName || !item.lastName || !item.mlocation){
                res.status(400).send({error: "Missing Parameters"}); //bad request
            }
            item['verify'] = false;
            for (data in item){
                if (item[data] != 'profImage'){
                    item['profImage'] = '';
                }
                if (item[data] != 'bio'){
                    item['bio'] = ''
                }
            }

            item['Account'] = {
                'status': 2,
                'email': item['email'],
                'psw': item['psw']
            };

            delete item.status;
            delete item.email;
            delete item.psw;

            //add user to database
            self.docdatabase.addItem(item, function (err, doc) {
                if (err) {
                    res.status(500).send({statusText: "Database error could not add new user."}); //internal error

                    var errorentry = {}; //schema for errorlog
                    errorentry['file'] = "profileManager.addorUpdateStudent";
                    errorentry['Status'] = 'Could not add item to AccountLog from the profileManager.';

                    self.adderror(errorentry, function(err){ //log in error database
                       if (err){
                           callback(err);
                       } 
                    });
                } 

                var accountinglog = {};
                accountinglog['accountID'] = id;
                accountinglog['file'] = 'profileManager.addorUpdateStudent';
                accountinglog['status'] = 'New service user';

                self.addevent(accountinglog, function(err){ //log event data
                   if (err){
                       throw(err);
                   } 
                });

                self.docdatabase.encodeauth(doc.id, function(err, token){
                    if (err){
                        throw(err);
                    }
                    var headers = [];
                    var tokenarray = [];
                    tokenarray['token'] = token;
                    headers['auth'] = tokenarray;
                    responseHeader['headers'] = headers;
                    responseHeader['status'] = 200;
                    responseHeader['statusText'] = 'Succesfully added new student.';

                    console.log(responseHeader);
                    res.status(200).send(responseHeader); //not sure if this is right
                });
            });     
        }else{        
            id = item.userId; //check if this is what you give me
            
            self.docdatabase.checkauth(token, function(err, authentication){
                if(err){
                    res.status(400).send({statusText: "Unauthorized"});
                } 
                self.docdatabase.getItem(id, function(err, doc){
                    if (err) {
                        res.status(400).send({statusText: "Could not retrive user data."}); //internal error

                        var errorentry = {}; //schema for errorlog
                        errorentry['file'] = "profileManager.addorUpdateStudent";
                        errorentry['Status'] = 'Could not retrive user data from AccountLog using the profileManager.';

                        self.adderror(errorentry, function(err){ //log in error database
                           if (err){
                               callback(err);
                           } 
                        });
                    } 
                    if (item.mlocation){
                        doc.mlocation = item.mlocation;
                    }else if (item.profImage){
                        doc.profImage = item.profImage;
                    }else if (item.bio){
                        doc.bio = item.bio;
                    }
                    self.docdatabase.UpdateItem(id, doc, function(err){
                        if(err) {
                             res.status(500).send({statusText: "Database error could not update user."}); //internal error

                            var errorentry = {}; //schema for errorlog
                            errorentry['file'] = "profileManager.addorUpdateStudent";
                            errorentry['Status'] = 'Could not update AccountLog from the profileManager.';

                            self.adderror(errorentry, function(err){ //log in error database
                               if (err){
                                   callback(err);
                               } 
                            });
                        }
                        var accountinglog = {};
                        accountinglog['accountID'] = id;
                        accountinglog['file'] = 'profileManager.addorUpdateStudent';
                        accountinglog['status'] = 'Update user';

                        self.addevent(accountinglog, function(err){ //add event item
                           if (err){
                               throw(err);
                           } 
                        });

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
                            responseHeader['statusText'] = 'Succesfully updated student.';

                            console.log(responseHeader);
                            res.status(200).send(responseHeader); //not sure if this is right
                        });
                    });
                });
            });
        }
    },
    
    getuserinfo: function(req, res){
        var self = this;
        var item = req.query;
        var token = req.header.auth.token;
        var id = item.userId;
        var responseHeader = {};

        self.docdatabase.checkauth(token, function(err, authentication){
            if(err){
                res.status(400).send({statusText: "Unauthorized"});
            }
            self.docdatabase.getItem(id, function(err, doc){
                if (err) {
                    res.status(400).send({statusText: "Could not retrive user data."}); //internal error

                    var errorentry = {}; //schema for errorlog
                    errorentry['file'] = "profileManager.getuserinfo";
                    errorentry['Status'] = 'Could not retrive user data from AccountLog using the profileManager.';

                    self.adderror(errorentry, function(err){ //log in error database
                       if (err){
                           callback(err);
                       } 
                    });
                } 
                var accountinglog = {};
                accountinglog['accountID'] = id;
                accountinglog['file'] = 'profileManager.getuserinfo';
                accountinglog['status'] = 'AccountLog database was accessed to get data.';

                self.addevent(accountinglog, function(err){ //add event item
                   if (err){
                       throw(err);
                   } 
                });

                responseHeader['data'] = doc;
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
                    responseHeader['statusText'] = 'Succesfully retrived data.';

                    console.log(responseHeader);
                    res.status(200).send(responseHeader); //not sure if this is right
                });
            });
        });
            
    },
    
    getUserInfofromLogin: function(req, res){
        var self = this;
        var item = req.query;
        var token = req.header.auth.token;
        var email = item.email;
        email = atob(id);
        var psw = item.psw;
        psw = atob(psw);
        var responseHeader = {};
        
        if(!email || !psw){
            res.status(400).send({error: "Invalid email"});
        }else{
            self.docdatabase.getLogin(email, function(err, doc){
                if (err) {
                    res.status(400).send({statusText: "Could not retrive user data from login info."}); //internal error
                        
                    var errorentry = {}; //schema for errorlog
                    errorentry['file'] = "profileManager.getUserInfofromLogin";
                    errorentry['Status'] = 'Could not retrive user data from AccountLog using the profileManager.';

                    self.adderror(errorentry, function(err){ //log in error database
                       if (err){
                           callback(err);
                       } 
                    });
                } 
                //check psw
                if (psw == doc.Account.psw){
                    var accountinglog = {};
                    accountinglog['accountID'] = id;
                    accountinglog['file'] = 'profileManager.getUserInfofromLogin';
                    accountinglog['status'] = 'AccountLog database was accessed to get personal info.';

                    self.addevent(accountinglog, function(err){ //add event item
                       if (err){
                           throw(err);
                       } 
                    });

                    responseHeader['data'] = doc;
                    self.docdatabase.encodeauth(doc.id, function(err, token){
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
                }else{
                    res.status(400).send({error: "Invalid password"});
                }
            });
        }
    } 
    
};

module.exports = ProfileManager;