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
const datalakeFileModel = __importStar(require("../models/datalake_file"));
const lodash_1 = __importDefault(require("lodash"));
const axios_1 = __importDefault(require("axios"));
const listFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ob } = req.body;
        const { folderId = "" } = req.params;
        if (!lodash_1.default.isString(folderId) || !lodash_1.default.isInteger(parseInt(folderId))) {
            return (0, responseHelper_1.error)(res, "invalid_folder_id", 400, "invalid_folder_id", `Folder Id is invalid`, null);
        }
        const folders = yield datalakeFileModel.listFiles(parseInt(ob.id), parseInt(folderId));
        return (0, dataHelper_1.getList)(res, folders, "folders", "list_files_success", "list_folder_success", "List folders successful");
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
const detailFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ob } = req.body;
        const { folderId = "", fileId = "" } = req.params;
        if (!lodash_1.default.isString(folderId) || !lodash_1.default.isInteger(parseInt(folderId))) {
            return (0, responseHelper_1.error)(res, "invalid_folder_id", 400, "invalid_folder_id", `Folder Id is invalid`, null);
        }
        if (!lodash_1.default.isString(fileId) || !lodash_1.default.isInteger(parseInt(fileId))) {
            return (0, responseHelper_1.error)(res, "invalid_file_id", 400, "invalid_file_id", `File Id is invalid`, null);
        }
        const datalakeFile = yield datalakeFileModel.findFileById(parseInt(ob.id), parseInt(folderId), parseInt(fileId));
        if (datalakeFile) {
            return (0, responseHelper_1.success)(res, "get_file_succcess", "get_file_succcess", `Get file #${fileId} successfully`, datalakeFile);
        }
        return (0, responseHelper_1.error)(res, "not_found_file", 404, "not_found_file", `Not found file #${fileId}`, null);
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
const createFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileName, ob } = req.body;
        const { folderId = "" } = req.params;
        if (!lodash_1.default.isString(folderId) || !lodash_1.default.isInteger(parseInt(folderId))) {
            return (0, responseHelper_1.error)(res, "invalid_folder_id", 400, "invalid_folder_id", `Folder Id is invalid`, null);
        }
        const now = new Date();
        const newDatalakeFile = yield datalakeFileModel.createFile(parseInt(ob.id), parseInt(folderId), fileName, "", now.toISOString());
        if (newDatalakeFile) {
            return (0, responseHelper_1.success)(res, "create_file_success", "create_file_success", `Create file successfully`, newDatalakeFile);
        }
        return (0, responseHelper_1.error)(res, "create_file_failed", 400, "create_file_failed", `Create file failed`, null);
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
const updateFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ob, fileContent = "" } = req.body;
        const { folderId = "", fileId = "" } = req.params;
        if (!lodash_1.default.isString(fileContent)) {
            return (0, responseHelper_1.error)(res, "invalid_file_content", 400, "invalid_file_content", `Folder Content is invalid`, null);
        }
        if (!lodash_1.default.isString(folderId) || !lodash_1.default.isInteger(parseInt(folderId))) {
            return (0, responseHelper_1.error)(res, "invalid_folder_id", 400, "invalid_folder_id", `Folder Id is invalid`, null);
        }
        if (!lodash_1.default.isString(fileId) || !lodash_1.default.isInteger(parseInt(fileId))) {
            return (0, responseHelper_1.error)(res, "invalid_file_id", 400, "invalid_file_id", `File Id is invalid`, null);
        }
        const datalakeFile = yield datalakeFileModel.findFileById(parseInt(ob.id), parseInt(folderId), parseInt(fileId));
        if (!datalakeFile) {
            return (0, responseHelper_1.error)(res, "not_found_file", 404, "not_found_file", `Not found file #${fileId}`, null);
        }
        const now = new Date();
        const result = yield datalakeFileModel.updateFile(parseInt(fileId), parseInt(folderId), parseInt(ob.id), fileContent, now.toISOString());
        if (result) {
            return (0, responseHelper_1.success)(res, "update_file_success", "update_file_success", `Update file successfully`, result);
        }
        return (0, responseHelper_1.error)(res, "update_file_failed", 400, "update_file_failed", `Update file failed`, null);
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { folderId = "", fileId = "" } = req.params;
        const { ob } = req.body;
        if (!lodash_1.default.isString(folderId) || !lodash_1.default.isInteger(parseInt(folderId))) {
            return (0, responseHelper_1.error)(res, "invalid_folder_id", 400, "invalid_folder_id", `Folder Id is invalid`, null);
        }
        if (!lodash_1.default.isString(fileId) || !lodash_1.default.isInteger(parseInt(fileId))) {
            return (0, responseHelper_1.error)(res, "invalid_file_id", 500, "invalid_file_id", `File Id is invalid`, null);
        }
        const datalakeFile = yield datalakeFileModel.findFileById(parseInt(ob.id), parseInt(folderId), parseInt(fileId));
        if (!datalakeFile) {
            return (0, responseHelper_1.error)(res, "not_found_file", 404, "not_found_file", `Not found file #${fileId}`, null);
        }
        const result = yield datalakeFileModel.deleteFile(parseInt(fileId));
        if (result) {
            return (0, responseHelper_1.success)(res, "delete_file_success", "delete_file_success", `Delete file #${fileId} successfully`, null);
        }
        return (0, responseHelper_1.error)(res, "delete_file_failed", 400, "delete_file_failed", `Delete file #${fileId} failed`, null);
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
const instance = axios_1.default.create({
    baseURL: process.env.DATALAKE_QUERY_BASEURL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});
const forward = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uri = req.url.replace("/datalake-query", "");
    if (req.method === "GET") {
        instance
            .get(uri, { params: req.query })
            .then((response) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(response.data)); // <= send data to the client
        })
            .catch((err) => {
            var _a;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) || {})); // <= send error
        });
    }
    else if (req.method === "POST") {
        instance
            .post(uri, req.body)
            .then((response) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(response.data));
        })
            .catch((err) => {
            var _a;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) || {})); // <= send error
        });
    }
});
exports.default = {
    listFiles,
    detailFile,
    createFile,
    updateFile,
    deleteFile,
    forward,
};
