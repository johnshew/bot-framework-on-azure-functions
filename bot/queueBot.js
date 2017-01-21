"use strict";
var builder = require("botbuilder");
var azure = require("azure-storage");
var bot = new builder.UniversalBot(null, null, 'echoBot');
function attach(rootBot) {
    rootBot.library(bot.clone());
}
exports.attach = attach;
bot.on('trigger', function (message) {
    var queuedMessage = message.value;
    var reply = new builder.Message()
        .address(queuedMessage.address)
        .text('This is coming from the trigger: ' + queuedMessage.text + ' user: ' + JSON.stringify(queuedMessage.user));
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
bot.dialog('queueBotDialog', function (session) {
    var queuedMessage = { address: session.message.address, text: session.message.text, user: session.message.user };
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
//# sourceMappingURL=queueBot.js.map