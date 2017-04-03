var DocumentDBClient = require('documentdb').DocumentClient;
var docdbUtils = require('./docdbUtils');
var atob = require('atob');
var btoa = require('btoa');
var moment = require('moment');
moment().format();

function DataAccess(documentDBClient, databaseId, collectionId) {
    this.client = documentDBClient;
    this.databaseId = databaseId;
    this.collectionId = collectionId;

    this.database = null;
    this.collection = null;
}

module.exports = DataAccess;

DataAccess.prototype = {
    init: function (callback) {
        var self = this;
        
        docdbUtils.getOrCreateDatabase(self.client, self.databaseId, function (err, db) {
            if (err) {
                callback(err);
            } else {
                self.database = db;
                docdbUtils.getOrCreateCollection(self.client, self.database._self, self.collectionId, function (err, coll) {
                    if (err) {
                        callback(err);

                    } else {
                        self.collection = coll;
                    }
                });
            }
        });
    },
    
    find: function (querySpec, callback) {
        var self = this;

        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);

            } else {
                callback(null, results);
            }
        });
    },
    
    //test this later
    read: function (itemId, callback) {
        var self = this;
        
        self.getItem(itemId, function (err, doc) {
            if (err) {
                callback(err);

            } else {
                if (doc.length == 0){
                    callback("No documetns found matching");
                }else{
                    self.client.readDocument(doc._self, function(err, doc){
                        if(err){
                            callback(err);
                        } else {
                            callback(null, doc);
                        }    
                    });    
                }
            }
        });
    },
    
    addItem: function (item, callback) {
        var self = this;
        
        item.dateCreated = Date.now();
        item.dateUpdated = Date.now();
        
        self.client.createDocument(self.collection._self, item, function (err, doc) {
            if (err) {
                callback(err);
            } else {
                callback(null, doc);
            }
        });
    },    
    
    getItem: function (itemId, callback) {
        var self = this;

        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.id = @id',
            parameters: [{
                name: '@id',
                value: itemId
            }]
        };

        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results[0]);
            }
        });
    },
    
    getLogin: function (itemId, callback) {
        var self = this;

        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.Account.email = @id',
            parameters: [{
                name: '@id',
                value: itemId
            }]
        };

        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results[0]);
            }
        });
    },
    
    //1. get item needing updating doc
    //2. update doc
    //3. replace doc
    UpdateItem: function (itemId, update, callback){
        var self = this;
        
        self.getItem(itemId, function (err, doc) {
            if (err) {
                callback(err);

            } else {
                if (doc.length == 0){
                    callback("No documetns found matching");
                }else{
                    update.dateUpdated = Date.now();
                    self.client.replaceDocument(doc._self, update, function (err, replaced) {
                        if (err) {
                            callback(err);

                        } else {
                            callback(null, replaced);
                        }
                    });    
                }
            }
        });
    },
    
    deleteItem: function (itemId, callback){
        var self = this;
        
        self.getItem(itemId, function (err, doc) {
            if (err) {
                callback(err);

            } else {
                if (doc.length == 0){
                    callback("No documetns found matching");
                }else{
                    self.client.deleteDocument(doc._self, function(err){
                        if(err){
                            callback(err);
                        } else {
                            callback(null, 'Document deleted');
                        }    
                    });
                }
            }
        });
    },
    
    //recieve the token string
    //send back decrypted token if auth key is valid
    decodeauth: function (authtoken, callback) {
        var self = this;
        var token = authtoken;
        
        if (!token){
            callback("Unauthorized");
        } else {
            var decode = atob(token);
            var token = decode.split('&')[0];
            var expire = decode.split('&')[1];
            
            if (!expire){
                callback("Unauthorized");
            }else{
                //all date are in utc standard
                var today = new Date();
                var two_hours = 60*60*1000*2;
                //covert from epoch to date
                var d = new Date(0);
                d.setUTCSeconds(expire);
                
                if((today-d)<two_hours){
                    callback(null, token);
                }else{
                    callback("Inauthorized")
                }
            }
        }
    }, 
    
    //test function needed
    checkauth: function (authtoken, callback) {
        var self = this;
        var token = authtoken;
        
        self.decodeauth(token, function (err, tokenid){
            if (err) {
                callback(err);

            } else {
                var id = tokenid.substring(2);
                self.getItem(id, function(err, doc){
                    if (err) {
                        callback(err);
                    } else {
                        if (doc.length == 0){
                            callback("Unauthorized");
                        } else{
                            callback(null, "authorized");
                        }   
                    }
                });
            }
        });
    }, 
    
    //need to test function
    encodeauth: function (itemId, callback) {
        var self = this;
        
        self.getItem(itemId, function(err, doc){
            if (err) {
                callback(err);
            } else{
                if (!doc){
                    callback("No documetns found matching");
                } else{
                    var status = doc.Account.status;
                    var token = '0'+status+doc.id;
                    var today = new Date();
                    var expire = moment(today).unix();
                    var randomkey = "syde322project";
                    var auth = token+"&"+expire+"&"+randomkey;
                    auth = btoa(auth);
                    callback(null, auth);  
                }
            }    
        });    
    }
};