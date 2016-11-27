"use strict";
function index(context, myTimer) {
    var timeStamp = new Date().toISOString();
    if (myTimer.isPastDue) {
        context.log('Node.js is running late!');
    }
    context.log('Node.js timer trigger function ran! ' + timeStamp);
    context.done();
}
exports.index = index;
;
//# sourceMappingURL=index.js.map