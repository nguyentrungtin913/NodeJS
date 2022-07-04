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
exports.register = exports.softDelete = exports.updateProfileFirst = exports.inviteUser = exports.findUserByEmail = void 0;
const baseValidator_1 = require("../helpers/baseValidator");
const role_1 = require("../models/role");
const errorHelper_1 = require("../helpers/errorHelper");
const user_1 = require("../models/user");
const Yup = __importStar(require("yup"));
function requireEmail(res, email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.requireParam)(res, email, "email_required", "email.required", "Email is required")) {
            return false;
        }
        if (!(0, baseValidator_1.isEmail)(email)) {
            (0, errorHelper_1.setError)(res, 400, "invalid_email", `Email ${email} is invalid`, `Email ${email} is invalid`);
            return false;
        }
        return true;
    });
}
function findUserByEmail(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let email = (_a = req.query.email) !== null && _a !== void 0 ? _a : "";
        if (!(yield requireEmail(res, email.toString()))) {
            return false;
        }
        return true;
    });
}
exports.findUserByEmail = findUserByEmail;
function checkRole(res, role) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.checkNumber)(res, role, "role_invalid", "role.invalid", "Role invalid")) {
            return false;
        }
        return true;
    });
}
function requireDataInvitation(res, mailTo, role) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield requireEmail(res, mailTo)) ||
            !(0, baseValidator_1.requireParam)(res, role, "role_required", "role.required", "Role is required")) {
            return false;
        }
        return true;
    });
}
function checkRoleExist(res, role) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, role_1.findById)(role);
        if (!result) {
            (0, errorHelper_1.setError)(res, 400, "role_not_exist", "role.not.exist", "Role not exists");
            return false;
        }
        return true;
    });
}
function inviteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { mailTo, role } = req.body;
        if (!(yield requireDataInvitation(res, mailTo, role)) ||
            !(yield checkRole(res, role)) ||
            !(yield checkRoleExist(res, role))) {
            return false;
        }
        return true;
    });
}
exports.inviteUser = inviteUser;
function requireDataUpdateProfileFirst(res, email, firstName, lastName, password, confirmPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.requireParam)(res, email, "emai_required", "email.required", "Email is required") ||
            !(0, baseValidator_1.requireParam)(res, firstName, "firstname_required", "firstname.required", "First name is required") ||
            !(0, baseValidator_1.requireParam)(res, lastName, "lastName_required", "lastName.required", "Last name is required") ||
            !(0, baseValidator_1.requireParam)(res, password, "password_required", "password.required", "Password is required") ||
            !(0, baseValidator_1.requireParam)(res, confirmPassword, "confirmPassword_required", "confirmPassword.required", "Confirm password is required")) {
            return false;
        }
        return true;
    });
}
function passwordConfirm(res, password, confirmPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        if (password !== confirmPassword) {
            (0, errorHelper_1.setError)(res, 400, "confirm_password_incorrect", "confirm.password.incorrect", "Confirm incorrect password");
            return false;
        }
        return true;
    });
}
function checkFirstUpdate(res, email) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield (0, user_1.findByEmail)(email);
        if (user) {
            if (user.user_update_at) {
                (0, errorHelper_1.setError)(res, 400, "not_allow", "not.allow", "Update only when logging in for the first time");
                return false;
            }
            return true;
        }
        (0, errorHelper_1.setError)(res, 400, "email_not_exist", "email.not.exist", "Email not exist");
        return false;
    });
}
function updateProfileFirst(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { email, firstName, lastName, password, confirmPassword } = req.body;
        if (!(yield requireDataUpdateProfileFirst(res, email, firstName, lastName, password, confirmPassword)) ||
            !(yield passwordConfirm(res, password, confirmPassword)) ||
            !(yield checkFirstUpdate(res, email))) {
            return false;
        }
        return true;
    });
}
exports.updateProfileFirst = updateProfileFirst;
function checkUserId(res, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.checkNumber)(res, userId, "user_id_invalid", "user.id.invalid", "User id invalid")) {
            return false;
        }
        return true;
    });
}
function requireDataSoftDelete(res, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.requireParam)(res, userId, "user_id_required", "user.id.required", "User id to is required")) {
            return false;
        }
        return true;
    });
}
function checkUserExist(res, userId, id) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield (0, user_1.findById)(parseInt(userId));
        if (!user) {
            (0, errorHelper_1.setError)(res, 400, "user_not_exist", "user.not.exist", "User not exist");
            return false;
        }
        else {
            let idUserCreate = (_a = user.user_create_by) !== null && _a !== void 0 ? _a : 0;
            if (id === idUserCreate) {
                return true;
            }
            else {
                (0, errorHelper_1.setError)(res, 403, "not_allow", "not.allow", "You are not allowed to delete this user");
                return false;
            }
        }
    });
}
function softDelete(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { userId, ob } = req.body;
        let { id } = ob;
        if (!(yield requireDataSoftDelete(res, userId)) ||
            !(yield checkUserId(res, userId)) ||
            !(yield checkUserExist(res, userId, id))) {
            return false;
        }
        return true;
    });
}
exports.softDelete = softDelete;
function requireDataRegister(res, email, password, confirmPassword, firstName, lastName, token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.requireParam)(res, email, "email_required", "email.required", "Email is required") ||
            !(0, baseValidator_1.requireParam)(res, password, "password_required", "password.required", "Password is required") ||
            !(0, baseValidator_1.requireParam)(res, confirmPassword, "password_confirm_required", "password.confirm.required", "Password confirm is required") ||
            !(0, baseValidator_1.requireParam)(res, firstName, "first_name_required", "first_name_required", "First name is required") ||
            !(0, baseValidator_1.requireParam)(res, lastName, "last_name_required", "last_name_required", "Last Name is required") ||
            !(0, baseValidator_1.requireParam)(res, token, "invitation_token_required", "invitation_token_required", "Invitation token is required")) {
            return false;
        }
        return true;
    });
}
function checkEmail(res, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const check = {
            email,
        };
        try {
            const schema = Yup.object().shape({
                email: Yup.string()
                    .email("Must be a valid email")
                    .max(255)
                    .required("Email is required"),
            });
            yield schema.validate(check, { abortEarly: false });
            return true;
        }
        catch (error) {
            const err = JSON.parse(JSON.stringify(error));
            let description = "";
            let msgKey = "";
            let code = "";
            if (err.errors) {
                switch (err.errors[0]) {
                    case "Must be a valid email":
                        description = "Must be a valid email";
                        msgKey = "email.invalid";
                        code = "email_invalid";
                        break;
                    case "Email is required":
                        description = "Email is required";
                        msgKey = "email.required";
                        code = "email_required";
                        break;
                    default:
                        description = "error";
                        msgKey = "error";
                        code = "error";
                        break;
                }
            }
            (0, errorHelper_1.setError)(res, 400, code, msgKey, description);
            return false;
        }
    });
}
function checkEmailExist(res, email) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield (0, user_1.findByEmail)(email);
        if (user) {
            (0, errorHelper_1.setError)(res, 400, "email_exist", "email.exist", "Email already exists");
            return false;
        }
        return true;
    });
}
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { email, password, confirmPassword, firstName, lastName, token } = req.body;
        if (!(yield requireDataRegister(res, email, password, confirmPassword, firstName, lastName, token)) ||
            !(yield checkEmail(res, email)) ||
            !(yield passwordConfirm(res, password, confirmPassword))) {
            return false;
        }
        return true;
    });
}
exports.register = register;
