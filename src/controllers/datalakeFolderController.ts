import { Request, Response } from "express";
import { success, errors, error } from "../helpers/responseHelper";
import { getList } from "../helpers/dataHelper";
import * as datalakeFolderModel from "../models/datalake_folder";
import _ from "lodash";
const listFolders = async (req: Request, res: Response) => {
  try {
    const { ob } = req.body;
    const { parentFolderId = "" } = req.query;
    if (
      parentFolderId &&
      (!_.isString(parentFolderId) || !_.isInteger(parseInt(parentFolderId)))
    ) {
      return error(
        res,
        "invalid_parent_folder_id",
        400,
        "invalid_parent_folder_id",
        `Parent Folder Id is invalid`,
        null
      );
    }
    const folders = await datalakeFolderModel.listFolders(
      parseInt(ob.id),
      parseInt(parentFolderId)
    );
    return getList(
      res,
      folders,
      "folders",
      "list_folders_success",
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

const createFolder = async (req: Request, res: Response) => {
  try {
    const { folderName, parentFolderId = 0, ob } = req.body;
    if (!folderName) {
      return error(
        res,
        "invalid_folder_name",
        400,
        "invalid_folder_name",
        `Folder Name is invalid`,
        null
      );
    }
    if (
      parentFolderId &&
      (!_.isString(parentFolderId) || !_.isInteger(parseInt(parentFolderId)))
    ) {
      return error(
        res,
        "invalid_parent_folder_id",
        400,
        "invalid_parent_folder_id",
        `Parent Folder Id is invalid`,
        null
      );
    }
    const now = new Date();
    const newDatalakeFolder = await datalakeFolderModel.createFolder(
      parseInt(ob.id),
      parseInt(parentFolderId),
      folderName,
      now.toISOString()
    );
    if (newDatalakeFolder) {
      return success(
        res,
        "create_folder_success",
        "create_folder_success",
        `Create folder successfully`,
        newDatalakeFolder
      );
    }
    return error(
      res,
      "create_folder_failed",
      400,
      "create_folder_failed",
      `Create folder failed`,
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

const deleteFolder = async (req: Request, res: Response) => {
  const { folderId = "" } = req.params;
  try {
    const { ob } = req.body;
    if (!_.isInteger(parseInt(folderId))) {
      return error(
        res,
        "invalid_folder_id",
        400,
        "invalid_folder_id",
        `Folder Id is invalid`,
        null
      );
    }
    const folder = await datalakeFolderModel.findFolderById(
      parseInt(folderId),
      parseInt(ob.id)
    );
    if (!folder) {
      return error(
        res,
        "not_found_folder",
        404,
        "not_found_folder",
        `Not found folder #${folderId}`,
        null
      );
    }
    await datalakeFolderModel.deleteFolder(parseInt(folderId));
    return success(
      res,
      "delete_folder_success",
      "delete_folder_success",
      `Delete folder #${folderId} successfully`,
      null
    );
  } catch (uncaughtException) {
    return error(
      res,
      "delete_folder_failed",
      400,
      "delete_folder_failed",
      `Delete folder #${folderId} failed`,
      null
    );
  }
};

export default { listFolders, createFolder, deleteFolder };
