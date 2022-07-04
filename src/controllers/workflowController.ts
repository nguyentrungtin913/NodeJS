import { Request, Response } from "express";
import axios from "axios";

import { errors, error } from "../helpers/responseHelper";
import * as projectModel from "../models/project";
import * as workflowModel from "../models/workflow";
import _ from "lodash";
const instance = axios.create({
  baseURL: process.env.DIGDAG_BASEURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const createWorkflow = async (req: Request, res: Response) => {
  try {
    const { projectName, revision, workflowName } = req.query;
    const { ob } = req.body;
    const now = new Date();
    if (!projectName) {
      return error(
        res,
        "required_project_name",
        400,
        "required_project_name",
        `Project name is required`,
        null
      );
    }
    if (!_.isString(projectName)) {
      return error(
        res,
        "invalid_project_name",
        400,
        "invalid_project_name",
        `Project name is invalid`,
        null
      );
    }
    if (!revision) {
      return error(
        res,
        "required_project_revision",
        400,
        "required_project_revision",
        `Project revision is required`,
        null
      );
    }
    if (!_.isString(revision)) {
      return error(
        res,
        "invalid_project_revision",
        400,
        "invalid_project_revision",
        `Project revision is invalid`,
        null
      );
    }
    if (!workflowName) {
      return error(
        res,
        "required_workflow_name",
        400,
        "required_workflow_name",
        `Workflow name is required`,
        null
      );
    }
    if (!_.isString(workflowName)) {
      return error(
        res,
        "invalid_workflow_name",
        400,
        "invalid_workflow_name",
        `Workflow name is invalid`,
        null
      );
    }
    const project = await projectModel.findByName(projectName);
    if (!project) {
      return error(
        res,
        "not_existed_project",
        400,
        "not_existed_project",
        `Project #${projectName} is not existed`,
        null
      );
    }
    const workflow = await workflowModel.findByNameAndProjectId(
      workflowName,
      project?.project_id
    );
    if (workflow) {
      return error(
        res,
        "workflow_name_existed",
        400,
        "workflow_name_existed",
        `Workflow #${workflowName} existed`,
        null
      );
    }
    try {
      const result = await instance.put(
        `/projects?project=${projectName}&revision=${revision}`,
        req.body,
        {
          headers: { "Content-Type": "application/gzip" },
        }
      );
      if (!result?.data?.message) {
        await projectModel.update(
          project.project_id,
          result?.data?.revision,
          now.toISOString(),
          parseInt(ob.id),
          parseInt(result?.data?.id)
        );
        const result2 = await instance.get(
          `/projects/${project.digdag_project_id}/workflows/${workflowName}`
        );
        if (!result2?.data?.message) {
          await workflowModel.store(
            workflowName,
            project.project_id,
            now.toISOString(),
            parseInt(ob.id),
            result2?.data?.id
          );
        }
      }
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(result.data));
    } catch (err: any) {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(err?.response?.data));
    }
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
  createWorkflow,
};
