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
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const Yup = __importStar(require("yup"));
const errorHelper_1 = require("../helpers/errorHelper");
function auth(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const email = (_a = req.body.email) !== null && _a !== void 0 ? _a : '';
        const password = (_b = req.body.password) !== null && _b !== void 0 ? _b : '';
        const auth = {
            email,
            password
        };
        try {
            const schema = Yup.object().shape({
                email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
                password: Yup.string().max(255).required("Password is required"),
            });
            yield schema.validate(auth, { abortEarly: false });
            return true;
        }
        catch (error) {
            const err = JSON.parse(JSON.stringify(error));
            let description = '';
            let msgKey = '';
            let code = '';
            if (err.errors) {
                switch (err.errors[0]) {
                    case "Must be a valid email":
                        description = 'Must be a valid email';
                        msgKey = 'email.invalid';
                        code = 'email_invalid';
                        break;
                    case "Email is required":
                        description = 'Email is required';
                        msgKey = 'email.required';
                        code = 'email_required';
                        break;
                    case "Password is required":
                        description = 'password is required';
                        msgKey = 'password.required';
                        code = 'password_required';
                        break;
                    default:
                        description = 'error';
                        msgKey = 'error';
                        code = 'error';
                        break;
                }
            }
            (0, errorHelper_1.setError)(res, 400, code, msgKey, description);
            return false;
        }
    });
}
exports.auth = auth;
