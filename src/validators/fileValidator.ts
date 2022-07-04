import { Request, Response } from "express";
import { setError } from "../helpers/errorHelper";
import { requireParam, checkNumber } from "../helpers/baseValidator";
import {
  findByPath as findFileByPath,
  findById as findFileById,
  findById as findFileByIdModel,
  findByPathUpdate,
  findFile as findFile,
  find,
} from "../models/file";
import { findById as findProjectById, findByName } from "../models/project";
import { findById as findWorkflowById } from "../models/workflow";
import * as env from "env-var";

const DIR_DIGDAG = env.get("DIR_DIGDAG").asString();
async function requireData(res: Response, projectId: any, workflowId: any) {
  if (
    !requireParam(
      res,
      projectId,
      "project_id_required",
      "project.id.required",
      "Project id is required"
    ) ||
    !requireParam(
      res,
      workflowId,
      "workflow_id_required",
      "workflow.id.required",
      "Workflow id is required"
    )
  ) {
    return false;
  }
  return true;
}

async function requireDataFile(
  res: Response,
  projectName: any,
  workflowId: any,
  filenName: any
) {
  if (
    !requireParam(
      res,
      projectName,
      "project_name_required",
      "project.name.required",
      "Project name is required"
    ) ||
    !requireParam(
      res,
      workflowId,
      "workflow_name_required",
      "workflow.name.required",
      "Workflow name is required"
    ) ||
    !requireParam(
      res,
      filenName,
      "file_name_required",
      "file.name.required",
      "File name is required"
    )
  ) {
    return false;
  }
  return true;
}

async function checkWorfkflowId(res: Response, id: any) {
  if (
    !checkNumber(
      res,
      id,
      "workflow_id_invalid",
      "workflow.id.invalid",
      "Workflow id must be number"
    )
  ) {
    return false;
  }
  return true;
}
async function checkWorkflowNotExist(res: Response, id: string) {
  let workflow = await findWorkflowById(id);
  if (!workflow) {
    setError(
      res,
      400,
      "workflow_not_exist",
      "workflow.not.exist",
      "Workflow not exists"
    );
    return false;
  }
  return true;
}

async function requireNewName(res: Response, name: string) {
  if (
    !requireParam(
      res,
      name,
      "name_required",
      "name.required",
      "New name is required"
    )
  ) {
    return false;
  }
  return true;
}

async function checkFileId(res: Response, id: any) {
  if (
    !checkNumber(
      res,
      id,
      "file_id_invalid",
      "file.id.invalid",
      "File id must be number"
    )
  ) {
    return false;
  }
  return true;
}

async function checkProjectId(res: Response, id: any) {
  if (
    !checkNumber(
      res,
      id,
      "project_id_invalid",
      "project.id.invalid",
      "Project id must be number"
    )
  ) {
    return false;
  }
  return true;
}

async function checkWokflowId(res: Response, id: any) {
  if (
    !checkNumber(
      res,
      id,
      "workflow_id_invalid",
      "workflow.id.invalid",
      "Workflow id must be number"
    )
  ) {
    return false;
  }
  return true;
}

async function checkProjectExist(
  res: Response,
  projectName: any,
  fileName: string,
  workflowId: any
) {
  if (fileName) {
    let file = await findFile(workflowId, fileName);

    if (file) {
      setError(res, 400, "file_exist", "file.exist", "File already exists");
      return false;
    }
  }
  return true;
}

// async function checkFileExist(res: Response, path: string) {
//   let file = await findFileByPath(path);
//   if (file) {
//     setError(res, 400, "file_exist", "file.exist", "File already exists");
//     return false;
//   }
//   return true;
// }

async function checkProjectNotExist(res: Response, projectId: any) {
  let project = await findProjectById(projectId);
  if (!project) {
    setError(
      res,
      400,
      "project_not_exist",
      "project.not.exist",
      "Project not exists"
    );
    return false;
  }
  return true;
}

async function checkFileNotExist(res: Response, id: any) {
  let file = await findFileById(id);
  if (!file) {
    setError(res, 400, "file_not_exist", "file.not.exist", "File not exists");
    return false;
  }
  return true;
}

async function checkFileName(res: Response, fileName: string) {
  let arr = fileName.split("/");
  if (arr.length > 1) {
    setError(
      res,
      400,
      "file_name_invalid",
      "file.name.invalid",
      "File name invalid"
    );
    return false;
  }
  return true;
}

