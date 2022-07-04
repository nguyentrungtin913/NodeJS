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
exports.softDelete = exports.store = exports.findByNameAndProjectId = exports.findByName = exports.update = exports.findById = exports.getByProjectId = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function getByProjectId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const workflows = yield prisma.gd_workflow.findMany({
            where: {
                project_id: parseInt(id),
                workflow_delete: 0,
            },
            include: {
                project: true,
            },
        });
        return workflows;
    });
}
exports.getByProjectId = getByProjectId;
function findById(id) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const workflows = yield prisma.gd_workflow.findMany({
            where: {
                workflow_id: parseInt(id),
                workflow_delete: 0,
            },
            include: {
                project: true,
            },
        });
        let workflow = (_a = workflows[0]) !== null && _a !== void 0 ? _a : null;
        return workflow;
    });
}
exports.findById = findById;
function update(workflowId, digdagWorkflowId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.gd_workflow.update({
            where: {
                workflow_id: workflowId,
            },
            data: {
                digdag_workflow_id: digdagWorkflowId,
            },
        });
        return result;
    });
}
exports.update = update;
function findByName(name, proId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const workflows = yield prisma.gd_workflow.findMany({
            where: {
                project_id: parseInt(proId),
                workflow_name: name,
                workflow_delete: 0,
            },
            include: {
                project: true,
            },
        });
        let workflow = (_a = workflows[0]) !== null && _a !== void 0 ? _a : null;
        return workflow;
    });
}
exports.findByName = findByName;
function findByNameAndProjectId(name, projectId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const workflows = yield prisma.gd_workflow.findMany({
            where: {
                workflow_name: name,
                project_id: parseInt(projectId),
                workflow_delete: 0,
            },
            include: {
                project: true,
            },
        });
        let workflow = (_a = workflows[0]) !== null && _a !== void 0 ? _a : null;
        return workflow;
    });
}
exports.findByNameAndProjectId = findByNameAndProjectId;
function store(name, projectId, createDate, createBy, digdagWorkflowId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.gd_workflow.create({
            data: {
                workflow_name: name,
                project_id: projectId,
                workflow_create_date: createDate,
                workflow_create_by: createBy,
                digdag_workflow_id: digdagWorkflowId,
            },
        });
        return result;
    });
}
exports.store = store;
function softDelete(workflowId, updateDelete) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.gd_workflow.update({
            data: {
                workflow_delete: 1,
                workflow_delete_at: updateDelete,
            },
            where: {
                workflow_id: parseInt(workflowId),
            },
        });
        return result;
    });
}
exports.softDelete = softDelete;
