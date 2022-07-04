import { setError } from "./errorHelper";
import { Response } from "express";
export function requireParam(
  res: Response,
  param: any,
  code: string,
  msgKey: string,
  description: string
) {
  if (param === undefined || param.length < 1) {
    setError(res, 400, code, msgKey, description);
    return false;
  }
  return true;
}

export function checkNumber(
  res: Response,
  param: any,
  code: string,
  msgKey: string,
  description: string
) {
  if (isNaN(param)) {
    setError(res, 400, code, msgKey, description);
    return false;
  }
  return true;
}

export const isEmail = (email: string) => {
  return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
};
