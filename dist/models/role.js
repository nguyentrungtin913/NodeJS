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
exports.get = exports.findById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function findById(roleId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const roles = yield prisma.gd_role.findMany({
            where: {
                role_id: parseInt(roleId)
            }
        });
        let role = (_a = roles[0]) !== null && _a !== void 0 ? _a : null;
        return role;
    });
}
exports.findById = findById;
function get() {
    return __awaiter(this, void 0, void 0, function* () {
        let roles = yield prisma.gd_role.findMany();
        roles = roles !== null && roles !== void 0 ? roles : null;
        return roles;
    });
}
exports.get = get;
