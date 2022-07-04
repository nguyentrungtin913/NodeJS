import { Request, Response, NextFunction } from "express";
import axios from "axios";
import qs from "qs";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
const instance = axios.create({
  baseURL: process.env.QUERY_ENGINE_MONITOR_BASEURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getSourceCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  wrapper(axios);
  const jar = new CookieJar();
  const { config, data } = await axios.post(
    `${process.env.QUERY_ENGINE_MONITOR_BASEURL}/login`,
    qs.stringify({ username: "admin" }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" }, jar }
  );
  const cookies = Array.isArray(config?.jar?.toJSON()?.cookies)
    ? config?.jar?.toJSON()?.cookies
    : [];
  if (cookies) {
    const tokenCookie = cookies.find(
      (cookie) => cookie.key === "Trino-UI-Token"
    );
    if (tokenCookie) {
      res.setHeader("Content-Type", "application/html");
      return res.send(
        data
          .replaceAll(
            'href="',
            `href="${process.env.API_BASE_URL}/query-engine-monitor/${req.body.currToken}/`
          )
          .replaceAll(
            'src="',
            `src="${process.env.API_BASE_URL}/query-engine-monitor/${req.body.currToken}/`
          )
      );
    }
  }
  res.setHeader("Content-Type", "application/html");
  return res.end("");
};

const forward = async (req: Request, res: Response, next: NextFunction) => {
  const uri = req.url
    .replace("/query-engine-monitor", "")
    .replace(`/${req.params.auth_token}`, "");
  wrapper(axios);
  const jar = new CookieJar();
  const { config } = await axios.post(
    `${process.env.QUERY_ENGINE_MONITOR_BASEURL}/login`,
    qs.stringify({ username: "admin" }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" }, jar }
  );
  const cookies = Array.isArray(config?.jar?.toJSON()?.cookies)
    ? config?.jar?.toJSON()?.cookies
    : [];
  const headers: any = {};
  if (cookies) {
    const tokenCookie = cookies.find(
      (cookie) => cookie.key === "Trino-UI-Token"
    );
    if (tokenCookie) {
      headers["Cookie"] = `${tokenCookie?.["key"]}=${tokenCookie?.["value"]}`;
    }
  }
  const configToRequest: any = { params: req.query, headers };
  if (uri.indexOf(".png") > -1) {
    configToRequest["responseType"] = "arraybuffer";
  }
  if (req.method === "GET") {
    instance
      .get(uri, configToRequest)
      .then((response) => {
        if (uri.indexOf("/api") > -1) {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(response.data)); // <= send data to the client
        } else if (uri.indexOf(".png") > -1) {
          res.setHeader("Content-Type", "image/png");
          res.end(response.data); // <= send data to the client
        } else {
          if (uri.indexOf("dist/index.js") > -1) {
            response.data = response.data.replaceAll(
              '"/ui/api/',
              `"${process.env.API_BASE_URL}/query-engine-monitor/${req.params.auth_token}/api/`
            );
            response.data = response.data.replaceAll(
              `'/ui/api/`,
              `'${process.env.API_BASE_URL}/query-engine-monitor/${req.params.auth_token}/api/`
            );
            response.data = response.data.replaceAll(
              '"assets/',
              `"${process.env.API_BASE_URL}/query-engine-monitor/${req.params.auth_token}/assets/`
            );
            res.end(response.data); // <= send data to the client
          } else {
            res.end(response.data); // <= send data to the client
          }
        }
      })
      .catch((err) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(err?.response?.data || err)); // <= send error
      });
  } else {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify([])); // <= send data to the client
  }
};

export default { forward, getSourceCode };
