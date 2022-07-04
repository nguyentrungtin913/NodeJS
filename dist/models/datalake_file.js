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
exports.deleteFile = exports.updateFile = exports.createFile = exports.findFileById = exports.listFiles = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const listFiles = (userId = 0, folderId = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        dl_file_deleted: 0,
        dl_file_created_by: userId,
    };
    if (folderId > 0) {
        params["dl_folder_id"] = folderId;
    }
    const files = yield prisma.gd_datalake_file.findMany({
        where: params,
    });
    return files;
});
exports.listFiles = listFiles;
const findFileById = (userId = 0, folderId = 0, fileId = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        dl_file_created_by: userId,
        dl_folder_id: folderId,
        dl_file_id: fileId,
    };
    const files = yield prisma.gd_datalake_file.findMany({
        where: params,
    });
    return (files === null || files === void 0 ? void 0 : files[0]) || null;
});
exports.findFileById = findFileById;
const createFile = (userId = 0, folderId = 0, fileName = "", fileContent = "", createdAt = "") => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.gd_datalake_file.create({
        data: {
            dl_file_name: fileName,
            dl_file_created_by: userId,
            dl_folder_id: folderId,
            dl_file_content: fileContent,
            dl_file_created_at: createdAt,
        },
    });
    return result;
});
exports.createFile = createFile;
const updateFile = (fileId = 0, folderId = 0, userId = 0, fileContent = "", updatedAt = "") => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield prisma.gd_datalake_file.update({
        where: {
            dl_file_id: fileId,
        },
        data: {
            dl_folder_id: folderId,
            dl_file_content: fileContent,
            dl_file_updated_at: updatedAt,
            dl_file_updated_by: userId,
        },
    });
    return file;
});
exports.updateFile = updateFile;
const deleteFile = (fileId = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.gd_datalake_file.update({
        where: {
            dl_file_id: fileId,
        },
        data: {
            dl_file_deleted: 1,
        },
    });
    return result;
});
exports.deleteFile = deleteFile;