async function checkPathUpdateExist(
  req: Request,
  res: Response,
  fileId: any,
  newName: string
) {
  let file = await findFileByIdModel(fileId);

  if (file) {
    let project = await findProjectById(file.project_id);
    if (project) {
      let dir = file.file_path ?? "";
      let arr = dir.split("/");

      let count = arr.length - 1;
      let arr1 = arr[count].split(".");

      let count1 = arr1.length - 1;
      let check = newName.split(".");
      if (check.length > 1) {
        arr[count] = newName;
      } else {
        arr1[0] = newName;
        arr[count] = arr1.join(".");
      }
      let path = arr.join("/");
      let checkPath = await findByPathUpdate(fileId, path);
      if (checkPath) {
        setError(
          res,
          400,
          "file_name_exist",
          "file.name.exist",
          "Duplicate filenames"
        );
        return false;
      }
      req.body.projectName = project.project_name;
      req.body.oldPath = dir;
      req.body.newPath = path;
      return true;
    }
  }
  setError(res, 400, "file_not_exist", "file.not.exist", "File not exists");
  return false;
}
export async function get(req: Request, res: Response) {
  let projectId = req.query.projectId ?? "";
  let workflowId = req.query.workflowId ?? "";
  if (
    !(await requireData(res, projectId, workflowId)) ||
    !(await checkProjectId(res, projectId)) ||
    !(await checkProjectNotExist(res, projectId)) ||
    !(await checkWokflowId(res, workflowId)) ||
    !(await checkWorkflowNotExist(res, workflowId.toString()))
  ) {
    return false;
  }
  return true;
}

export async function listFiles(req: Request, res: Response) {
  const { projectName = "", workflowName = "" } = req.query;
  if (
    !requireParam(
      res,
      projectName,
      "project_name_required",
      "project.name.required",
      "Project name is required"
    ) ||
    !requireParam(
      res,
      workflowName,
      "workflow_name_required",
      "workflow.name.required",
      "Workflow name is required"
    )
  ) {
    return false;
  }
  return true;
}

export async function create(req: Request, res: Response) {
  let { fileName, projectName, workflowId } = req.body;
  if (
    !(await requireData(res, projectName, workflowId)) ||
    !(await checkWorfkflowId(res, workflowId)) ||
    !(await checkWorkflowNotExist(res, workflowId)) ||
    !(await checkProjectExist(res, projectName, fileName, workflowId))
  ) {
    return false;
  }
  return true;
}

export async function updateOrCreateFile(req: Request, res: Response) {
  let { fileName, projectName, workflowName } = req.body;
  if (!(await requireDataFile(res, projectName, workflowName, fileName))) {
    return false;
  }
  return true;
}

export async function update(req: Request, res: Response) {
  let { fileId } = req.params;
  if (
    !(await checkFileId(res, fileId)) ||
    !(await checkFileNotExist(res, fileId))
  ) {
    return false;
  }
  return true;
}

async function requireDataDelete(
  res: Response,
  projectId: any,
  workflowId: any,
  fileName: string
) {
  if (
    !requireParam(
      res,
      projectId,
      "project_id_required",
      "project.id.required",
      "Project id is required"
    ) ||
    !requireParam(
      res,
      workflowId,
      "workflow_id_required",
      "workflow.id.required",
      "Workflow id is required"
    ) ||
    !requireParam(
      res,
      fileName,
      "file_name_required",
      "file.name.required",
      "File name is required"
    )
  ) {
    return false;
  }
  return true;
}

async function findData(
  req: Request,
  res: Response,
  projectId: any,
  workflowId: any,
  fileName: string
) {
  let file = await find(projectId, workflowId, fileName);
  if (file) {
    req.body.fileId = file.file_id;
    return true;
  }
  setError(res, 400, "file_not_found", "file.not.found", "File not found");
  return false;
}
export async function softDelete(req: Request, res: Response) {
  let { projectId, workflowId, fileName } = req.body;
  if (
    !(await requireDataDelete(res, projectId, workflowId, fileName)) ||
    !(await checkProjectId(res, projectId)) ||
    !(await checkWokflowId(res, workflowId)) ||
    !(await findData(req, res, projectId, workflowId, fileName))
  ) {
    return false;
  }
  return true;
}

export async function deleteFile(req: Request, res: Response) {
  let { fileId = 0 } = req.params;
  if (!(await checkFileNotExist(res, fileId))) {
    return false;
  }
  return true;
}

export async function detail(req: Request, res: Response) {
  let { fileId } = req.params;
  if (
    !(await checkFileId(res, fileId)) ||
    !(await checkFileNotExist(res, fileId))
  ) {
    return false;
  }
  return true;
}

export async function rename(req: Request, res: Response) {
  let { fileId } = req.params;
  let { newName } = req.body;
  if (
    !(await checkProjectId(res, fileId)) ||
    !(await checkFileNotExist(res, fileId)) ||
    !(await requireNewName(res, newName)) ||
    !(await checkFileName(res, newName)) ||
    !(await checkPathUpdateExist(req, res, fileId, newName))
  ) {
    return false;
  }
  return true;
}
