"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseHelper_1 = require("../helpers/responseHelper");
const setting = (req, res, next) => {
    var _a;
    let timeZone = (_a = process.env.TIMEZONE) !== null && _a !== void 0 ? _a : null;
    return (0, responseHelper_1.success)(res, 'get_setting_success', 'get.success', 'Request successfully', timeZone);
};
exports.default = { setting };
