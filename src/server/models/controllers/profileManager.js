var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');
var express = require('express');

function ProfileManager(maindb, eventdb, errordb) {
    this.docdatabase = maindb;
    this.eventdatabase = eventdb;
    this.errordatabase = errordb;
}

ProfileManager.prototype = {
    
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

    throwErr: function (err) {
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
    
    addorUpdateTeacher: function (req, res) {
        var self = this;
        var item = req.body;
        //var auth = req.header;
        var token = item.auth; //temp need to change
        delete item.auth; //remove once done testing
        var id = '';
        var responseHeader = {};
        
        //check update or new user 
        if(!token){
            console.log('No authetication token recieved, new user.');
            
            //error handling for new user
            if (!item.email || !item.psw || !item.firstName || !item.lastName || !item.mlocation || !item.hrRate || !item.instrument1){
                //send back error response
                res.status(400).send({statusText: "Missing Parameters"}); //bad request
                
            }else{
                var createId = '';
                var email = item['email'];
                var psw = item['psw'];
                var instruments = [];
                
                //schema for new user
                if (item.email){
                    createId = item['email'].split('@')[0];
                    item['id'] = createId;
                    item['verify'] = false;
                }

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
                    'email': email,
                    'psw': psw
                };
                
                //need to update depending on what sophie gives me
                instruments.push({
                    'instr': item['instrument1'],
                    'cert': '',
                    'qproof': ''
                });   

                if (item.instrument2){
                    instruments.push({
                        'instr': item['instrument2'],
                        'cert': '',
                        'qproof': ''
                    });
                }

                if (item.instrument3){
                    instruments.push({
                        'instr': item['instrument3'],
                        'cert': '',
                        'qproof': ''
                    });
                }
                
                item['instruments'] = instruments;
                delete item.status;
                delete item.email;
                delete item.psw;
                delete item.instrument1;
                delete item.instrument2;
                delete item.instrument3;
                
                //add user to database
                self.docdatabase.addItem(item, function (err) {
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
                    accountinglog['accountID'] = item.id;
                    accountinglog['file'] = 'profileManager.addorUpdateTeacher';
                    accountinglog['status'] = 'New service provider';
                    
                    self.addevent(accountinglog, function(err){ //log event data
                       if (err){
                           throw(err);
                       } 
                    });
                    
                    self.docdatabase.encodeauth(createId, function(err, token){
                        if (err){
                            throw(err);
                        }else{
                            var headers = {};
                            headers['token'] = token;
                            responseHeader['headers'] = headers;
                            responseHeader['status'] = 200;
                            responseHeader['statusText'] = 'Succesfully added new teacher.';
                                
                            console.log(responseHeader);
                            res.redirect('/api'); // temp change
                        }
                    });
                });
            }      
        }else{
            self.docdatabase.decodeauth(token, function (err, items) {
                if (err){
                    throw(err);
                }    
                id = items;
            });                              
            
            id = id.substring(2);
            
            self.docdatabase.checkauth(token, function(err, authentication){
                if(err){
                    res.status(400).send({statusText: "Unauthorized"});
                } else{
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
                        } else {
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
                                }else{
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
                                        }else{
                                            var headers = {};
                                            headers['token'] = token;
                                            responseHeader['headers'] = headers;
                                            responseHeader['status'] = 200;
                                            responseHeader['statusText'] = 'Succesfully updated teacher.';

                                            console.log(responseHeader);
                                            res.redirect('/api');
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }, 
    
    addorUpdateStudent: function (req, res) {
        var self = this;
        var item = req.body;
        //var auth = req.header;
        var token = item.auth; //temp need to change
        delete item.auth; //remove once done testing
        var id = '';
        var responseHeader = {};
        
        //check update or new user 
        if(!token){
            console.log('No authetication token recieved, new user.');
            
            //error handling for new user
            if (!item.email || !item.status || !item.psw || !item.firstName || !item.lastName || !item.mlocation){
                res.status(400).send({error: "Missing Parameters"}); //bad request
            }else{
                var createId = '';
                var status = item['status'];
                var email = item['email'];
                var psw = item['psw'];
                
                //schema for new user
                if (item.email){
                    createId = item['email'].split('@')[0];
                    item['id'] = createId;
                    item['verify'] = false;
                }

                for (data in item){
                    if (item[data] != 'profImage'){
                        item['profImage'] = '';
                    }
                    if (item[data] != 'bio'){
                        item['bio'] = ''
                    }
                }
                
                item['Account'] = {
                    'status': status,
                    'email': email,
                    'psw': psw
                };
                
                delete item.status;
                delete item.email;
                delete item.psw;
                
                //add user to database
                self.docdatabase.addItem(item, function (err) {
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
                    accountinglog['accountID'] = item.id;
                    accountinglog['file'] = 'profileManager.addorUpdateStudent';
                    accountinglog['status'] = 'New service user';
                    
                    self.addevent(accountinglog, function(err){ //log event data
                       if (err){
                           throw(err);
                       } 
                    });
                    
                    self.docdatabase.encodeauth(createId, function(err, token){
                        if (err){
                            throw(err);
                        }else{
                            var headers = {};
                            headers['token'] = token;
                            responseHeader['headers'] = headers;
                            responseHeader['status'] = 200;
                            responseHeader['statusText'] = 'Succesfully added new student.';
                                
                            console.log(responseHeader);
                            res.redirect('/api'); // temp change
                        }
                    });
                });
            }      
        }else{
            self.docdatabase.decodeauth(token, function (err, items) {
                if (err){
                    throw(err);
                }    
                id = items;
            });                              
            id = id.substring(2);
            
            self.docdatabase.checkauth(token, function(err, authentication){
                if(err){
                    res.status(400).send({statusText: "Unauthorized"});
                } else{
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
                        } else {
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
                                }else{
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
                                        }else{
                                            var headers = {};
                                            headers['token'] = token;
                                            responseHeader['headers'] = headers;
                                            responseHeader['status'] = 200;
                                            responseHeader['statusText'] = 'Succesfully updated student.';

                                            console.log(responseHeader);
                                            res.redirect('/api');
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    
    getuserinfo: function(req, res){
        var self = this;
        var item = req.url; 
        var token = item.split('auth=')[1]; 
        var id = token.split('id=')[1];
        token = token.split('&')[0];
        var responseHeader = {};
        
        if (!id){
            console.log("Getting requesters user info");
            
            self.docdatabase.decodeauth(token, function (err, items) {
                if (err){
                    throw(err);
                }    
                id = items;
            });
            
            id = id.substring(2);
            
            self.docdatabase.checkauth(token, function(err, authentication){
                if(err){
                    res.status(400).send({statusText: "Unauthorized"});
                } else{
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
                        } else {
                            var accountinglog = {};
                            accountinglog['accountID'] = id;
                            accountinglog['file'] = 'profileManager.getuserinfo';
                            accountinglog['status'] = 'AccountLog database was accessed to get personal data.';

                            self.addevent(accountinglog, function(err){ //add event item
                               if (err){
                                   throw(err);
                               } 
                            });

                            responseHeader['data'] = doc;
                            self.docdatabase.encodeauth(id, function(err, token){
                                if (err){
                                    throw(err);
                                }else{
                                    var headers = {};
                                    headers['token'] = token;
                                    responseHeader['headers'] = headers;
                                    responseHeader['status'] = 200;
                                    responseHeader['statusText'] = 'Succesfully retrived data personal data.';

                                    console.log(responseHeader);
                                    res.render('index');
                                }
                            });
                        }
                    });
                }
            });
            
        }else{
            console.log("Requester getting someone else's info");
            
            var userid ='';
            self.docdatabase.decodeauth(token, function (err, items) {
                if (err){
                    throw(err);
                }    
                userid = items;
            });
            userid = userid.substring(2);
            
            self.docdatabase.checkauth(token, function(err, authentication){
                if(err){
                    res.status(400).send({statusText: "Unauthorized"});
                } else{
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
                        } else {
                            var accountinglog = {};
                            accountinglog['accountID'] = id;
                            accountinglog['file'] = 'profileManager.getuserinfo';
                            accountinglog['status'] = 'AccountLog database was accessed to get teacher data.';

                            self.addevent(accountinglog, function(err){ //add event item
                               if (err){
                                   throw(err);
                               } 
                            });

                            responseHeader['data'] = doc;
                            self.docdatabase.encodeauth(userid, function(err, token){
                                if (err){
                                    throw(err);
                                }else{
                                    var headers = {};
                                    headers['token'] = token;
                                    responseHeader['headers'] = headers;
                                    responseHeader['status'] = 200;
                                    responseHeader['statusText'] = 'Succesfully retrived data teacher data.';

                                    console.log(responseHeader);
                                    res.render('index');
                                }
                            });
                        }
                    });
                }
            });
            
        }
    },
    
    getUserInfofromLogin: function(req, res){
        var self = this;
        var item = req.url;
        var id = item.split('email=')[1];
        var psw = item.split('psw=')[1];
        id = id.split("%")[0];
        var responseHeader = {};
        
        console.log(id);
        
        if(id == "&psw="){
            res.status(400).send({error: "Invalid email"});
        }else{
            self.docdatabase.getItem(id, function(err, doc){
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
                } else {
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
                        self.docdatabase.encodeauth(id, function(err, token){
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
                        res.status(400).send({error: "Invalid password"});
                    }
                }
            });
        }
    } 
    
};

module.exports = ProfileManager;