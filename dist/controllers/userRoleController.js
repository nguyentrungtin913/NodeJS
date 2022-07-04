"use strict";
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
const userRole_1 = require("../models/userRole");
const user_1 = require("../models/user");
const responseHelper_1 = require("../helpers/responseHelper");
const userRoleValidator_1 = require("../validators/userRoleValidator");
const errorHelper_1 = require("../helpers/errorHelper");
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield (0, userRoleValidator_1.update)(req, res))) {
            return (0, errorHelper_1.getError)(res);
        }
        const { ob, roleId, userId } = req.body;
        const user = yield (0, user_1.findById)(parseInt(userId), parseInt(ob.id));
        if (!user) {
            return (0, responseHelper_1.error)(res, "update_role_failded", 400, `User ${userId} not existed`, `User ${userId} not existed`, null);
        }
        const now = new Date();
        const userRole = yield (0, userRole_1.findByUserId)(userId);
        if (userRole) {
            const oldRole = userRole.role_id;
            const result = yield (0, userRole_1.update)(parseInt(userId), parseInt(roleId), oldRole, now.toISOString(), parseInt(ob.id));
            if (result) {
                return (0, responseHelper_1.success)(res, "update_role_success", "update_role_success", "Update role successful", result);
            }
            return (0, responseHelper_1.error)(res, "update_role_failded", 400, "update_role_failed", "Update role failed", null);
        }
        else {
            return (0, responseHelper_1.error)(res, "update_role_failded", 400, "update_role_failed", "Update role failed", null);
        }
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
exports.default = { update };
