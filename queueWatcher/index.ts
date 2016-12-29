
/*
module.exports = function (context, myQueueItem) {
    context.log('Sending Bot message', myQueueItem);

    var message = {
        'text': myQueueItem.text,
        'address': myQueueItem.address
    };

    context.done(null, message);
}
*/

import {Context, HttpContext, IFunctionRequest, HttpStatusCodes} from 'azure-functions-typescript'

export function index(context: Context, myQueueItem : any) {
    context.log('Sending Bot message' + myQueueItem);

    var message = {
        'text': myQueueItem.text,
        'address': myQueueItem.address,
        'user': myQueueItem.user
    };

    context.done(null, message);
};