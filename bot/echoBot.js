"use strict";
var builder = require("botbuilder");
var bot = new builder.UniversalBot(null, null, 'echoBot');
function attach(rootBot) {
    rootBot.library(bot.clone());
}
exports.attach = attach;
bot.dialog('echoBotDialog', [
    function (session) {
        builder.Prompts.text(session, 'Hi there.  Say something and I will echo it back.  Type "done" to exit.');
    },
    function (session, result) {
        session.send("Heard you say " + session.message.text);
        session.replaceDialog('echoBotDialog');
    }
]).triggerAction({
    matches: /^echo/i,
    onSelectAction: function (session, args, next) {
        console.log(args.action + " was selected");
        next();
    },
    onInterrupted: function (session, dialogId, dialogArgs, next) {
        var state = session.userData.listBotState;
        console.log('Switching to ' + dialogId);
        next();
    }
}).cancelAction('cancelAction', 'Okay', { matches: /^done/i });
//# sourceMappingURL=echoBot.js.map