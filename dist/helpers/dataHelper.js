"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.getList = void 0;
function getList(res, list, name, code, msgKey, description) {
    let result = {
        "code": code,
        "msgKey": msgKey,
        "description": description,
        "data": {
            [name]: list
        }
    };
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
}
exports.getList = getList;
function get(res, ob, name, code, msgKey, description) {
    let result = {
        "code": code,
        "msgKey": msgKey,
        "description": description,
        "data": {
            [name]: ob
        }
    };
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
}
exports.get = get;
