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
const lodash_1 = __importDefault(require("lodash"));
const instance = axios_1.default.create({
    baseURL: process.env.DIGDAG_BASEURL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});
const listProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const result = await instance.get("/projects");
        // const temp = Array.isArray(result?.data?.projects)
        //   ? result?.data?.projects
        //   : [];
        // const now = new Date();
        // for (let i = 0; i < temp.length; i++) {
        //   const temp2 = await projectModel.findByName(temp[i]["name"]);
        //   if (!temp2) {
        //     await projectModel.store(
        //       temp[i]["name"],
        //       parseInt(temp[i]["id"]),
        //       temp[i]["revision"],
        //       now.toISOString(),
        //       1
        //     );
        //   } else {
        //     await projectModel.update(
        //       temp2["project_id"],
        //       temp[i]["revision"],
        //       temp[i]["updatedAt"],
        //       1,
        //       parseInt(temp[i]["id"])
        //     );
        //   }
        // }
        // const result = await instance.get("/workflows");
        // const temp = Array.isArray(result?.data?.workflows)
        //   ? result?.data?.workflows
        //   : [];
        // const now = new Date();
        // for (let i = 0; i < temp.length; i++) {
        //   const project = await projectModel.findById(temp[i]["project"]["id"]);
        //   if (!project) {
        //     console.log(temp);
        //     continue;
        //   }
        //   const temp2 = await workflowModel.findByName(
        //     temp[i]["name"],
        //     project.project_id
        //   );
        //   if (!temp2) {
        //     await workflowModel.store(
        //       temp[i]["name"],
        //       project.project_id,
        //       now.toISOString(),
        //       1,
        //       parseInt(temp[i]["id"])
        //     );
        //   } else {
        //     await workflowModel.update(
        //       temp2["workflow_id"],
        //       parseInt(temp[i]["id"])
        //     );
        //   }
        // }
        return res.end(123);
    }
    catch (uncaughtException) {
        console.log(uncaughtException);
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const { projectName, revision } = req.query;
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
        const project = yield projectModel.findByName(projectName);
        if (project) {
            return (0, responseHelper_1.error)(res, "existed_project_name", 400, "existed_project_name", `Project name is existed`, null);
        }
        try {
            const result = yield instance.put(`/projects?project=${projectName}&revision=${revision}`, req.body, {
                headers: { "Content-Type": "application/gzip" },
            });
            if (!((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.message)) {
                yield projectModel.store((_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.name, parseInt((_c = result === null || result === void 0 ? void 0 : result.data) === null || _c === void 0 ? void 0 : _c.id), (_d = result === null || result === void 0 ? void 0 : result.data) === null || _d === void 0 ? void 0 : _d.revision, now.toISOString(), parseInt(ob.id));
            }
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result.data));
        }
        catch (err) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify((_e = err === null || err === void 0 ? void 0 : err.response) === null || _e === void 0 ? void 0 : _e.data));
        }
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, "request_failed", 500, "request.failed", uncaughtException);
    }
});
exports.default = {
    listProjects,
    createProject,
};
