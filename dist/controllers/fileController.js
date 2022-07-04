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
const fileModel = __importStar(require("../models/file"));
const workflowModel = __importStar(require("../models/workflow"));
const projectModel = __importStar(require("../models/project"));
const fileValidator = __importStar(require("../validators/fileValidator"));
const errorHelper_1 = require("../helpers/errorHelper");
const dataHelper_1 = require("../helpers/dataHelper");
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const instance = axios_1.default.create({
    baseURL: process.env.DIGDAG_BASEURL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});
const updateOrCreateFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!(yield fileValidator.updateOrCreateFile(req, res))) {
            return (0, errorHelper_1.getError)(res);
        }
        let { ob, fileName, workflowName, projectName, projectRevision = (0, uuid_1.v4)(), fileId = 0, } = req.body;
        const now = new Date();
        const { id } = ob;
        const createBy = id.toString();
        const proj = yield projectModel.findByName(projectName);
        if (proj) {
            yield projectModel.update(proj.project_id, projectRevision, now.toISOString(), parseInt(ob.id), proj.digdag_project_id);
        }
        const workflow = yield workflowModel.findByNameAndProjectId(workflowName, proj === null || proj === void 0 ? void 0 : proj.project_id);
        if (!workflow) {
            const result2 = yield instance.get(`/projects/${proj.digdag_project_id}/workflows/${workflowName}`);
            if (!((_a = result2 === null || result2 === void 0 ? void 0 : result2.data) === null || _a === void 0 ? void 0 : _a.message)) {
                yield workflowModel.store(workflowName, proj.project_id, now.toISOString(), parseInt(ob.id), (_b = result2 === null || result2 === void 0 ? void 0 : result2.data) === null || _b === void 0 ? void 0 : _b.id);
            }
        }
        const currFile = yield fileModel.findById(fileId);
        let file = null;
        if (!currFile) {
            file = yield fileModel.store(fileName, proj === null || proj === void 0 ? void 0 : proj.project_id, workflow === null || workflow === void 0 ? void 0 : workflow.workflow_id, now.toISOString(), createBy);
        }
        else {
            file = yield fileModel.renameFile(fileId, fileName);
        }
        return (0, responseHelper_1.success)(res, "create_file_success", "create.success", "Create file success", file);
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
const deleteFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield fileValidator.deleteFile(req, res))) {
            return (0, errorHelper_1.getError)(res);
        }
        let { fileId = 0 } = req.params;
        const date = new Date();
        let deleteDate = date;
        let file = yield fileModel.softDelete(fileId, deleteDate);
        return (0, responseHelper_1.success)(res, "delete_file_success", "delete.success", "Request successful", file);
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
const listFiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield fileValidator.listFiles(req, res))) {
            return (0, errorHelper_1.getError)(res);
        }
        let { projectName = "", workflowName = "" } = req.query;
        let files = [];
        let proj = yield projectModel.findByName(`${projectName}`);
        if (proj) {
            let workflow = yield workflowModel.findByNameAndProjectId(`${workflowName}`, proj === null || proj === void 0 ? void 0 : proj.project_id);
            if (workflow) {
                files = yield fileModel.getListFile(proj === null || proj === void 0 ? void 0 : proj.project_id, workflow === null || workflow === void 0 ? void 0 : workflow.workflow_id);
            }
        }
        return (0, dataHelper_1.getList)(res, files, "list_files", "get_file_success", "get_file_success", "Request successful");
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
exports.default = {
    listFiles,
    deleteFile,
    updateOrCreateFile,
};
