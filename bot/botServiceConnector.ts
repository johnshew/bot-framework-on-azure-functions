
import * as builder from 'botbuilder';

export class BotServiceConnector extends builder.ChatConnector {
    constructor(settings?: builder.IChatConnectorSettings) {
        super(settings);
    }

    public listen(): (context: any, req: any) => void {
        var _listen = super.listen();
        return (context, req) => {
            if (context) {
                context.log('botServiceConnector:listen');
                console.log = function () {
                    context.log.apply(context, arguments);
                }
            }
            var response: IFunctionResponse = {};
            _listen(req, {
                send: function (status: number, body?: any): void {
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
                status: function (val?: number): number {
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
    }
}


interface IFunctionResponse {
    status?: number;
    body?: any;
}