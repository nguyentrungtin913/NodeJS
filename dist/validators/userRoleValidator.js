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
exports.update = void 0;
const baseValidator_1 = require("../helpers/baseValidator");
const userRole_1 = require("../models/userRole");
const errorHelper_1 = require("../helpers/errorHelper");
const role_1 = require("../models/role");
function requireDataUpdate(res, userId, roleId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.requireParam)(res, userId, "user_id_required", "user.id.required", "User id is required") ||
            !(0, baseValidator_1.requireParam)(res, roleId, "role_id_required", "role.id.required", "Role id is required")) {
            return false;
        }
        return true;
    });
}
function checkData(res, userId, roleId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.checkNumber)(res, userId, "user_id_invalid", "user.id.invalid", "User id invalid") ||
            !(0, baseValidator_1.checkNumber)(res, roleId, "role_id_invalid", "role.id.invalid", "Role id invalid")) {
            return false;
        }
        return true;
    });
}
function checkUserRoleExist(res, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let userRole = yield (0, userRole_1.findByUserId)(userId);
        if (!userRole) {
            (0, errorHelper_1.setError)(res, 400, "user_role_not_exist", "user_role.not.exist", "User role not exist");
            return false;
        }
        return true;
    });
}
function checkRoleExist(res, roleId) {
    return __awaiter(this, void 0, void 0, function* () {
        let role = yield (0, role_1.findById)(roleId);
        if (!role) {
            (0, errorHelper_1.setError)(res, 400, "role_not_exist", "role.not.exist", "Role not exist");
            return false;
        }
        return true;
    });
}
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { roleId, userId } = req.body;
        if (!(yield requireDataUpdate(res, userId, roleId)) ||
            !(yield checkData(res, userId, roleId)) ||
            !(yield checkUserRoleExist(res, userId)) ||
            !(yield checkRoleExist(res, roleId))) {
            return false;
        }
        return true;
    });
}
exports.update = update;
