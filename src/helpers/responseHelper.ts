import { Response } from "express";

export function success(res: Response, code: string, mesKey: string, description: string, data: any) {
    let result = {
        "code": code,
        "msgKey": mesKey,
        "description": description,
        "data": data
    }
    res.status(200)
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
}

export function errors(res: Response, code: string, status: any, msgKey: string, description: any) {
    let result = {
        "code": code,
        "msgKey": msgKey,
        "description": description,
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(status)
    return res.end(JSON.stringify(result));
}

export function error(res: Response, code: string, status: any, msgKey: string, description: any, data: any) {
    let result = {
        "code": code,
        "msgKey": msgKey,
        "description": description,
        "data": data
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(status)
    return res.end(JSON.stringify(result));
}
