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
const responseHelper_1 = require("../helpers/responseHelper");
const dataHelper_1 = require("../helpers/dataHelper");
const datalakeFolderModel = __importStar(require("../models/datalake_folder"));
const lodash_1 = __importDefault(require("lodash"));
const listFolders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ob } = req.body;
        const { parentFolderId = "" } = req.query;
        if (parentFolderId &&
            (!lodash_1.default.isString(parentFolderId) || !lodash_1.default.isInteger(parseInt(parentFolderId)))) {
            return (0, responseHelper_1.error)(res, "invalid_parent_folder_id", 400, "invalid_parent_folder_id", `Parent Folder Id is invalid`, null);
        }
        const folders = yield datalakeFolderModel.listFolders(parseInt(ob.id), parseInt(parentFolderId));
        return (0, dataHelper_1.getList)(res, folders, "folders", "list_folders_success", "list_folder_success", "List folders successful");
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
const createFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { folderName, parentFolderId = 0, ob } = req.body;
        if (!folderName) {
            return (0, responseHelper_1.error)(res, "invalid_folder_name", 400, "invalid_folder_name", `Folder Name is invalid`, null);
        }
        if (parentFolderId &&
            (!lodash_1.default.isString(parentFolderId) || !lodash_1.default.isInteger(parseInt(parentFolderId)))) {
            return (0, responseHelper_1.error)(res, "invalid_parent_folder_id", 400, "invalid_parent_folder_id", `Parent Folder Id is invalid`, null);
        }
        const now = new Date();
        const newDatalakeFolder = yield datalakeFolderModel.createFolder(parseInt(ob.id), parseInt(parentFolderId), folderName, now.toISOString());
        if (newDatalakeFolder) {
            return (0, responseHelper_1.success)(res, "create_folder_success", "create_folder_success", `Create folder successfully`, newDatalakeFolder);
        }
        return (0, responseHelper_1.error)(res, "create_folder_failed", 400, "create_folder_failed", `Create folder failed`, null);
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
const deleteFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folderId = "" } = req.params;
    try {
        const { ob } = req.body;
        if (!lodash_1.default.isInteger(parseInt(folderId))) {
            return (0, responseHelper_1.error)(res, "invalid_folder_id", 400, "invalid_folder_id", `Folder Id is invalid`, null);
        }
        const folder = yield datalakeFolderModel.findFolderById(parseInt(folderId), parseInt(ob.id));
        if (!folder) {
            return (0, responseHelper_1.error)(res, "not_found_folder", 404, "not_found_folder", `Not found folder #${folderId}`, null);
        }
        yield datalakeFolderModel.deleteFolder(parseInt(folderId));
        return (0, responseHelper_1.success)(res, "delete_folder_success", "delete_folder_success", `Delete folder #${folderId} successfully`, null);
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.error)(res, "delete_folder_failed", 400, "delete_folder_failed", `Delete folder #${folderId} failed`, null);
    }
});
exports.default = { listFolders, createFolder, deleteFolder };
