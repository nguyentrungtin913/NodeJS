import { Request, Response, NextFunction } from "express";
import {
  findByUserId as findByUserIdModel,
  update as updateUserRoleModel,
} from "../models/userRole";
import { findById as findUserById } from "../models/user";
import { success, errors, error } from "../helpers/responseHelper";
import { update as updateUserRoleValidator } from "../validators/userRoleValidator";
import { getError } from "../helpers/errorHelper";

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(await updateUserRoleValidator(req, res))) {
      return getError(res);
    }
    const { ob, roleId, userId } = req.body;
    const user = await findUserById(parseInt(userId), parseInt(ob.id));
    if (!user) {
      return error(
        res,
        "update_role_failded",
        400,
        `User ${userId} not existed`,
        `User ${userId} not existed`,
        null
      );
    }
    const now = new Date();
    const userRole = await findByUserIdModel(userId);
    if (userRole) {
      const oldRole = userRole.role_id;
      const result = await updateUserRoleModel(
        parseInt(userId),
        parseInt(roleId),
        oldRole,
        now.toISOString(),
        parseInt(ob.id)
      );
      if (result) {
        return success(
          res,
          "update_role_success",
          "update_role_success",
          "Update role successful",
          result
        );
      }
      return error(
        res,
        "update_role_failded",
        400,
        "update_role_failed",
        "Update role failed",
        null
      );
    } else {
      return error(
        res,
        "update_role_failded",
        400,
        "update_role_failed",
        "Update role failed",
        null
      );
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

export default { update };
