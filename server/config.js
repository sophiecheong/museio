var config = {}

config.host = process.env.HOST || "https://muse.documents.azure.com:443/";
config.authKey = process.env.AUTH_KEY || "Clpm4pQJlafHuQ4klJH1uMpF2cN35eNJxNzGhVWuf6CcNR30D1NiFFACNSTN2iSco6jx2rmMktagoD5eGB9aIA==";

config.databaseId = "Muse";
config.AccountCollId = "AccountLog";
config.ScheduleCollId = "ScheduleLog";
config.MetricCollId = "Metric";
config.EventCollId = "AccountingLog";
config.ErrorCollId = "ErrorLog";

module.exports = config;