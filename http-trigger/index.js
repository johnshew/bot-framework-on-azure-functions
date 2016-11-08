"use strict";
function index(context, req) {
    context.log('Running');
    context.res = {
        status: 200,
        body: "Hello "
    };
    context.done();
}
exports.index = index;
//# sourceMappingURL=index.js.map