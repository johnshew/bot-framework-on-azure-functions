
"use strict";
import builder = require("botbuilder");
import botbuilder_azure = require("botbuilder-azure");
import azure = require("azure-storage");

var bot = new builder.UniversalBot(null, null, 'echoBot');

export function attach(rootBot: builder.UniversalBot) {
    rootBot.library(bot.clone());
}


// Intercept trigger event (ActivityTypes.Trigger)
bot.on('trigger', function (message) {
    // handle message from trigger function
    var queuedMessage = message.value;

    var reply = new builder.Message()
        .address(queuedMessage.address)
        .text('This is coming from the trigger: ' + queuedMessage.text + ' user: ' + JSON.stringify(queuedMessage.user));
    bot.send(reply);
});


function enqueue(qname: string, message: any, done: (err: string) => void) {
    var queueSvc = azure.createQueueService(process.env.AzureWebJobsStorage);
    queueSvc.createQueueIfNotExists(qname, function (err, result, response) {
        if (!err) {
            // Add the message to the queue
            var queueMessageBuffer = new Buffer(JSON.stringify(message)).toString('base64');
            queueSvc.createMessage(qname, queueMessageBuffer, function (err, result, response) {
                if (!err) {
                    // Message inserted
                    done(null);
                } else {
                    // this should be a log for the dev, not a message to the user
                    done('failed to create message');
                }
            });
        } else {
            done('failed to create queue');
        }
    });
}


// Handle message from user
bot.dialog('queueBotDialog', function (session) {
    var queuedMessage = { address: session.message.address, text: session.message.text, user: session.message.user };
    // add message to queue
    session.sendTyping();
    enqueue('bot-queue', queuedMessage, (err: string) => {
        if (!err) {
            session.send('Your message (\'' + session.message.text + '\') has been added to a queue, and it will be sent back to you via a Function');
        } else {
            session.send('There was an error inserting your message into queue');
        }
    });
})
