"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.errors = exports.success = void 0;
function success(res, code, mesKey, description, data) {
    let result = {
        "code": code,
        "msgKey": mesKey,
        "description": description,
        "data": data
    };
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
}
exports.success = success;
function errors(res, code, status, msgKey, description) {
    let result = {
        "code": code,
        "msgKey": msgKey,
        "description": description,
    };
    res.setHeader('Content-Type', 'application/json');
    res.status(status);
    return res.end(JSON.stringify(result));
}
exports.errors = errors;
function error(res, code, status, msgKey, description, data) {
    let result = {
        "code": code,
        "msgKey": msgKey,
        "description": description,
        "data": data
    };
    res.setHeader('Content-Type', 'application/json');
    res.status(status);
    return res.end(JSON.stringify(result));
}
exports.error = error;
