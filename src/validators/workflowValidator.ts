import { Request, Response, NextFunction } from "express";
import { setError } from '../helpers/errorHelper';
import { requireParam, checkNumber } from '../helpers/baseValidator';
import { findById as findProjectById, findByName as findProjcetByNameModel } from '../models/project';
import { findByName as findWorkflowByName, findById as findWorkflowByIdModel } from '../models/workflow';
import fs from 'fs';
import * as env from 'env-var';
import shell from 'shelljs';

const DIR_DIGDAG = env.get('DIR_DIGDAG').asString();

async function requireData(res: Response, projectId: any) {
    if (!requireParam(res, projectId, 'param_required', 'project.id.required', 'Project id is required')) {
        return false;
    }
    return true;
}

async function checkProjectId(res: Response, id: any) {
    if (!checkNumber(res, id, "param_invalid", "project.id.invalid", "Project id must be number")) {
        return false;
    }
    return true;
}

async function requireWorkflowId(res: Response, workflowId: any) {
    if (!requireParam(res, workflowId, 'param_required', 'workflow.id.required', 'Workflow id is required')) {
        return false;
    }
    return true;
}

async function checkWorkflowId(res: Response, id: any) {
    if (!checkNumber(res, id, "param_invalid", "workflow.id.invalid", "Workflow id must be number")) {
        return false;
    }
    return true;
}

async function checkWorkflowExist(res: Response, id: any) {
    let project = await findWorkflowByIdModel(id);
    if (!project) {
        setError(res, 400, "workflow_not_exist", "workflow.not.exist", "Workflow not exist");
        return false;
    }
    return true;
}

async function checkProjectExist(req: Request, res: Response, id: any, workflowName: string) {
    let project = await findProjectById(id);
    if (!project) {
        setError(res, 400, "project_not_exist", "project.not.exist", "Project not exist");
        return false;
    }
    if (workflowName) {
        let arr = workflowName.split(".");
        if (arr.length == 1) {
            workflowName += ".dig";
        }
        shell.cd(DIR_DIGDAG);
        if (fs.existsSync(project.project_name + "/" + workflowName)) {
            setError(res, 400, "path_exist", "path.exist", "The path exist");
            return false;
        }
    }
    req.body.projectName = project.project_name;
    return true;
}
async function checkProjectIdExist(res: Response, id: any) {
    let project = await findProjectById(id);
    if (!project) {
        setError(res, 400, "project_not_exist", "project.not.exist", "Project not exist");
        return false;
    }
    return true;
}

async function checkNameExist(res: Response, workflowName: string, projectName: string) {
    let project = await findProjcetByNameModel(projectName);
    if (project) {
        if (workflowName) {
            let arr = workflowName.split(".");
            if (arr.length == 1) {
                workflowName += ".dig";
            }
            let workflow = await findWorkflowByName(workflowName, project.project_id);
            if (workflow) {
                setError(res, 400, "workflow_name_exist", "workflow.name.exist", "Workflow name already exists");
                return false;
            }
        }
    }
    return true;
}

async function requireName(res: Response, projectName: string) {
    if (!requireParam(res, projectName, 'project_name_required', 'project.name.required', 'Project name is required')) {
        return false;
    }
    return true;
}

export async function create(req: Request, res: Response) {
    let { workflowName, projectName } = req.body;

    if (! await requireName(res, projectName) || ! await checkNameExist(res, workflowName, projectName)) {
        return false;
    }
    return true;
}

export async function softDelete(req: Request, res: Response) {
    let { workflowId } = req.params;

    if (! await requireWorkflowId(res, workflowId) || !await checkWorkflowId(res, workflowId) || ! await checkWorkflowExist(res, workflowId)) {
        return false;
    }
    return true;
}

export async function get(req: Request, res: Response) {
    let { projectId } = req.query;

    if (! await requireData(res, projectId) || !await checkProjectId(res, projectId) || ! await checkProjectIdExist(res, projectId)) {
        return false;
    }
    return true;
}