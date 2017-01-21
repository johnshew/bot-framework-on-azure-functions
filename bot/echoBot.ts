
"use strict";
import builder = require("botbuilder");
import botbuilder_azure = require("botbuilder-azure");
import azure = require("azure-storage");

export function create(bot: builder.UniversalBot) {

    bot.dialog('echoBotDialog', [
        (session) => {
            builder.Prompts.text(session, 'Hi there.  Say something and I will echo it back.  Type "done" to exit.');
        },
        (session, result) => {
            session.send("Heard you say " + session.message.text);
            session.replaceDialog('echoBotDialog');
        }
    ])
        .triggerAction({
            matches: /^echo/i,
            onSelectAction: (session, args, next) => {
                console.log(args.action + " was selected");
                next();
            },
            onInterrupted: (session, dialogId, dialogArgs, next) => {
                // Save off any existing state
                var state = session.userData.listBotState;
                console.log('Switching to ' + dialogId)
                next();
            }
        })
        .cancelAction('cancelAction', 'Okay', { matches: /^done/i })

}

