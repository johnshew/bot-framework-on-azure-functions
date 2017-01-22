
import * as builder from 'botbuilder';

export interface IBotServiceConnectorSettings extends builder.IChatConnectorSettings {
    captureConsoleLog? : boolean;
}

export class BotServiceConnector extends builder.ChatConnector {
    constructor(settings?: IBotServiceConnectorSettings) {
        super(settings);
    }

    public listen(): (context: any, req: any) => void {
        var _listen = super.listen();
        return (context, req) => {
            var _context = context;
            if (_context) {
                console.log = function () {
                    if (_context) { _context.log.apply(_context, arguments); }
                }
            }
            var response: IFunctionResponse = {};
            _listen(req, {
                send: function (status: number, body?: any): void {
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
                status: function (val?: number): number {
                    if (typeof val === 'number') {
                        response.status = val;
                    }
                    return response.status || 200;
                },
                end: function () {
                    if (context) {
                        context.res = response;
                        context.done();
                        context = null;
                    }
                }
            });
        };
    }
}


interface IFunctionResponse {
    status?: number;
    body?: any;
}