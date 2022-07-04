import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { errors } from "../helpers/responseHelper";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  let token: any = "";
  let decoded = new Object();
  let authorization = req.header("Authorization");
  if (authorization) {
    token = authorization.replace("Bearer ", "");
  } else {
    token = req.params.auth_token || "";
  }
  const secret = process.env.SECRET ?? "GenD";
  try {
    decoded = jwt.verify(token, secret);
  } catch (err) {
    return errors(
      res,
      "auth_failed",
      401,
      "token.invalid",
      "Invalid access token"
    );
  }
  req.body.ob = decoded;
  req.body.currToken = token;
  next();
};
