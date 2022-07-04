import { Request, Response, NextFunction } from "express";
import { success, errors } from "../helpers/responseHelper";
import * as fileModel from "../models/file";
import * as workflowModel from "../models/workflow";
import * as projectModel from "../models/project";
import * as fileValidator from "../validators/fileValidator";
import { getError } from "../helpers/errorHelper";
import { getList } from "../helpers/dataHelper";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
const instance = axios.create({
  baseURL: process.env.DIGDAG_BASEURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
const updateOrCreateFile = async (req: Request, res: Response) => {
  try {
    if (!(await fileValidator.updateOrCreateFile(req, res))) {
      return getError(res);
    }
    let {
      ob,
      fileName,
      workflowName,
      projectName,
      projectRevision = uuidv4(),
      fileId = 0,
    } = req.body;
    const now = new Date();
    const { id } = ob;
    const createBy = id.toString();
    const proj = await projectModel.findByName(projectName);
    if (proj) {
      await projectModel.update(
        proj.project_id,
        projectRevision,
        now.toISOString(),
        parseInt(ob.id),
        proj.digdag_project_id
      );
    }
    let workflow: any = await workflowModel.findByNameAndProjectId(
      workflowName,
      proj?.project_id
    );
    if (!workflow) {
      const result2 = await instance.get(
        `/projects/${proj.digdag_project_id}/workflows/${workflowName}`
      );
      if (!result2?.data?.message) {
        workflow = await workflowModel.store(
          workflowName,
          proj.project_id,
          now.toISOString(),
          parseInt(ob.id),
          parseInt(result2?.data?.id)
        );
      }
    }
    const currFile = await fileModel.findById(fileId);
    let file = null;
    if (!currFile) {
      file = await fileModel.store(
        fileName,
        proj?.project_id,
        workflow?.workflow_id,
        now.toISOString(),
        createBy
      );
    } else {
      file = await fileModel.renameFile(fileId, fileName);
    }
    return success(
      res,
      "create_file_success",
      "create.success",
      "Create file success",
      file
    );
  } catch (uncaughtException) {
    return errors(
      res,
      "request_failed",
      500,
      "request.failed",
      uncaughtException
    );
  }
};

const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(await fileValidator.deleteFile(req, res))) {
      return getError(res);
    }
    const { fileId = 0 } = req.params;

    const now = new Date();
    const file = await fileModel.softDelete(fileId, now.toISOString());

    return success(
      res,
      "delete_file_success",
      "delete.success",
      "Request successful",
      file
    );
  } catch (uncaughtException) {
    return errors(
      res,
      "request_failed",
      500,
      "request.failed",
      uncaughtException
    );
  }
};

const listFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(await fileValidator.listFiles(req, res))) {
      return getError(res);
    }

    let { projectName = "", workflowName = "" } = req.query;
    let files: any[] = [];
    let proj: any = await projectModel.findByName(`${projectName}`);
    if (proj) {
      let workflow: any = await workflowModel.findByNameAndProjectId(
        `${workflowName}`,
        proj?.project_id
      );
      if (workflow) {
        files = await fileModel.getListFile(
          proj?.project_id,
          workflow?.workflow_id
        );
      }
    }
    return getList(
      res,
      files,
      "list_files",
      "get_file_success",
      "get_file_success",
      "Request successful"
    );
  } catch (uncaughtException) {
    return errors(
      res,
      "request_failed",
      500,
      "request.failed",
      uncaughtException
    );
  }
};

export default {
  listFiles,
  deleteFile,
  updateOrCreateFile,
};
