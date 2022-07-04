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
const listProjects = async (req: Request, res: Response) => {
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
  } catch (uncaughtException) {
    console.log(uncaughtException);
    return errors(
      res,
      "request_failed",
      500,
      "request.failed",
      uncaughtException
    );
  }
};

const createProject = async (req: Request, res: Response) => {
  try {
    const { projectName, revision } = req.query;
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
    const project = await projectModel.findByName(projectName);
    if (project) {
      return error(
        res,
        "existed_project_name",
        400,
        "existed_project_name",
        `Project name is existed`,
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
        await projectModel.store(
          result?.data?.name,
          parseInt(result?.data?.id),
          result?.data?.revision,
          now.toISOString(),
          parseInt(ob.id)
        );
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
  listProjects,
  createProject,
};
