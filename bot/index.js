"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var azure = require('azure-storage');
var useEmulator = (process.env.NODE_ENV == 'development');
var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});
var bot = new builder.UniversalBot(connector);
bot.on('trigger', function (message) {
    var queuedMessage = message.value;
    var reply = new builder.Message()
        .address(queuedMessage.address)
        .text('This is coming from the trigger: ' + queuedMessage.text);
    bot.send(reply);
});
function enqueue(qname, message, done) {
    var queueSvc = azure.createQueueService(process.env.AzureWebJobsStorage);
    queueSvc.createQueueIfNotExists(qname, function (err, result, response) {
        if (!err) {
            var queueMessageBuffer = new Buffer(JSON.stringify(message)).toString('base64');
            queueSvc.createMessage(qname, queueMessageBuffer, function (err, result, response) {
                if (!err) {
                    done(null);
                }
                else {
                    done('failed to create message');
                }
            });
        }
        else {
            done('failed to create queue');
        }
    });
}
bot.dialog('/', function (session) {
    var queuedMessage = { address: session.message.address, text: session.message.text };
    session.sendTyping();
    enqueue('bot-queue', queuedMessage, function (err) {
        if (!err) {
            session.send('Your message (\'' + session.message.text + '\') has been added to a queue, and it will be sent back to you via a Function');
        }
        else {
            session.send('There was an error inserting your message into queue');
        }
    });
});
bot.dialog('/xyzzy-original', function (session) {
    var queuedMessage = { address: session.message.address, text: session.message.text };
    session.sendTyping();
    var queueSvc = azure.createQueueService(process.env.AzureWebJobsStorage);
    queueSvc.createQueueIfNotExists('bot-queue', function (err, result, response) {
        if (!err) {
            var queueMessageBuffer = new Buffer(JSON.stringify(queuedMessage)).toString('base64');
            queueSvc.createMessage('bot-queue', queueMessageBuffer, function (err, result, response) {
                if (!err) {
                    session.send('Your message (\'' + session.message.text + '\') has been added to a queue, and it will be sent back to you via a Function');
                }
                else {
                    session.send('There was an error inserting your message into queue');
                }
            });
        }
        else {
            session.send('There was an error creating your queue');
        }
    });
});
if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function () {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
}
else {
    module.exports = { default: connector.listen() };
}
//# sourceMappingURL=index.js.map