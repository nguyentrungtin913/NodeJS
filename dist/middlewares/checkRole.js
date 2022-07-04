"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const responseHelper_1 = require("../helpers/responseHelper");
const checkRole = (req, res, next) => {
    var _a;
    let token = "";
    let decoded = new Object();
    let authorization = req.header("Authorization");
    if (authorization) {
        token = authorization.replace("Bearer ", "");
    }
    else {
        token = req.params.auth_token || "";
    }
    const secret = (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : "GenD";
    try {
        decoded = jwt.verify(token, secret);
    }
    catch (err) {
        return (0, responseHelper_1.errors)(res, "auth_failed", 401, "token.invalid", "Invalid access token");
    }
    req.body.ob = decoded;
    req.body.currToken = token;
    next();
};
exports.checkRole = checkRole;
