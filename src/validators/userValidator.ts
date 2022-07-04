import { requireParam, checkNumber, isEmail } from "../helpers/baseValidator";
import { Request, Response } from "express";
import { findById as findRoleById } from "../models/role";
import { setError } from "../helpers/errorHelper";
import {
  findByEmail as findUserByEmailModel,
  findById as findUserByIdModel,
} from "../models/user";
import * as Yup from "yup";

async function requireEmail(res: Response, email: string) {
  if (
    !requireParam(
      res,
      email,
      "email_required",
      "email.required",
      "Email is required"
    )
  ) {
    return false;
  }
  if (!isEmail(email)) {
    setError(
      res,
      400,
      "invalid_email",
      `Email ${email} is invalid`,
      `Email ${email} is invalid`
    );
    return false;
  }
  return true;
}

export async function findUserByEmail(req: Request, res: Response) {
  let email = req.query.email ?? "";
  if (!(await requireEmail(res, email.toString()))) {
    return false;
  }
  return true;
}
async function checkRole(res: Response, role: any) {
  if (!checkNumber(res, role, "role_invalid", "role.invalid", "Role invalid")) {
    return false;
  }
  return true;
}

async function requireDataInvitation(
  res: Response,
  mailTo: string,
  role: number
) {
  if (
    !(await requireEmail(res, mailTo)) ||
    !requireParam(
      res,
      role,
      "role_required",
      "role.required",
      "Role is required"
    )
  ) {
    return false;
  }
  return true;
}

async function checkRoleExist(res: Response, role: any) {
  const result = await findRoleById(role);
  if (!result) {
    setError(res, 400, "role_not_exist", "role.not.exist", "Role not exists");
    return false;
  }
  return true;
}
export async function inviteUser(req: Request, res: Response) {
  const { mailTo, role } = req.body;
  if (
    !(await requireDataInvitation(res, mailTo, role)) ||
    !(await checkRole(res, role)) ||
    !(await checkRoleExist(res, role))
  ) {
    return false;
  }
  return true;
}

async function requireDataUpdateProfileFirst(
  res: Response,
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  confirmPassword: string
) {
  if (
    !requireParam(
      res,
      email,
      "emai_required",
      "email.required",
      "Email is required"
    ) ||
    !requireParam(
      res,
      firstName,
      "firstname_required",
      "firstname.required",
      "First name is required"
    ) ||
    !requireParam(
      res,
      lastName,
      "lastName_required",
      "lastName.required",
      "Last name is required"
    ) ||
    !requireParam(
      res,
      password,
      "password_required",
      "password.required",
      "Password is required"
    ) ||
    !requireParam(
      res,
      confirmPassword,
      "confirmPassword_required",
      "confirmPassword.required",
      "Confirm password is required"
    )
  ) {
    return false;
  }
  return true;
}

async function passwordConfirm(
  res: Response,
  password: string,
  confirmPassword: string
) {
  if (password !== confirmPassword) {
    setError(
      res,
      400,
      "confirm_password_incorrect",
      "confirm.password.incorrect",
      "Confirm incorrect password"
    );
    return false;
  }
  return true;
}

async function checkFirstUpdate(res: Response, email: string) {
  let user = await findUserByEmailModel(email);
  if (user) {
    if (user.user_update_at) {
      setError(
        res,
        400,
        "not_allow",
        "not.allow",
        "Update only when logging in for the first time"
      );
      return false;
    }
    return true;
  }
  setError(res, 400, "email_not_exist", "email.not.exist", "Email not exist");
  return false;
}

export async function updateProfileFirst(req: Request, res: Response) {
  let { email, firstName, lastName, password, confirmPassword } = req.body;

  if (
    !(await requireDataUpdateProfileFirst(
      res,
      email,
      firstName,
      lastName,
      password,
      confirmPassword
    )) ||
    !(await passwordConfirm(res, password, confirmPassword)) ||
    !(await checkFirstUpdate(res, email))
  ) {
    return false;
  }
  return true;
}

async function checkUserId(res: Response, userId: any) {
  if (
    !checkNumber(
      res,
      userId,
      "user_id_invalid",
      "user.id.invalid",
      "User id invalid"
    )
  ) {
    return false;
  }
  return true;
}

async function requireDataSoftDelete(res: Response, userId: any) {
  if (
    !requireParam(
      res,
      userId,
      "user_id_required",
      "user.id.required",
      "User id to is required"
    )
  ) {
    return false;
  }
  return true;
}

async function checkUserExist(res: Response, userId: any, id: number) {
  let user = await findUserByIdModel(parseInt(userId));
  if (!user) {
    setError(res, 400, "user_not_exist", "user.not.exist", "User not exist");
    return false;
  } else {
    let idUserCreate = user.user_create_by ?? 0;
    if (id === idUserCreate) {
      return true;
    } else {
      setError(
        res,
        403,
        "not_allow",
        "not.allow",
        "You are not allowed to delete this user"
      );
      return false;
    }
  }
}
export async function softDelete(req: Request, res: Response) {
  let { userId, ob } = req.body;
  let { id } = ob;
  if (
    !(await requireDataSoftDelete(res, userId)) ||
    !(await checkUserId(res, userId)) ||
    !(await checkUserExist(res, userId, id))
  ) {
    return false;
  }
  return true;
}
async function requireDataRegister(
  res: Response,
  email: any,
  password: any,
  confirmPassword: any,
  firstName: any,
  lastName: any,
  token: any
) {
  if (
    !requireParam(
      res,
      email,
      "email_required",
      "email.required",
      "Email is required"
    ) ||
    !requireParam(
      res,
      password,
      "password_required",
      "password.required",
      "Password is required"
    ) ||
    !requireParam(
      res,
      confirmPassword,
      "password_confirm_required",
      "password.confirm.required",
      "Password confirm is required"
    ) ||
    !requireParam(
      res,
      firstName,
      "first_name_required",
      "first_name_required",
      "First name is required"
    ) ||
    !requireParam(
      res,
      lastName,
      "last_name_required",
      "last_name_required",
      "Last Name is required"
    ) ||
    !requireParam(
      res,
      token,
      "invitation_token_required",
      "invitation_token_required",
      "Invitation token is required"
    )
  ) {
    return false;
  }
  return true;
}

async function checkEmail(res: Response, email: string) {
  const check = {
    email,
  };
  try {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
    });
    await schema.validate(check, { abortEarly: false });
    return true;
  } catch (error) {
    const err = JSON.parse(JSON.stringify(error));
    let description = "";
    let msgKey = "";
    let code = "";
    if (err.errors) {
      switch (err.errors[0]) {
        case "Must be a valid email":
          description = "Must be a valid email";
          msgKey = "email.invalid";
          code = "email_invalid";
          break;
        case "Email is required":
          description = "Email is required";
          msgKey = "email.required";
          code = "email_required";
          break;
        default:
          description = "error";
          msgKey = "error";
          code = "error";
          break;
      }
    }
    setError(res, 400, code, msgKey, description);
    return false;
  }
}

async function checkEmailExist(res: Response, email: any) {
  let user = await findUserByEmailModel(email);
  if (user) {
    setError(res, 400, "email_exist", "email.exist", "Email already exists");
    return false;
  }
  return true;
}

export async function register(req: Request, res: Response) {
  let { email, password, confirmPassword, firstName, lastName, token } =
    req.body;
  if (
    !(await requireDataRegister(
      res,
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      token
    )) ||
    !(await checkEmail(res, email)) ||
    !(await passwordConfirm(res, password, confirmPassword))
  ) {
    return false;
  }
  return true;
}
