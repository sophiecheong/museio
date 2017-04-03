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
        
    }
    
};
module.exports = ScheduleManager;