"use strict";
function index(context, myQueueItem) {
    context.log('Sending Bot message' + myQueueItem);
    var message = {
        'text': myQueueItem.text,
        'address': myQueueItem.address,
        'user': myQueueItem.user
    };
    context.done(null, message);
}
exports.index = index;
;
//# sourceMappingURL=index.js.map