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
Object.defineProperty(exports, "__esModule", { value: true });
exports.rename = exports.detail = exports.deleteFile = exports.softDelete = exports.update = exports.updateOrCreateFile = exports.create = exports.listFiles = exports.get = void 0;
const errorHelper_1 = require("../helpers/errorHelper");
const baseValidator_1 = require("../helpers/baseValidator");
const file_1 = require("../models/file");
const project_1 = require("../models/project");
const workflow_1 = require("../models/workflow");
const env = __importStar(require("env-var"));
const DIR_DIGDAG = env.get("DIR_DIGDAG").asString();
function requireData(res, projectId, workflowId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.requireParam)(res, projectId, "project_id_required", "project.id.required", "Project id is required") ||
            !(0, baseValidator_1.requireParam)(res, workflowId, "workflow_id_required", "workflow.id.required", "Workflow id is required")) {
            return false;
        }
        return true;
    });
}
function requireDataFile(res, projectName, workflowId, filenName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.requireParam)(res, projectName, "project_name_required", "project.name.required", "Project name is required") ||
            !(0, baseValidator_1.requireParam)(res, workflowId, "workflow_name_required", "workflow.name.required", "Workflow name is required") ||
            !(0, baseValidator_1.requireParam)(res, filenName, "file_name_required", "file.name.required", "File name is required")) {
            return false;
        }
        return true;
    });
}
function checkWorfkflowId(res, id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.checkNumber)(res, id, "workflow_id_invalid", "workflow.id.invalid", "Workflow id must be number")) {
            return false;
        }
        return true;
    });
}
function checkWorkflowNotExist(res, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let workflow = yield (0, workflow_1.findById)(id);
        if (!workflow) {
            (0, errorHelper_1.setError)(res, 400, "workflow_not_exist", "workflow.not.exist", "Workflow not exists");
            return false;
        }
        return true;
    });
}
function requireNewName(res, name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.requireParam)(res, name, "name_required", "name.required", "New name is required")) {
            return false;
        }
        return true;
    });
}
function checkFileId(res, id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.checkNumber)(res, id, "file_id_invalid", "file.id.invalid", "File id must be number")) {
            return false;
        }
        return true;
    });
}
function checkProjectId(res, id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.checkNumber)(res, id, "project_id_invalid", "project.id.invalid", "Project id must be number")) {
            return false;
        }
        return true;
    });
}
function checkWokflowId(res, id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.checkNumber)(res, id, "workflow_id_invalid", "workflow.id.invalid", "Workflow id must be number")) {
            return false;
        }
        return true;
    });
}
function checkProjectExist(res, projectName, fileName, workflowId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fileName) {
            let file = yield (0, file_1.findFile)(workflowId, fileName);
            if (file) {
                (0, errorHelper_1.setError)(res, 400, "file_exist", "file.exist", "File already exists");
                return false;
            }
        }
        return true;
    });
}
function checkFileExist(res, path) {
    return __awaiter(this, void 0, void 0, function* () {
        let file = yield (0, file_1.findByPath)(path);
        if (file) {
            (0, errorHelper_1.setError)(res, 400, "file_exist", "file.exist", "File already exists");
            return false;
        }
        return true;
    });
}
function checkProjectNotExist(res, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        let project = yield (0, project_1.findById)(projectId);
        if (!project) {
            (0, errorHelper_1.setError)(res, 400, "project_not_exist", "project.not.exist", "Project not exists");
            return false;
        }
        return true;
    });
}
function checkFileNotExist(res, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let file = yield (0, file_1.findById)(id);
        if (!file) {
            (0, errorHelper_1.setError)(res, 400, "file_not_exist", "file.not.exist", "File not exists");
            return false;
        }
        return true;
    });
}
function checkFileName(res, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        let arr = fileName.split("/");
        if (arr.length > 1) {
            (0, errorHelper_1.setError)(res, 400, "file_name_invalid", "file.name.invalid", "File name invalid");
            return false;
        }
        return true;
    });
}
function checkPathUpdateExist(req, res, fileId, newName) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let file = yield (0, file_1.findById)(fileId);
        if (file) {
            let project = yield (0, project_1.findById)(file.project_id);
            if (project) {
                let dir = (_a = file.file_path) !== null && _a !== void 0 ? _a : "";
                let arr = dir.split("/");
                let count = arr.length - 1;
                let arr1 = arr[count].split(".");
                let count1 = arr1.length - 1;
                let check = newName.split(".");
                if (check.length > 1) {
                    arr[count] = newName;
                }
                else {
                    arr1[0] = newName;
                    arr[count] = arr1.join(".");
                }
                let path = arr.join("/");
                let checkPath = yield (0, file_1.findByPathUpdate)(fileId, path);
                if (checkPath) {
                    (0, errorHelper_1.setError)(res, 400, "file_name_exist", "file.name.exist", "Duplicate filenames");
                    return false;
                }
                req.body.projectName = project.project_name;
                req.body.oldPath = dir;
                req.body.newPath = path;
                return true;
            }
        }
        (0, errorHelper_1.setError)(res, 400, "file_not_exist", "file.not.exist", "File not exists");
        return false;
    });
}
function get(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let projectId = (_a = req.query.projectId) !== null && _a !== void 0 ? _a : "";
        let workflowId = (_b = req.query.workflowId) !== null && _b !== void 0 ? _b : "";
        if (!(yield requireData(res, projectId, workflowId)) ||
            !(yield checkProjectId(res, projectId)) ||
            !(yield checkProjectNotExist(res, projectId)) ||
            !(yield checkWokflowId(res, workflowId)) ||
            !(yield checkWorkflowNotExist(res, workflowId.toString()))) {
            return false;
        }
        return true;
    });
}
exports.get = get;
function listFiles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { projectName = "", workflowName = "" } = req.query;
        if (!(0, baseValidator_1.requireParam)(res, projectName, "project_name_required", "project.name.required", "Project name is required") ||
            !(0, baseValidator_1.requireParam)(res, workflowName, "workflow_name_required", "workflow.name.required", "Workflow name is required")) {
            return false;
        }
        return true;
    });
}
exports.listFiles = listFiles;
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fileName, projectName, workflowId } = req.body;
        if (!(yield requireData(res, projectName, workflowId)) ||
            !(yield checkWorfkflowId(res, workflowId)) ||
            !(yield checkWorkflowNotExist(res, workflowId)) ||
            !(yield checkProjectExist(res, projectName, fileName, workflowId))) {
            return false;
        }
        return true;
    });
}
exports.create = create;
function updateOrCreateFile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fileName, projectName, workflowName } = req.body;
        if (!(yield requireDataFile(res, projectName, workflowName, fileName))) {
            return false;
        }
        return true;
    });
}
exports.updateOrCreateFile = updateOrCreateFile;
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fileId } = req.params;
        if (!(yield checkFileId(res, fileId)) ||
            !(yield checkFileNotExist(res, fileId))) {
            return false;
        }
        return true;
    });
}
exports.update = update;
function requireDataDelete(res, projectId, workflowId, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.requireParam)(res, projectId, "project_id_required", "project.id.required", "Project id is required") ||
            !(0, baseValidator_1.requireParam)(res, workflowId, "workflow_id_required", "workflow.id.required", "Workflow id is required") ||
            !(0, baseValidator_1.requireParam)(res, fileName, "file_name_required", "file.name.required", "File name is required")) {
            return false;
        }
        return true;
    });
}
function findData(req, res, projectId, workflowId, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        let file = yield (0, file_1.find)(projectId, workflowId, fileName);
        if (file) {
            req.body.fileId = file.file_id;
            return true;
        }
        (0, errorHelper_1.setError)(res, 400, "file_not_found", "file.not.found", "File not found");
        return false;
    });
}
function softDelete(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { projectId, workflowId, fileName } = req.body;
        if (!(yield requireDataDelete(res, projectId, workflowId, fileName)) ||
            !(yield checkProjectId(res, projectId)) ||
            !(yield checkWokflowId(res, workflowId)) ||
            !(yield findData(req, res, projectId, workflowId, fileName))) {
            return false;
        }
        return true;
    });
}
exports.softDelete = softDelete;
function deleteFile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fileId = 0 } = req.params;
        if (!(yield checkFileNotExist(res, fileId))) {
            return false;
        }
        return true;
    });
}
exports.deleteFile = deleteFile;
function detail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fileId } = req.params;
        if (!(yield checkFileId(res, fileId)) ||
            !(yield checkFileNotExist(res, fileId))) {
            return false;
        }
        return true;
    });
}
exports.detail = detail;
function rename(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fileId } = req.params;
        let { newName } = req.body;
        if (!(yield checkProjectId(res, fileId)) ||
            !(yield checkFileNotExist(res, fileId)) ||
            !(yield requireNewName(res, newName)) ||
            !(yield checkFileName(res, newName)) ||
            !(yield checkPathUpdateExist(req, res, fileId, newName))) {
            return false;
        }
        return true;
    });
}
exports.rename = rename;
