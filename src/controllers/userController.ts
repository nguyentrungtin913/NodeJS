import { Request, Response } from "express";
import * as userModel from "../models/user";
import { STATUS as USER_STATUS } from "../constant/user";
import { store as storeUserRoleModel } from "../models/userRole";
import { success, errors, error } from "../helpers/responseHelper";
import * as userValidator from "../validators/userValidator";
import { getError } from "../helpers/errorHelper";
import nodemailer from "nodemailer";
import * as env from "env-var";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { pagination } from "../helpers/paginationHelper";
import _ from "lodash";

const getProfile = async (req: Request, res: Response) => {
  try {
    let { ob } = req.body;
    let { id } = ob;
    let user = await userModel.findById(id);
    return success(
      res,
      "get_user_success",
      "get.success",
      "Request successful",
      user
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
const searchByCriteria = async (req: Request, res: Response) => {
  let { page = "", limit = "", status = "", email = "", ob } = req.body;

  page =
    isNaN(page) || page.toString().trim() === "" || page === undefined
      ? "1"
      : page;
  limit =
    isNaN(limit) || limit.toString().trim() === "" || limit === undefined
      ? "5"
      : limit;
  status =
    isNaN(status) || status.toString().trim() === "" || status === undefined
      ? "-1"
      : status;

  page = parseInt(page.toString());
  limit = parseInt(limit.toString());
  status = parseInt(status.toString());

  let skip = (page - 1) * limit;
  try {
    let users = await userModel.listUsers(
      skip,
      limit,
      status,
      email,
      parseInt(ob.id),
      parseInt(ob.id)
    );
    if (users) {
      let totalPage = users[0] !== null ? users[0] : 0;
      return pagination(
        res,
        users[1],
        "ListUsers",
        "get_user_success",
        "get.success",
        "Get a list of successful users",
        totalPage,
        page,
        limit
      );
    }
    return errors(
      res,
      "get_users_faild",
      400,
      "get.users.faild",
      "Get users faild"
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

const register = async (req: Request, res: Response) => {
  try {
    if (!(await userValidator.register(req, res))) {
      return getError(res);
    }
    const {
      email,
      password,
      token = "",
      firstName = "",
      lastName = "",
    } = req.body;
    const secret = process.env.SECRET ?? "GenD";
    let isValidInvitationLink = true;
    let user = null;
    try {
      const decoded = <any>jwt.verify(token, secret);
      user = await userModel.findById(parseInt(decoded?.id || "0"));
      if (
        !user ||
        user.user_status !== USER_STATUS.INVITED ||
        user.user_email !== email
      ) {
        isValidInvitationLink = false;
      }
    } catch (err) {
      isValidInvitationLink = false;
    }
    if (!isValidInvitationLink || !user) {
      return error(
        res,
        "register_failed",
        400,
        "Register account failed",
        "Register account failed",
        null
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const now = new Date();
    const result = await userModel.update(
      user?.user_id,
      firstName,
      lastName,
      hash,
      now.toISOString(),
      USER_STATUS.ACTIVE
    );
    if (result) {
      let role = null;
      if (user.user_roles.length > 0) {
        if (user.user_roles[0].role) {
          role = user.user_roles[0].role.role_name;
        }
      }
      const payload = {
        id: user.user_id,
        role: role,
        email: user.user_email ?? null,
        exp: Math.floor(Date.now() / 1000) + 60 * 30,
      };
      const secret = process.env.SECRET ?? "GenD";
      const token = jwt.sign(payload, secret);
      const data = {
        accessToken: token,
      };
      return success(
        res,
        "register_success",
        "Register account successful",
        "Register account successful",
        data
      );
    }
    return errors(
      res,
      "register_failed",
      400,
      "Register account failed",
      "Register account failed"
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

const validateInvitationLink = async (req: Request, res: Response) => {
  const { token = "" } = req.body;
  const secret = process.env.SECRET ?? "GenD";
  let user = null;
  let isValidInvitationLink = true;
  try {
    const decoded = <any>jwt.verify(token, secret);
    user = await userModel.findById(parseInt(decoded?.id || "0"));
    if (!user || user.user_status !== USER_STATUS.INVITED) {
      isValidInvitationLink = false;
    }
  } catch (err) {
    isValidInvitationLink = false;
  }
  if (user && isValidInvitationLink) {
    return success(
      res,
      "valid_invitation_link",
      "Invitation link is valid",
      "Invitation link is valid",
      {
        email: user.user_email,
      }
    );
  } else {
    return error(
      res,
      "invalid_invitation_link",
      401,
      "Your invation link is invalid",
      "Your invitation link is invalid",
      null
    );
  }
};
const inviteUser = async (req: Request, res: Response) => {
  try {
    if (!(await userValidator.inviteUser(req, res))) {
      return getError(res);
    }
    const URL_INVITATION = env.get("URL_INVITATION").asString() ?? "";
    const MAIL = env.get("MAIL").asString() ?? "";
    const MAIL_PASSWORD = env.get("MAIL_PASSWORD").asString() ?? "";
    const { ob, mailTo, role, text = "" } = req.body;
    const perText = `<p>${text || ""}</p>`;
    const userCreateBy = parseInt(ob.id);
    const now = new Date();
    const result = await userModel.findByEmail(mailTo);
    if (!result) {
      const user = await userModel.create(
        mailTo,
        now.toISOString(),
        userCreateBy,
        USER_STATUS.INVITED
      );
      if (!user) {
        return error(
          res,
          "invitation_faild",
          400,
          `Invite email ${mailTo} failed`,
          `Invite email ${mailTo} failed`,
          mailTo
        );
      }
      const userRole = await storeUserRoleModel(
        user.user_id,
        role,
        now.toISOString(),
        userCreateBy
      );
      if (!userRole) {
        return error(
          res,
          "invitation_faild",
          400,
          `Invite email ${mailTo} failed`,
          `Invite email ${mailTo} failed`,
          mailTo
        );
      }
      const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 72;
      const payload = {
        id: user.user_id,
        exp: expirationTime,
      };
      const registerToken = jwt.sign(payload, process.env.SECRET ?? "GenD");
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: MAIL,
          pass: MAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: MAIL,
        to: mailTo,
        subject: "Invitation to join GenD Admin",
        html: `
                    <p>Hi! GenD Administrator has sent you an invitation to join GenD Admin</p>
                    <p>${perText}</p>
                    <a href="${URL_INVITATION}?token=${registerToken}" style="border:solid thin;padding:5px;color:#28b66a;width:255px;text-decoration:none;font-weight:bolder">ACCEPT YOUR INVITATION</a>
                    <p>Thanks,</p>
                    <p>GenD Team</p>
            `,
      };
      const result = await transporter.sendMail(mailOptions);
      return success(
        res,
        "invitation_success",
        `Invite email ${mailTo} successfully`,
        `Invite email ${mailTo} successfully`,
        mailTo
      );
    } else {
      return error(
        res,
        "invitation_faild",
        400,
        `Email ${mailTo} taken`,
        `Email ${mailTo} taken`,
        mailTo
      );
    }
  } catch (uncaughtException) {
    return error(
      res,
      "request_failed",
      500,
      "request.failed",
      "request.failed",
      uncaughtException
    );
  }
};

// const updateProfileFirst = async (req: Request, res: Response) => {
//   try {
//     if (!(await updateProfileFirstValidator(req, res))) {
//       return getError(res);
//     }
//     let { email, firstName, lastName, password } = req.body ?? "";
//     const salt = await bcrypt.genSalt(10);
//     let hash = await bcrypt.hash(password, salt);
//     let role = null;
//     const now = new Date();
//     let user = await updateProfileModel(
//       email,
//       firstName,
//       lastName,
//       hash,
//       now.toISOString()
//     );
//     if (user) {
//       let result = await findByEmailModel(user.user_email);
//       const d = new Date();
//       let start = d.getTime();
//       let end = start + 1000 * 60 * 30;
//       if (result.user_roles.length > 0) {
//         if (result.user_roles[0].role) {
//           role = result.user_roles[0].role.role_name;
//         }
//       }
//       let payload = {
//         id: user.user_id,
//         role: role,
//         email: user.user_email ?? null,
//         exp: Math.floor(Date.now() / 1000) + 60 * 30,
//       };

//       let secret = process.env.SECRET ?? "GenD";
//       let token = jwt.sign(payload, secret);
//       const rs = await store(
//         token,
//         user.user_id,
//         "",
//         start.toString(),
//         end.toString()
//       );
//       let data = {
//         accessToken: rs.access_token ?? "",
//       };

//       return success(
//         res,
//         "login_success",
//         "login.success",
//         "Login successfully",
//         data
//       );
//     }
//     return errors(
//       res,
//       "update_profile_faild",
//       400,
//       "update.profile.faild",
//       "Update profile faild"
//     );
//   } catch (uncaughtException) {
//     return errors(
//       res,
//       "request_failed",
//       500,
//       "request.failed",
//       uncaughtException
//     );
//   }
// };

const softDelete = async (req: Request, res: Response) => {
  try {
    if (!(await userValidator.softDelete(req, res))) {
      return getError(res);
    }
    let { userId, ob } = req.body;
    const now = new Date();
    let user = await userModel.softDelete(
      parseInt(userId),
      now.toISOString(),
      parseInt(ob.id)
    );
    if (user) {
      return success(
        res,
        "delete_user_success",
        "delete.user.success",
        "Delete user success",
        user
      );
    }
    return errors(
      res,
      "delete_user_faild",
      400,
      "delete.user.faild",
      "Delete user faild"
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
  getProfile,
  searchByCriteria,
  validateInvitationLink,
  inviteUser,
  //updateProfileFirst,
  softDelete,
  register,
};
