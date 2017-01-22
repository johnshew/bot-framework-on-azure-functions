"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var builder = require("botbuilder");
var BotServiceConnector = (function (_super) {
    __extends(BotServiceConnector, _super);
    function BotServiceConnector(settings) {
        return _super.call(this, settings) || this;
    }
    BotServiceConnector.prototype.listen = function () {
        var _listen = _super.prototype.listen.call(this);
        return function (context, req) {
            if (context) {
                context.log('botServiceConnector:listen');
                console.log = function () {
                    context.log.apply(context, arguments);
                };
            }
            var response = {};
            _listen(req, {
                send: function (status, body) {
                    console.log('In send');
                    if (context) {
                        response.status = status;
                        if (body) {
                            response.body = body;
                        }
                        context.res = response;
                        context.done();
                        context = null;
                    }
                },
                status: function (val) {
                    console.log('botServiceConnector:status');
                    if (typeof val === 'number') {
                        response.status = val;
                    }
                    return response.status || 200;
                },
                end: function () {
                    console.log('botServiceConnector:end');
                    if (context) {
                        context.res = response;
                        context.done();
                        context = null;
                    }
                }
            });
        };
    };
    return BotServiceConnector;
}(builder.ChatConnector));
exports.BotServiceConnector = BotServiceConnector;
//# sourceMappingURL=botServiceConnector.js.map