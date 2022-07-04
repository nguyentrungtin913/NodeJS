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
exports.softDelete = exports.findById = exports.findByName = exports.update = exports.store = exports.get = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function get() {
    return __awaiter(this, void 0, void 0, function* () {
        const projects = yield prisma.gd_project.findMany({
            where: {
                project_deleted: 0,
            },
        });
        return projects;
    });
}
exports.get = get;
function store(name, digdagProjectId, revision, createDate, createBy) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.gd_project.create({
            data: {
                project_name: name,
                project_create_date: createDate,
                project_revision: revision,
                project_create_by: createBy,
                digdag_project_id: digdagProjectId,
            },
        });
        return result;
    });
}
exports.store = store;
function update(projectId, revision, updateDate, updateBy, digdagProjectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.gd_project.update({
            where: {
                project_id: projectId,
            },
            data: {
                project_update_date: updateDate,
                project_update_by: updateBy,
                project_revision: revision,
                digdag_project_id: digdagProjectId,
            },
        });
        return result;
    });
}
exports.update = update;
function findByName(name) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const projects = yield prisma.gd_project.findMany({
            where: {
                project_name: name,
                project_deleted: 0,
            },
        });
        let project = (_a = projects[0]) !== null && _a !== void 0 ? _a : null;
        return project;
    });
}
exports.findByName = findByName;
function findById(id) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const projects = yield prisma.gd_project.findMany({
            where: {
                project_deleted: 0,
                project_id: parseInt(id),
            },
        });
        let project = (_a = projects[0]) !== null && _a !== void 0 ? _a : null;
        return project;
    });
}
exports.findById = findById;
function softDelete(idProject, dateDelete) {
    return __awaiter(this, void 0, void 0, function* () {
        const project = yield prisma.gd_project.update({
            where: {
                project_id: parseInt(idProject),
            },
            data: {
                project_deleted: 1,
                project_deleted_at: dateDelete,
            },
        });
        return project;
    });
}
exports.softDelete = softDelete;
