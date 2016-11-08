"use strict";
var azure_functions_typescript_1 = require('azure-functions-typescript');
function index(context, req) {
    if (req.method == "GET")
        context.res.status = azure_functions_typescript_1.HttpStatusCodes.OK;
    context.done(null, {});
}
exports.index = index;
//# sourceMappingURL=index.js.map