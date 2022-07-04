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
exports.softDelete = exports.find = exports.renameFile = exports.update = exports.findById = exports.findByPathUpdate = exports.findByPath = exports.store = exports.findFile = exports.findFileByFileName = exports.getListFile = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function getListFile(projectId, workflowId) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield prisma.gd_file.findMany({
            where: {
                project_id: parseInt(projectId),
                workflow_id: parseInt(workflowId),
                file_deleted: 0,
            },
        });
        return files;
    });
}
exports.getListFile = getListFile;
function findFileByFileName(projectId, workflowId, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield prisma.gd_file.findFirst({
            where: {
                project_id: parseInt(projectId),
                workflow_id: parseInt(workflowId),
                file_path: fileName,
                file_deleted: 0,
            },
        });
        return files;
    });
}
exports.findFileByFileName = findFileByFileName;
function findFile(id, filePath) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const path = filePath.toString();
        const files = yield prisma.gd_file.findMany({
            where: {
                workflow_id: parseInt(id),
                file_path: path,
                file_deleted: 0,
            },
        });
        console.log(files);
        let file = (_a = files[0]) !== null && _a !== void 0 ? _a : null;
        return file;
    });
}
exports.findFile = findFile;
function store(filePath, projectId, workflowId, createDate, createBy) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.gd_file.create({
            data: {
                file_path: filePath,
                project_id: parseInt(projectId),
                workflow_id: parseInt(workflowId),
                file_create_date: createDate,
                file_create_by: parseInt(createBy),
            },
        });
        return result;
    });
}
exports.store = store;
function findByPath(path) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield prisma.gd_file.findMany({
            where: {
                file_path: path,
                file_deleted: 0,
            },
        });
        let file = (_a = files[0]) !== null && _a !== void 0 ? _a : null;
        return file;
    });
}
exports.findByPath = findByPath;
function findByPathUpdate(fileId, path) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield prisma.gd_file.findMany({
            where: {
                NOT: {
                    file_id: parseInt(fileId),
                },
                file_path: path,
                file_deleted: 0,
            },
        });
        let file = (_a = files[0]) !== null && _a !== void 0 ? _a : null;
        return file;
    });
}
exports.findByPathUpdate = findByPathUpdate;
function findById(id) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield prisma.gd_file.findMany({
            where: {
                file_id: parseInt(id),
                file_deleted: 0,
            },
        });
        let file = (_a = files[0]) !== null && _a !== void 0 ? _a : null;
        return file;
    });
}
exports.findById = findById;
function update(fileId, updateDate, updateBy) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = yield prisma.gd_file.update({
            where: {
                file_id: parseInt(fileId),
            },
            data: {
                file_update_date: updateDate,
                file_update_by: parseInt(updateBy),
            },
        });
        return file;
    });
}
exports.update = update;
function renameFile(fileId, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = yield prisma.gd_file.update({
            where: {
                file_id: parseInt(fileId),
            },
            data: {
                file_path: path,
            },
        });
        return file;
    });
}
exports.renameFile = renameFile;
function find(projectId, workflowId, fileName) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield prisma.gd_file.findMany({
            where: {
                project_id: parseInt(projectId),
                workflow_id: parseInt(workflowId),
                file_path: fileName,
                file_deleted: 0,
            },
        });
        let file = (_a = files[0]) !== null && _a !== void 0 ? _a : null;
        return file;
    });
}
exports.find = find;
function softDelete(fileId, deleteDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = yield prisma.gd_file.update({
            where: {
                file_id: parseInt(fileId),
            },
            data: {
                file_deleted: 1,
                file_deleted_at: deleteDate,
            },
        });
        return file;
    });
}
exports.softDelete = softDelete;
