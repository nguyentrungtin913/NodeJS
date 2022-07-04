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
const userModel = __importStar(require("../models/user"));
const user_1 = require("../constant/user");
const userRole_1 = require("../models/userRole");
const responseHelper_1 = require("../helpers/responseHelper");
const userValidator = __importStar(require("../validators/userValidator"));
const errorHelper_1 = require("../helpers/errorHelper");
const nodemailer_1 = __importDefault(require("nodemailer"));
const env = __importStar(require("env-var"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const paginationHelper_1 = require("../helpers/paginationHelper");
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { ob } = req.body;
        let { id } = ob;
        let user = yield userModel.findById(id);
        return (0, responseHelper_1.success)(res, "get_user_success", "get.success", "Request successful", user);
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
const searchByCriteria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { page = "", limit = "", status = "", email = "", ob } = req.body;
    page =
        isNaN(page) || page.toString().trim() === "" || page === undefined
            ? "1"
            : page;
    limit =
        isNaN(limit) || limit.toString().trim() === "" || limit === undefined
            ? "5"
            : limit;
    status =
        isNaN(status) || status.toString().trim() === "" || status === undefined
            ? "-1"
            : status;
    page = parseInt(page.toString());
    limit = parseInt(limit.toString());
    status = parseInt(status.toString());
    let skip = (page - 1) * limit;
    try {
        let users = yield userModel.listUsers(skip, limit, status, email, parseInt(ob.id), parseInt(ob.id));
        if (users) {
            let totalPage = users[0] !== null ? users[0] : 0;
            return (0, paginationHelper_1.pagination)(res, users[1], "ListUsers", "get_user_success", "get.success", "Get a list of successful users", totalPage, page, limit);
        }
        return (0, responseHelper_1.errors)(res, "get_users_faild", 400, "get.users.faild", "Get users faild");
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        if (!(yield userValidator.register(req, res))) {
            return (0, errorHelper_1.getError)(res);
        }
        const { email, password, token = "", firstName = "", lastName = "", } = req.body;
        const secret = (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : "GenD";
        let isValidInvitationLink = true;
        let user = null;
        try {
            const decoded = jwt.verify(token, secret);
            user = yield userModel.findById(parseInt((decoded === null || decoded === void 0 ? void 0 : decoded.id) || "0"));
            if (!user ||
                user.user_status !== user_1.STATUS.INVITED ||
                user.user_email !== email) {
                isValidInvitationLink = false;
            }
        }
        catch (err) {
            isValidInvitationLink = false;
        }
        if (!isValidInvitationLink || !user) {
            return (0, responseHelper_1.error)(res, "register_failed", 400, "Register account failed", "Register account failed", null);
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const now = new Date();
        const result = yield userModel.update(user === null || user === void 0 ? void 0 : user.user_id, firstName, lastName, hash, now.toISOString(), user_1.STATUS.ACTIVE);
        if (result) {
            let role = null;
            if (user.user_roles.length > 0) {
                if (user.user_roles[0].role) {
                    role = user.user_roles[0].role.role_name;
                }
            }
            const payload = {
                id: user.user_id,
                role: role,
                email: (_b = user.user_email) !== null && _b !== void 0 ? _b : null,
                exp: Math.floor(Date.now() / 1000) + 60 * 30,
            };
            const secret = (_c = process.env.SECRET) !== null && _c !== void 0 ? _c : "GenD";
            const token = jwt.sign(payload, secret);
            const data = {
                accessToken: token,
            };
            return (0, responseHelper_1.success)(res, "register_success", "Register account successful", "Register account successful", data);
        }
        return (0, responseHelper_1.errors)(res, "register_failed", 400, "Register account failed", "Register account failed");
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
const validateInvitationLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { token = "" } = req.body;
    const secret = (_d = process.env.SECRET) !== null && _d !== void 0 ? _d : "GenD";
    let user = null;
    let isValidInvitationLink = true;
    try {
        const decoded = jwt.verify(token, secret);
        user = yield userModel.findById(parseInt((decoded === null || decoded === void 0 ? void 0 : decoded.id) || "0"));
        if (!user || user.user_status !== user_1.STATUS.INVITED) {
            isValidInvitationLink = false;
        }
    }
    catch (err) {
        isValidInvitationLink = false;
    }
    if (user && isValidInvitationLink) {
        return (0, responseHelper_1.success)(res, "valid_invitation_link", "Invitation link is valid", "Invitation link is valid", {
            email: user.user_email,
        });
    }
    else {
        return (0, responseHelper_1.error)(res, "invalid_invitation_link", 401, "Your invation link is invalid", "Your invitation link is invalid", null);
    }
});
const inviteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h;
    try {
        if (!(yield userValidator.inviteUser(req, res))) {
            return (0, errorHelper_1.getError)(res);
        }
        const URL_INVITATION = (_e = env.get("URL_INVITATION").asString()) !== null && _e !== void 0 ? _e : "";
        const MAIL = (_f = env.get("MAIL").asString()) !== null && _f !== void 0 ? _f : "";
        const MAIL_PASSWORD = (_g = env.get("MAIL_PASSWORD").asString()) !== null && _g !== void 0 ? _g : "";
        const { ob, mailTo, role, text = "" } = req.body;
        const perText = `<p>${text || ""}</p>`;
        const userCreateBy = parseInt(ob.id);
        const now = new Date();
        const result = yield userModel.findByEmail(mailTo);
        if (!result) {
            const user = yield userModel.create(mailTo, now.toISOString(), userCreateBy, user_1.STATUS.INVITED);
            if (!user) {
                return (0, responseHelper_1.error)(res, "invitation_faild", 400, `Invite email ${mailTo} failed`, `Invite email ${mailTo} failed`, mailTo);
            }
            const userRole = yield (0, userRole_1.store)(user.user_id, role, now.toISOString(), userCreateBy);
            if (!userRole) {
                return (0, responseHelper_1.error)(res, "invitation_faild", 400, `Invite email ${mailTo} failed`, `Invite email ${mailTo} failed`, mailTo);
            }
            const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 72;
            const payload = {
                id: user.user_id,
                exp: expirationTime,
            };
            const registerToken = jwt.sign(payload, (_h = process.env.SECRET) !== null && _h !== void 0 ? _h : "GenD");
            let transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    user: MAIL,
                    pass: MAIL_PASSWORD,
                },
            });
            const mailOptions = {
                from: MAIL,
                to: mailTo,
                subject: "Invitation to join GenD Admin",
                html: `
                    <p>Hi! GenD Administrator has sent you an invitation to join GenD Admin</p>
                    <p>${perText}</p>
                    <a href="${URL_INVITATION}?token=${registerToken}" style="border:solid thin;padding:5px;color:#28b66a;width:255px;text-decoration:none;font-weight:bolder">ACCEPT YOUR INVITATION</a>
                    <p>Thanks,</p>
                    <p>GenD Team</p>
            `,
            };
            const result = yield transporter.sendMail(mailOptions);
            return (0, responseHelper_1.success)(res, "invitation_success", `Invite email ${mailTo} successfully`, `Invite email ${mailTo} successfully`, mailTo);
        }
        else {
            return (0, responseHelper_1.error)(res, "invitation_faild", 400, `Email ${mailTo} taken`, `Email ${mailTo} taken`, mailTo);
        }
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.error)(res, "request_failed", 500, "request.failed", "request.failed", uncaughtException);
    }
});
// const updateProfileFirst = async (req: Request, res: Response) => {
//   try {
//     if (!(await updateProfileFirstValidator(req, res))) {
//       return getError(res);
//     }
//     let { email, firstName, lastName, password } = req.body ?? "";
//     const salt = await bcrypt.genSalt(10);
//     let hash = await bcrypt.hash(password, salt);
//     let role = null;
//     const now = new Date();
//     let user = await updateProfileModel(
//       email,
//       firstName,
//       lastName,
//       hash,
//       now.toISOString()
//     );
//     if (user) {
//       let result = await findByEmailModel(user.user_email);
//       const d = new Date();
//       let start = d.getTime();
//       let end = start + 1000 * 60 * 30;
//       if (result.user_roles.length > 0) {
//         if (result.user_roles[0].role) {
//           role = result.user_roles[0].role.role_name;
//         }
//       }
//       let payload = {
//         id: user.user_id,
//         role: role,
//         email: user.user_email ?? null,
//         exp: Math.floor(Date.now() / 1000) + 60 * 30,
//       };
//       let secret = process.env.SECRET ?? "GenD";
//       let token = jwt.sign(payload, secret);
//       const rs = await store(
//         token,
//         user.user_id,
//         "",
//         start.toString(),
//         end.toString()
//       );
//       let data = {
//         accessToken: rs.access_token ?? "",
//       };
//       return success(
//         res,
//         "login_success",
//         "login.success",
//         "Login successfully",
//         data
//       );
//     }
//     return errors(
//       res,
//       "update_profile_faild",
//       400,
//       "update.profile.faild",
//       "Update profile faild"
//     );
//   } catch (uncaughtException) {
//     return errors(
//       res,
//       "request_failed",
//       500,
//       "request.failed",
//       uncaughtException
//     );
//   }
// };
const softDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield userValidator.softDelete(req, res))) {
            return (0, errorHelper_1.getError)(res);
        }
        let { userId, ob } = req.body;
        const now = new Date();
        let user = yield userModel.softDelete(parseInt(userId), now.toISOString(), parseInt(ob.id));
        if (user) {
            return (0, responseHelper_1.success)(res, "delete_user_success", "delete.user.success", "Delete user success", user);
        }
        return (0, responseHelper_1.errors)(res, "delete_user_faild", 400, "delete.user.faild", "Delete user faild");
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
exports.default = {
    getProfile,
    searchByCriteria,
    validateInvitationLink,
    inviteUser,
    //updateProfileFirst,
    softDelete,
    register,
};
