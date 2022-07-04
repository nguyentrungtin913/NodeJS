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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDelete = exports.update = exports.create = exports.findById = exports.findByEmail = exports.listUsers = void 0;
const client_1 = require("@prisma/client");
const lodash_1 = __importDefault(require("lodash"));
const prisma = new client_1.PrismaClient();
function listUsers(page = 0, limit = 5, status = -1, email = "", excluded_user_id = 0, parentId = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            user_deleted: 0,
            user_id: {
                not: {
                    equals: excluded_user_id,
                },
            },
        };
        if (status !== -1) {
            params["user_status"] = status;
        }
        if (!lodash_1.default.isEmpty(email)) {
            params["user_email"] = {
                contains: email,
            };
        }
        if (parentId > 0) {
            params["user_create_by"] = parentId;
        }
        const users = yield prisma.$transaction([
            prisma.gd_user.count({
                where: params,
            }),
            prisma.gd_user.findMany({
                skip: page,
                take: limit,
                where: params,
                select: {
                    user_id: true,
                    user_email: true,
                    user_first_name: true,
                    user_last_name: true,
                    user_status: true,
                    user_create_at: true,
                    user_update_at: true,
                    user_create_by: true,
                    user_update_by: true,
                    user_roles: {
                        include: {
                            role: true,
                        },
                    },
                },
                orderBy: {
                    user_id: "asc",
                },
            }),
        ]);
        return users;
    });
}
exports.listUsers = listUsers;
function findByEmail(email) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield prisma.gd_user.findMany({
            where: {
                user_email: email,
                user_deleted: 0,
            },
            include: {
                user_roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        let user = (_a = users[0]) !== null && _a !== void 0 ? _a : null;
        return user;
    });
}
exports.findByEmail = findByEmail;
function findById(userId, parentId = 0) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            user_deleted: 0,
        };
        params["user_id"] = userId;
        if (parentId > 0) {
            params["user_create_by"] = parentId;
        }
        const users = yield prisma.gd_user.findMany({
            where: params,
            select: {
                user_id: true,
                user_email: true,
                user_first_name: true,
                user_last_name: true,
                user_status: true,
                user_create_at: true,
                user_update_at: true,
                user_create_by: true,
                user_update_by: true,
                user_roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        let user = (_a = users[0]) !== null && _a !== void 0 ? _a : null;
        return user;
    });
}
exports.findById = findById;
function create(userEmail, userCreateAt, userCreateBy, status) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.gd_user.create({
            data: {
                user_email: userEmail,
                user_status: status,
                user_create_at: userCreateAt,
                user_create_by: userCreateBy,
                user_update_by: userCreateBy,
                user_deleted: 0,
            },
        });
        return user;
    });
}
exports.create = create;
function update(userId, firstName, lastName, password, userUpdateAt, status) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.gd_user.update({
            where: {
                user_id: userId,
            },
            data: {
                user_first_name: firstName,
                user_last_name: lastName,
                user_password: password,
                user_update_at: userUpdateAt,
                user_status: status,
            },
        });
        return user;
    });
}
exports.update = update;
function softDelete(userId, userDeleteAt, parentId = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.gd_user.updateMany({
            where: {
                user_id: userId,
                user_create_by: parentId,
            },
            data: {
                user_deleted: 1,
                user_deleted_at: userDeleteAt,
            },
        });
        return user;
    });
}
exports.softDelete = softDelete;
