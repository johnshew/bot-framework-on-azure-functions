"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var listBot = require("./listBot");
var devMode = (process.env.NODE_ENV == 'development');
var chatConnector = (process.env.ChatClient == 'on');
var connector = devMode ? chatConnector ? new builder.ChatConnector() : new builder.ConsoleConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword']
});
var bot = new builder.UniversalBot(connector);
bot.dialog('/', function (session, args, next) { session.beginDialog('listBotDialog'); });
listBot.create(bot);
bot.use({
    botbuilder: function (session, next) {
        if (/^logging on/i.test(session.message.text)) {
            session.userData.isLogging = true;
            session.send('Logging is now turned on');
        }
        else if (/^logging off/i.test(session.message.text)) {
            session.userData.isLogging = false;
            session.send('Logging is now turned off');
        }
        else if (/^stack on/i.test(session.message.text)) {
            session.userData.showStack = true;
            session.send('Logging dialog stack on');
        }
        else if (/^stack off/i.test(session.message.text)) {
            session.userData.showStack = false;
            session.send('Logging dialog stack off');
        }
        else if (/^state on/i.test(session.message.text)) {
            session.userData.showState = true;
            session.send('Logging dialog state on');
        }
        else if (/^state off/i.test(session.message.text)) {
            session.userData.showState = false;
            session.send('Logging dialog state off');
        }
        else {
            if (session.userData.isLogging) {
                console.log('Message Received: ', session.message.text);
                if (session.userData.showStack)
                    console.log(session.dialogStack);
                if (session.userData.showState)
                    console.log(session.sessionState.callstack[session.sessionState.callstack.length - 1].state);
            }
            next();
        }
    }
});
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