
import {HttpContext, IFunctionRequest, HttpStatusCodes} from 'azure-functions-typescript'

export function index(context: HttpContext, req: IFunctionRequest) {
    context.log('Running');
    context.res = {
            status: 200,
            body: "Hello " 
        };
    context.done();
}

