/// <reference path="../typings/index.d.ts" />

import {HttpContext, IFunctionRequest, HttpStatusCodes} from 'azure-functions-typescript'

export function index(context: HttpContext, req: IFunctionRequest) {
    context.log('Running');
    if(req.method == "GET")
    context.res.status = HttpStatusCodes.OK;
    context.done(null, {});
}

