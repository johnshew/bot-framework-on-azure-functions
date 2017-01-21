
"use strict";
import builder = require("botbuilder");
import botbuilder_azure = require("botbuilder-azure");
import azure = require("azure-storage");
import listBot = require('./listBot');
import logBot = require('./logBot');
import echoBot = require('./echoBot');


let devMode = (process.env.NODE_ENV == 'development');
let chatConnector = (process.env.ChatClient == 'on');

let connector = devMode ? chatConnector ? new builder.ChatConnector() : new builder.ConsoleConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword']
/*  stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata'] */
});

var bot = new builder.UniversalBot(connector);
logBot.create(bot);
echoBot.attach(bot);
listBot.create(bot);

bot.dialog('/', (session, args, next) => { session.send("How can I help?") });


if (devMode && chatConnector) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot available at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else if (devMode) {
    console.log("Ready on console connector.");
    connector.listen();
} else {
    module.exports = { default: connector.listen() }
}
