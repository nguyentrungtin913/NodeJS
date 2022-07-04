import { Response } from "express";

let ERROR = {
  code: "errors",
  msgKey: "",
  description: "",
};

export function setError(
  res: Response,
  status: any,
  code: string,
  errorDev: string,
  errorClient: string
) {
  ERROR = {
    code: code,
    msgKey: errorDev,
    description: errorClient,
  };
  res.status(status);
  return;
}

export function getError(res: Response) {
  let result = JSON.stringify(ERROR);
  res.setHeader("Content-Type", "application/json");
  return res.end(result);
}

module.exports = { setError, getError };
