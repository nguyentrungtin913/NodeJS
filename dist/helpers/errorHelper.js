"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getError = exports.setError = void 0;
let ERROR = {
    code: "errors",
    msgKey: "",
    description: "",
};
function setError(res, status, code, errorDev, errorClient) {
    ERROR = {
        code: code,
        msgKey: errorDev,
        description: errorClient,
    };
    res.status(status);
    return;
}
exports.setError = setError;
function getError(res) {
    let result = JSON.stringify(ERROR);
    res.setHeader("Content-Type", "application/json");
    return res.end(result);
}
exports.getError = getError;
module.exports = { setError, getError };
