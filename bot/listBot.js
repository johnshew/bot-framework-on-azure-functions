"use strict";
var builder = require("botbuilder");
function create(bot) {
    bot.dialog('listBotDialog', function (session) {
        session.send('Welcome.  You can say make list, edit list, show list, or delete list');
    })
        .beginDialogAction('editListAction', 'editListDialog', { matches: /^make\s?list|edit\s?list/i })
        .beginDialogAction('showListAction', 'showListDialog', { matches: /^show\s?list/i })
        .beginDialogAction('deleteListAction', 'deleteListDialog', { matches: /^delete\s?list/i });
    bot.dialog('editListDialog', function (session, results, next) {
        console.log('in editListDialog');
        if (!session.userData.list) {
            session.userData.list = [];
        }
        session.send('Type in items to add to list.  Type "end list" or "done" to finish');
        session.beginDialog('enterDataDialog');
    });
    bot.dialog('enterDataDialog', function (session, args, next) {
        if (session.dialogData && session.dialogData.started) {
            session.userData.list.push(session.message.text);
            session.save();
            console.log('enterDataDialog added data. Now ' + JSON.stringify(session.userData.list));
        }
        else {
            session.dialogData.started = true;
            console.log('enterDataDialog first run');
        }
    }).cancelAction('cancelList', "List canceled", {
        matches: /^cancel|back/i,
        confirmPrompt: "Are you sure?"
    }).cancelAction('endList', 'List ended', {
        matches: /^end\s?list|^done/i,
        onSelectAction: function (session) {
            console.log('Done editing list');
            session.endDialogWithResult({ response: session.userData.list });
        }
    });
    bot.dialog('altEnterDataDialog', function (session, results, args) {
        if (/^cancel|back/i.test(session.message.text)) {
        }
        session.userData.list.push(session.message.text);
        console.log('enterDataDialog added data. Now ' + JSON.stringify(session.userData.list));
        session.save();
    }).cancelAction('cancelList', "List canceled", {
        matches: /^cancel|back/i,
        confirmPrompt: "Are you sure?"
    }).cancelAction('endList', 'List ended', {
        matches: /^end\s?list|^done/i,
        onSelectAction: function (session) {
            console.log('Done editing list');
            session.endDialogWithResult({ response: session.userData.list });
        }
    });
    bot.dialog('showListDialog', function (session, results, args) {
        if (session.userData.list) {
            var msg = printList(session.userData.list);
            session.endDialog(msg);
        }
        else {
            session.endDialog('Nothing on the list.');
        }
    });
    bot.dialog('deleteListDialog', [
        function (session, args, next) {
            builder.Prompts.confirm(session, "Are you sure?");
        },
        function (session, args, next) {
            if (args.response) {
                delete session.userData.list;
                session.endDialog('List delete.');
            }
            else {
                session.send('List not deleted.');
                session.replaceDialog('showListDialog');
            }
        }
    ]).cancelAction('cancelDelete', 'List not deleted', {
        matches: /^stop|^cancel/i
    });
    function printList(list) {
        var msg = "\nHere's your list:";
        for (var i = 0; i < list.length; i++) {
            msg += '\n* ' + list[i];
        }
        return msg;
    }
}
exports.create = create;
//# sourceMappingURL=listBot.js.map