"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseHelper_1 = require("../helpers/responseHelper");
exports.default = (error, request, response, next) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    return (0, responseHelper_1.errors)(response, 'request_failed', status, 'request.failed', message);
};
