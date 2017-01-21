
import * as builder from 'botbuilder';

export class BotServiceConnector extends builder.ChatConnector {
    constructor(settings?: builder.IChatConnectorSettings) {
        super(settings);
    }

    public listen(): (context: any, req: any) => void {
        var _listen = super.listen();
        return (context, req) => {
            var response: IFunctionResponse = {};
            _listen(req, {
                send: function (status: number, body?: any): void {
                    if (context) {
                        context.log('In listen');
                        console.log = function () { context.log.apply(context,arguments); }
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