"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmail = exports.checkNumber = exports.requireParam = void 0;
const errorHelper_1 = require("./errorHelper");
function requireParam(res, param, code, msgKey, description) {
    if (param === undefined || param.length < 1) {
        (0, errorHelper_1.setError)(res, 400, code, msgKey, description);
        return false;
    }
    return true;
}
exports.requireParam = requireParam;
function checkNumber(res, param, code, msgKey, description) {
    if (isNaN(param)) {
        (0, errorHelper_1.setError)(res, 400, code, msgKey, description);
        return false;
    }
    return true;
}
exports.checkNumber = checkNumber;
const isEmail = (email) => {
    return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
};
exports.isEmail = isEmail;
