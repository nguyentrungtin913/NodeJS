import { requireParam, checkNumber } from "../helpers/baseValidator";
import { Request, Response, NextFunction } from "express";
import { findByUserId as findByUserRoleIdModel } from "../models/userRole";
import { setError } from "../helpers/errorHelper";
import { findById as findRoleByIdModel } from "../models/role";

async function requireDataUpdate(res: Response, userId: any, roleId: any) {
  if (
    !requireParam(
      res,
      userId,
      "user_id_required",
      "user.id.required",
      "User id is required"
    ) ||
    !requireParam(
      res,
      roleId,
      "role_id_required",
      "role.id.required",
      "Role id is required"
    )
  ) {
    return false;
  }
  return true;
}
async function checkData(res: Response, userId: any, roleId: any) {
  if (
    !checkNumber(
      res,
      userId,
      "user_id_invalid",
      "user.id.invalid",
      "User id invalid"
    ) ||
    !checkNumber(
      res,
      roleId,
      "role_id_invalid",
      "role.id.invalid",
      "Role id invalid"
    )
  ) {
    return false;
  }
  return true;
}

async function checkUserRoleExist(res: Response, userId: any) {
  let userRole = await findByUserRoleIdModel(userId);
  if (!userRole) {
    setError(
      res,
      400,
      "user_role_not_exist",
      "user_role.not.exist",
      "User role not exist"
    );
    return false;
  }
  return true;
}

async function checkRoleExist(res: Response, roleId: any) {
  let role = await findRoleByIdModel(roleId);
  if (!role) {
    setError(res, 400, "role_not_exist", "role.not.exist", "Role not exist");
    return false;
  }
  return true;
}

export async function update(req: Request, res: Response) {
  const { roleId, userId } = req.body;
  if (
    !(await requireDataUpdate(res, userId, roleId)) ||
    !(await checkData(res, userId, roleId)) ||
    !(await checkUserRoleExist(res, userId)) ||
    !(await checkRoleExist(res, roleId))
  ) {
    return false;
  }
  return true;
}
