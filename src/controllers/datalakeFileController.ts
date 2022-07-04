import { Request, Response } from "express";
import { success, errors, error } from "../helpers/responseHelper";
import { getList } from "../helpers/dataHelper";
import * as datalakeFileModel from "../models/datalake_file";
import * as datalakeFolderModel from "../models/datalake_folder";
import _ from "lodash";
import axios from "axios";
const listFiles = async (req: Request, res: Response) => {
  try {
    const { ob } = req.body;
    const { folderId = "" } = req.params;
    if (!_.isString(folderId) || !_.isInteger(parseInt(folderId))) {
      return error(
        res,
        "invalid_folder_id",
        400,
        "invalid_folder_id",
        `Folder Id is invalid`,
        null
      );
    }
    const folders = await datalakeFileModel.listFiles(
      parseInt(ob.id),
      parseInt(folderId)
    );
    return getList(
      res,
      folders,
      "folders",
      "list_files_success",
      "list_folder_success",
      "List folders successful"
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

const detailFile = async (req: Request, res: Response) => {
  try {
    const { ob } = req.body;
    const { folderId = "", fileId = "" } = req.params;
    if (!_.isString(folderId) || !_.isInteger(parseInt(folderId))) {
      return error(
        res,
        "invalid_folder_id",
        400,
        "invalid_folder_id",
        `Folder Id is invalid`,
        null
      );
    }

    if (!_.isString(fileId) || !_.isInteger(parseInt(fileId))) {
      return error(
        res,
        "invalid_file_id",
        400,
        "invalid_file_id",
        `File Id is invalid`,
        null
      );
    }

    const datalakeFile = await datalakeFileModel.findFileById(
      parseInt(ob.id),
      parseInt(folderId),
      parseInt(fileId)
    );

    if (datalakeFile) {
      return success(
        res,
        "get_file_succcess",
        "get_file_succcess",
        `Get file #${fileId} successfully`,
        datalakeFile
      );
    }
    return error(
      res,
      "not_found_file",
      404,
      "not_found_file",
      `Not found file #${fileId}`,
      null
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

const createFile = async (req: Request, res: Response) => {
  try {
    const { fileName, ob } = req.body;
    const { folderId = "" } = req.params;
    if (!_.isString(folderId) || !_.isInteger(parseInt(folderId))) {
      return error(
        res,
        "invalid_folder_id",
        400,
        "invalid_folder_id",
        `Folder Id is invalid`,
        null
      );
    }
    const now = new Date();
    const newDatalakeFile = await datalakeFileModel.createFile(
      parseInt(ob.id),
      parseInt(folderId),
      fileName,
      "",
      now.toISOString()
    );
    if (newDatalakeFile) {
      return success(
        res,
        "create_file_success",
        "create_file_success",
        `Create file successfully`,
        newDatalakeFile
      );
    }
    return error(
      res,
      "create_file_failed",
      400,
      "create_file_failed",
      `Create file failed`,
      null
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

const updateFile = async (req: Request, res: Response) => {
  try {
    const { ob, fileContent = "" } = req.body;
    const { folderId = "", fileId = "" } = req.params;

    if (!_.isString(fileContent)) {
      return error(
        res,
        "invalid_file_content",
        400,
        "invalid_file_content",
        `Folder Content is invalid`,
        null
      );
    }
    if (!_.isString(folderId) || !_.isInteger(parseInt(folderId))) {
      return error(
        res,
        "invalid_folder_id",
        400,
        "invalid_folder_id",
        `Folder Id is invalid`,
        null
      );
    }
    if (!_.isString(fileId) || !_.isInteger(parseInt(fileId))) {
      return error(
        res,
        "invalid_file_id",
        400,
        "invalid_file_id",
        `File Id is invalid`,
        null
      );
    }

    const datalakeFile = await datalakeFileModel.findFileById(
      parseInt(ob.id),
      parseInt(folderId),
      parseInt(fileId)
    );
    if (!datalakeFile) {
      return error(
        res,
        "not_found_file",
        404,
        "not_found_file",
        `Not found file #${fileId}`,
        null
      );
    }

    const now = new Date();
    const result = await datalakeFileModel.updateFile(
      parseInt(fileId),
      parseInt(folderId),
      parseInt(ob.id),
      fileContent,
      now.toISOString()
    );
    if (result) {
      return success(
        res,
        "update_file_success",
        "update_file_success",
        `Update file successfully`,
        result
      );
    }
    return error(
      res,
      "update_file_failed",
      400,
      "update_file_failed",
      `Update file failed`,
      null
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

const updateParentFolder = async (req: Request, res: Response) => {
  try {
    const { ob, newParentFolderId = "" } = req.body;
    const { folderId = "", fileId = "" } = req.params;
    if (!_.isNumber(newParentFolderId)) {
      return error(
        res,
        "invalid_new_parent_folder_id",
        400,
        "invalid_new_parent_folder_id",
        `New Parent Folder Id is invalid`,
        null
      );
    }
    const newParentFolder = await datalakeFolderModel.findFolderById(
      newParentFolderId,
      parseInt(ob.id)
    );

    if (!newParentFolder) {
      return error(
        res,
        "parent_folder_not_found",
        400,
        "parent_folder_not_found",
        `Not found folder #${newParentFolderId}`,
        null
      );
    }

    if (!_.isString(folderId) || !_.isInteger(parseInt(folderId))) {
      return error(
        res,
        "invalid_folder_id",
        400,
        "invalid_folder_id",
        `Folder Id is invalid`,
        null
      );
    }

    if (!_.isString(fileId) || !_.isInteger(parseInt(fileId))) {
      return error(
        res,
        "invalid_file_id",
        400,
        "invalid_file_id",
        `File Id is invalid`,
        null
      );
    }

    const datalakeFile = await datalakeFileModel.findFileById(
      parseInt(ob.id),
      parseInt(folderId),
      parseInt(fileId)
    );
    if (!datalakeFile) {
      return error(
        res,
        "not_found_file",
        404,
        "not_found_file",
        `Not found file #${fileId}`,
        null
      );
    }

    const now = new Date();
    const result = await datalakeFileModel.updateParentFolder(
      parseInt(fileId),
      parseInt(ob.id),
      newParentFolderId,
      now.toISOString()
    );
    if (result) {
      return success(
        res,
        "update_file_success",
        "update_file_success",
        `Update file successfully`,
        result
      );
    }
    return error(
      res,
      "update_file_failed",
      400,
      "update_file_failed",
      `Update file failed`,
      null
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

const deleteFile = async (req: Request, res: Response) => {
  try {
    const { folderId = "", fileId = "" } = req.params;
    const { ob } = req.body;
    if (!_.isString(folderId) || !_.isInteger(parseInt(folderId))) {
      return error(
        res,
        "invalid_folder_id",
        400,
        "invalid_folder_id",
        `Folder Id is invalid`,
        null
      );
    }
    if (!_.isString(fileId) || !_.isInteger(parseInt(fileId))) {
      return error(
        res,
        "invalid_file_id",
        500,
        "invalid_file_id",
        `File Id is invalid`,
        null
      );
    }
    const datalakeFile = await datalakeFileModel.findFileById(
      parseInt(ob.id),
      parseInt(folderId),
      parseInt(fileId)
    );
    if (!datalakeFile) {
      return error(
        res,
        "not_found_file",
        404,
        "not_found_file",
        `Not found file #${fileId}`,
        null
      );
    }
    const result = await datalakeFileModel.deleteFile(parseInt(fileId));
    if (result) {
      return success(
        res,
        "delete_file_success",
        "delete_file_success",
        `Delete file #${fileId} successfully`,
        null
      );
    }
    return error(
      res,
      "delete_file_failed",
      400,
      "delete_file_failed",
      `Delete file #${fileId} failed`,
      null
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
const instance = axios.create({
  baseURL: process.env.DATALAKE_QUERY_BASEURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
const forward = async (req: Request, res: Response) => {
  const uri = req.url.replace("/datalake-query", "");
  if (req.method === "GET") {
    instance
      .get(uri, { params: req.query })
      .then((response) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(response.data)); // <= send data to the client
      })
      .catch((err) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(err?.response?.data || {})); // <= send error
      });
  } else if (req.method === "POST") {
    instance
      .post(uri, req.body)
      .then((response) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(response.data));
      })
      .catch((err) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(err?.response?.data || {})); // <= send error
      });
  }
};

export default {
  listFiles,
  detailFile,
  createFile,
  updateFile,
  deleteFile,
  updateParentFolder,
  forward,
};
