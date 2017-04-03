var DocumentDBClient = require('documentdb').DocumentClient;
var config = require('./config');
var profileManager = require('./models/controllers/profileManager');
var metricManager = require('./models/controllers/museMetric');
var searchManager = require('./models/controllers/userSearchManager');
var scheduleManager = require('./models/controllers/schedyleManager');
var AccessManager = require('./models/DataAccessLayer');

const express = require('express');
const MuseServer = express.Router();
const path = require('path');

//Muse server setting up access to database
var docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});

//set up controllers
var profileController = new AccessManager(docDbClient, config.databaseId, config.AccountCollId);
var metricController = new AccessManager(docDbClient, config.databaseId, config.MetricCollId);
var scheduleController = new AccessManager(docDbClient, config.databaseId, config.ScheduleCollId);

default databases that store all actions
var eventlog = new AccessManager(docDbClient, config.databaseId, config.EventCollId);
var errorlog = new AccessManager(docDbClient, config.databaseId, config.ErrorCollId);

//initiliza all databases
profileController.init();
metricController.init();
scheduleController.init();
eventlog.init();
errorlog.init();

set up profile manager controller
var profileman = new profileManager(profileController, eventlog, errorlog);
var metricman = new metricManager(metricController, profileController, eventlog, errorlog);
var userman = new searchManager(profileController, eventlog, errorlog);
var scheduleman = new scheduleManager(scheduleController, eventlog, errorlog);


//profile manager
MuseServer.post('/user1', profileman.addorUpdateTeacher.bind(profileman));
MuseServer.post('/user0', profileman.addorUpdateStudent.bind(profileman));
MuseServer.get('/user', profileman.getuserinfo.bind(profileman));
MuseServer.get('/login', profileman.getUserInfofromLogin.bind(profileman));

MuseServer.post('/metric', metricman.addReview.bind(metricman));
MuseServer.get('/metric', metricman.getReviews.bind(metricman));
MuseServer.get('/search', userman.searchdatabase.bind(userman));

MuseServer.post('/schedule', scheduleman.addSchedule.bind(scheduleman));
MuseServer.get('/schedule', scheduleman.getSchedules.bind(scheduleman));

MuseServer.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = MuseServer;