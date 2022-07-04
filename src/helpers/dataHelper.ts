import { Response } from "express";
export function getList(res: Response, list: any, name: string, code: string, msgKey: string, description: string) {
    let result = {
        "code": code,
        "msgKey": msgKey,
        "description": description,
        "data": {
            [name]: list
        }
    }
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
}

export function get(res: Response, ob: Object, name: string, code: string, msgKey: string, description: string) {
    let result = {
        "code": code,
        "msgKey": msgKey,
        "description": description,
        "data": {
            [name]: ob
        }
    }
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
}