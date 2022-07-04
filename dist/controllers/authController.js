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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const responseHelper_1 = require("../helpers/responseHelper");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const authValidator_1 = require("../validators/authValidator");
const errorHelper_1 = require("../helpers/errorHelper");
const user_2 = require("../constant/user");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        if (!(yield (0, authValidator_1.auth)(req, res))) {
            return (0, errorHelper_1.getError)(res);
        }
        const email = (_a = req.body.email) !== null && _a !== void 0 ? _a : "";
        const password = (_b = req.body.password) !== null && _b !== void 0 ? _b : "";
        // const salt = await bcrypt.genSalt(10);
        // let hash = await bcrypt.hash(password, salt);
        // console.log(hash)
        const user = yield (0, user_1.findByEmail)(email);
        if (user &&
            user.user_deleted === 0 &&
            user.user_status === user_2.STATUS["ACTIVE"]) {
            const passUser = (_c = user.user_password) !== null && _c !== void 0 ? _c : "";
            let role = null;
            if (user.user_roles.length > 0) {
                if (user.user_roles[0].role) {
                    role = user.user_roles[0].role.role_name;
                }
            }
            if (yield bcrypt_1.default.compare(password, passUser)) {
                const now = new Date();
                const start = now.getTime();
                const end = start + 1000 * 60 * 30;
                const payload = {
                    id: user.user_id,
                    role: role,
                    email: (_d = user.user_email) !== null && _d !== void 0 ? _d : null,
                    exp: Math.floor(Date.now() / 1000) + 60 * 30,
                };
                const secret = (_e = process.env.SECRET) !== null && _e !== void 0 ? _e : "GenD";
                const token = jwt.sign(payload, secret);
                // const result = await store(
                //   token,
                //   user.user_id,
                //   "",
                //   start.toString(),
                //   end.toString()
                // );
                const data = {
                    accessToken: token,
                };
                return (0, responseHelper_1.success)(res, "login_success", "login.success", "Login successfully", data);
            }
            return (0, responseHelper_1.errors)(res, "login_failed", 400, "login.username_password.invalid", "The email address or password you entered is invalid !");
        }
        return (0, responseHelper_1.errors)(res, "login_failed", 400, "login.username_password.invalid", "The email address or password you entered is invalid !");
    }
    catch (uncaughtException) {
        // logger.error(uncaughtException);
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
exports.default = { login };
