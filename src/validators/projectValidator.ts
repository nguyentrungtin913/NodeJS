import { findByName as findProjectByName, findById as findProjectById } from '../models/project';
import { requireParam, checkNumber } from '../helpers/baseValidator';
import { Request, Response, NextFunction } from "express";
import { setError } from '../helpers/errorHelper';

async function requireName(res: Response, projectName: string) {
    if (!requireParam(res, projectName, 'param_required', 'project.name.required', 'Project name is required')) {
        return false;
    }
    return true;
}

async function checkId(res: Response, projectId: string) {
    if (!checkNumber(res, projectId, 'param_invalid', 'project.id.invalid', 'Project id must be number')) {
        return false;
    }
    return true;
}
async function requireId(res: Response, projectId: any) {
    if (!requireParam(res, projectId, 'param_required', 'project_id.required', 'Project id is required')) {
        return false;
    }
    return true;
}
async function checkProjectExistByName(res: Response, projectName: string) {
    let project = await findProjectByName(projectName);
    if (project) {
        setError(res, 400, "project_exist", "project.exist", "Project already exists");
        return false;
    }
    return true;
}

async function checkProjectExistById(res: Response, projectId: any) {
    let project = await findProjectById(projectId);
    if (!project) {
        setError(res, 400, "project_not_exist", "project.not.exist", "Project not exist");
        return false;
    }
    return true;
}
export async function create(req: Request, res: Response) {
    let { projectName } = req.body;
    if (! await requireName(res, projectName) || !await checkProjectExistByName(res, projectName)) {
        return false;
    }
    return true;
}

export async function softDelete(req: Request, res: Response) {
    let { projectId } = req.params;
    if (! await requireId(res, projectId) || ! await checkId(res, projectId) || !await checkProjectExistById(res, projectId)) {
        return false;
    }
    return true;
}