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
exports.softDelete = exports.create = void 0;
const project_1 = require("../models/project");
const baseValidator_1 = require("../helpers/baseValidator");
const errorHelper_1 = require("../helpers/errorHelper");
function requireName(res, projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.requireParam)(res, projectName, 'param_required', 'project.name.required', 'Project name is required')) {
            return false;
        }
        return true;
    });
}
function checkId(res, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.checkNumber)(res, projectId, 'param_invalid', 'project.id.invalid', 'Project id must be number')) {
            return false;
        }
        return true;
    });
}
function requireId(res, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.requireParam)(res, projectId, 'param_required', 'project_id.required', 'Project id is required')) {
            return false;
        }
        return true;
    });
}
function checkProjectExistByName(res, projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        let project = yield (0, project_1.findByName)(projectName);
        if (project) {
            (0, errorHelper_1.setError)(res, 400, "project_exist", "project.exist", "Project already exists");
            return false;
        }
        return true;
    });
}
function checkProjectExistById(res, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        let project = yield (0, project_1.findById)(projectId);
        if (!project) {
            (0, errorHelper_1.setError)(res, 400, "project_not_exist", "project.not.exist", "Project not exist");
            return false;
        }
        return true;
    });
}
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { projectName } = req.body;
        if (!(yield requireName(res, projectName)) || !(yield checkProjectExistByName(res, projectName))) {
            return false;
        }
        return true;
    });
}
exports.create = create;
function softDelete(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { projectId } = req.params;
        if (!(yield requireId(res, projectId)) || !(yield checkId(res, projectId)) || !(yield checkProjectExistById(res, projectId))) {
            return false;
        }
        return true;
    });
}
exports.softDelete = softDelete;
