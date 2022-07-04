import { Request, Response, NextFunction } from "express";
import { findByEmail } from "../models/user";
import { errors, success } from "../helpers/responseHelper";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { auth } from "../validators/authValidator";
import { getError } from "../helpers/errorHelper";
import { STATUS as USER_STATUS } from "../constant/user";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(await auth(req, res))) {
      return getError(res);
    }

    const email = req.body.email ?? "";
    const password = req.body.password ?? "";
    // const salt = await bcrypt.genSalt(10);
    // let hash = await bcrypt.hash(password, salt);
    // console.log(hash)
    const user = await findByEmail(email);
    if (
      user &&
      user.user_deleted === 0 &&
      user.user_status === USER_STATUS["ACTIVE"]
    ) {
      const passUser = user.user_password ?? "";
      let role = null;
      if (user.user_roles.length > 0) {
        if (user.user_roles[0].role) {
          role = user.user_roles[0].role.role_name;
        }
      }
      if (await bcrypt.compare(password, passUser)) {
        const now = new Date();
        const start = now.getTime();
        const end = start + 1000 * 60 * 30;
        const payload = {
          id: user.user_id,
          role: role,
          email: user.user_email ?? null,
          exp: Math.floor(Date.now() / 1000) + 60 * 30,
        };
        const secret = process.env.SECRET ?? "GenD";
        const token = jwt.sign(payload, secret);
        // const result = await store(
        //   token,
        //   user.user_id,
        //   "",
        //   start.toString(),
        //   end.toString()
        // );
        const data = {
          accessToken: token,
        };

        return success(
          res,
          "login_success",
          "login.success",
          "Login successfully",
          data
        );
      }
      return errors(
        res,
        "login_failed",
        400,
        "login.username_password.invalid",
        "The email address or password you entered is invalid !"
      );
    }
    return errors(
      res,
      "login_failed",
      400,
      "login.username_password.invalid",
      "The email address or password you entered is invalid !"
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

export default { login };
