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
exports.deleteFolder = exports.updateFolder = exports.createFolder = exports.findFolderById = exports.listFolders = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const listFolders = (userId = 0, parentFolderId = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        dl_folder_deleted: 0,
        dl_folder_created_by: userId,
    };
    if (parentFolderId > 0) {
        params["dl_parent_folder_id"] = parentFolderId;
    }
    const folders = yield prisma.gd_datalake_folder.findMany({
        where: params,
        include: {
            files: {
                where: {
                    dl_file_deleted: 0,
                },
            },
        },
    });
    return folders;
});
exports.listFolders = listFolders;
const findFolderById = (folderId = 0, userId = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        dl_folder_deleted: 0,
        dl_folder_created_by: userId,
        dl_folder_id: folderId,
    };
    const folders = yield prisma.gd_datalake_folder.findMany({
        where: params,
    });
    return (folders === null || folders === void 0 ? void 0 : folders[0]) || null;
});
exports.findFolderById = findFolderById;
const createFolder = (userId = 0, parentFolderId = 0, folderName = "", createdAt = "") => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.gd_datalake_folder.create({
        data: {
            dl_folder_name: folderName,
            dl_folder_created_by: userId,
            dl_parent_folder_id: parentFolderId,
            dl_folder_created_at: createdAt,
        },
    });
    return result;
});
exports.createFolder = createFolder;
const updateFolder = (folderId = 0, folderName = "", updatedAt = "") => __awaiter(void 0, void 0, void 0, function* () {
    const folder = yield prisma.gd_datalake_folder.update({
        where: {
            dl_folder_id: folderId,
        },
        data: {
            dl_folder_name: folderName,
            dl_folder_updated_at: updatedAt,
        },
    });
    return folder;
});
exports.updateFolder = updateFolder;
const deleteFolder = (folderId = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.$transaction([
        prisma.gd_datalake_folder.update({
            where: {
                dl_folder_id: folderId,
            },
            data: {
                dl_folder_deleted: 1,
            },
        }),
        prisma.gd_datalake_file.updateMany({
            where: {
                dl_folder_id: folderId,
            },
            data: {
                dl_file_deleted: 1,
            },
        }),
    ]);
    return result;
});
exports.deleteFolder = deleteFolder;
