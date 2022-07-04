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
const axios_1 = __importDefault(require("axios"));
const responseHelper_1 = require("../helpers/responseHelper");
const projectModel = __importStar(require("../models/project"));
const workflowModel = __importStar(require("../models/workflow"));
const lodash_1 = __importDefault(require("lodash"));
const instance = axios_1.default.create({
    baseURL: process.env.DIGDAG_BASEURL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const { projectName, revision, workflowName } = req.query;
        const { ob } = req.body;
        const now = new Date();
        if (!projectName) {
            return (0, responseHelper_1.error)(res, "required_project_name", 400, "required_project_name", `Project name is required`, null);
        }
        if (!lodash_1.default.isString(projectName)) {
            return (0, responseHelper_1.error)(res, "invalid_project_name", 400, "invalid_project_name", `Project name is invalid`, null);
        }
        if (!revision) {
            return (0, responseHelper_1.error)(res, "required_project_revision", 400, "required_project_revision", `Project revision is required`, null);
        }
        if (!lodash_1.default.isString(revision)) {
            return (0, responseHelper_1.error)(res, "invalid_project_revision", 400, "invalid_project_revision", `Project revision is invalid`, null);
        }
        if (!workflowName) {
            return (0, responseHelper_1.error)(res, "required_workflow_name", 400, "required_workflow_name", `Workflow name is required`, null);
        }
        if (!lodash_1.default.isString(workflowName)) {
            return (0, responseHelper_1.error)(res, "invalid_workflow_name", 400, "invalid_workflow_name", `Workflow name is invalid`, null);
        }
        const project = yield projectModel.findByName(projectName);
        if (!project) {
            return (0, responseHelper_1.error)(res, "not_existed_project", 400, "not_existed_project", `Project is not existed`, null);
        }
        try {
            const result = yield instance.put(`/projects?project=${projectName}&revision=${revision}`, req.body, {
                headers: { "Content-Type": "application/gzip" },
            });
            if (!((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.message)) {
                yield projectModel.update(project.project_id, (_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.revision, now.toISOString(), parseInt(ob.id), parseInt((_c = result === null || result === void 0 ? void 0 : result.data) === null || _c === void 0 ? void 0 : _c.id));
                const result2 = yield instance.get(`/projects/${project.digdag_project_id}/workflows/${workflowName}`);
                if (!((_d = result2 === null || result2 === void 0 ? void 0 : result2.data) === null || _d === void 0 ? void 0 : _d.message)) {
                    yield workflowModel.store(workflowName, project.project_id, now.toISOString(), parseInt(ob.id), (_e = result2 === null || result2 === void 0 ? void 0 : result2.data) === null || _e === void 0 ? void 0 : _e.id);
                }
            }
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result.data));
        }
        catch (err) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify((_f = err === null || err === void 0 ? void 0 : err.response) === null || _f === void 0 ? void 0 : _f.data));
        }
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
exports.default = {
    createProject,
};
