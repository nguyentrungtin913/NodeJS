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
exports.findByUserId = exports.update = exports.store = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function store(userId, roleId, createDate, createBy) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.gd_user_role.create({
            data: {
                user_id: parseInt(userId),
                role_id: parseInt(roleId),
                user_role_create_date: createDate,
                user_role_create_by: createBy,
            },
        });
        return result;
    });
}
exports.store = store;
function update(userId, roleId, oldRoleId, updateDate, updateBy) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.gd_user_role.update({
            data: {
                role_id: roleId,
                user_role_update_date: updateDate,
                user_role_update_by: updateBy,
            },
            where: {
                user_id_role_id: {
                    user_id: userId,
                    role_id: oldRoleId,
                },
            },
        });
        return result;
    });
}
exports.update = update;
function findByUserId(userId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const userRoles = yield prisma.gd_user_role.findMany({
            where: {
                user_id: parseInt(userId),
            },
        });
        let userRole = (_a = userRoles[0]) !== null && _a !== void 0 ? _a : null;
        return userRole;
    });
}
exports.findByUserId = findByUserId;
