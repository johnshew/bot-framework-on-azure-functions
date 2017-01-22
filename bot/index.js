"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("./botServiceConnector");
var listBot = require("./listBot");
var logBot = require("./logBot");
var echoBot = require("./echoBot");
var devMode = (process.env.NODE_ENV == 'development');
var chatConnector = (process.env.ChatClient == 'on');
var connector = devMode ? chatConnector ? new builder.ChatConnector() : new builder.ConsoleConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    captureConsoleLog: true
});
var bot = new builder.UniversalBot(connector);
logBot.attach(bot);
echoBot.attach(bot);
listBot.attach(bot);
bot.dialog('/', function (session, args, next) { session.send("How can I help?"); });
if (devMode && chatConnector) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function () {
        console.log('test bot available at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
}
else if (devMode) {
    console.log("Ready on console connector.");
    connector.listen();
}
else {
    module.exports = { "default": connector.listen() };
}
//# sourceMappingURL=index.js.map