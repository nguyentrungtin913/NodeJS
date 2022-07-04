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
exports.get = exports.softDelete = exports.create = void 0;
const errorHelper_1 = require("../helpers/errorHelper");
const baseValidator_1 = require("../helpers/baseValidator");
const project_1 = require("../models/project");
const workflow_1 = require("../models/workflow");
const fs_1 = __importDefault(require("fs"));
const env = __importStar(require("env-var"));
const shelljs_1 = __importDefault(require("shelljs"));
const DIR_DIGDAG = env.get('DIR_DIGDAG').asString();
function requireData(res, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.requireParam)(res, projectId, 'param_required', 'project.id.required', 'Project id is required')) {
            return false;
        }
        return true;
    });
}
function checkProjectId(res, id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.checkNumber)(res, id, "param_invalid", "project.id.invalid", "Project id must be number")) {
            return false;
        }
        return true;
    });
}
function requireWorkflowId(res, workflowId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.requireParam)(res, workflowId, 'param_required', 'workflow.id.required', 'Workflow id is required')) {
            return false;
        }
        return true;
    });
}
function checkWorkflowId(res, id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.checkNumber)(res, id, "param_invalid", "workflow.id.invalid", "Workflow id must be number")) {
            return false;
        }
        return true;
    });
}
function checkWorkflowExist(res, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let project = yield (0, workflow_1.findById)(id);
        if (!project) {
            (0, errorHelper_1.setError)(res, 400, "workflow_not_exist", "workflow.not.exist", "Workflow not exist");
            return false;
        }
        return true;
    });
}
function checkProjectExist(req, res, id, workflowName) {
    return __awaiter(this, void 0, void 0, function* () {
        let project = yield (0, project_1.findById)(id);
        if (!project) {
            (0, errorHelper_1.setError)(res, 400, "project_not_exist", "project.not.exist", "Project not exist");
            return false;
        }
        if (workflowName) {
            let arr = workflowName.split(".");
            if (arr.length == 1) {
                workflowName += ".dig";
            }
            shelljs_1.default.cd(DIR_DIGDAG);
            if (fs_1.default.existsSync(project.project_name + "/" + workflowName)) {
                (0, errorHelper_1.setError)(res, 400, "path_exist", "path.exist", "The path exist");
                return false;
            }
        }
        req.body.projectName = project.project_name;
        return true;
    });
}
function checkProjectIdExist(res, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let project = yield (0, project_1.findById)(id);
        if (!project) {
            (0, errorHelper_1.setError)(res, 400, "project_not_exist", "project.not.exist", "Project not exist");
            return false;
        }
        return true;
    });
}
function checkNameExist(res, workflowName, projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        let project = yield (0, project_1.findByName)(projectName);
        if (project) {
            if (workflowName) {
                let arr = workflowName.split(".");
                if (arr.length == 1) {
                    workflowName += ".dig";
                }
                let workflow = yield (0, workflow_1.findByName)(workflowName, project.project_id);
                if (workflow) {
                    (0, errorHelper_1.setError)(res, 400, "workflow_name_exist", "workflow.name.exist", "Workflow name already exists");
                    return false;
                }
            }
        }
        return true;
    });
}
function requireName(res, projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, baseValidator_1.requireParam)(res, projectName, 'project_name_required', 'project.name.required', 'Project name is required')) {
            return false;
        }
        return true;
    });
}
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { workflowName, projectName } = req.body;
        if (!(yield requireName(res, projectName)) || !(yield checkNameExist(res, workflowName, projectName))) {
            return false;
        }
        return true;
    });
}
exports.create = create;
function softDelete(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { workflowId } = req.params;
        if (!(yield requireWorkflowId(res, workflowId)) || !(yield checkWorkflowId(res, workflowId)) || !(yield checkWorkflowExist(res, workflowId))) {
            return false;
        }
        return true;
    });
}
exports.softDelete = softDelete;
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { projectId } = req.query;
        if (!(yield requireData(res, projectId)) || !(yield checkProjectId(res, projectId)) || !(yield checkProjectIdExist(res, projectId))) {
            return false;
        }
        return true;
    });
}
exports.get = get;
