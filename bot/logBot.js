"use strict";
function create(bot) {
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
}
exports.create = create;
//# sourceMappingURL=logBot.js.map