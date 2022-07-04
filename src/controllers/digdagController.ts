import { Request, Response, NextFunction } from "express";
import axios from "axios";
const instance = axios.create({
  baseURL: process.env.DIGDAG_BASEURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
const forward = async (req: Request, res: Response, next: NextFunction) => {
  const uri = req.url.replace("/digdag", "");
  const contentType =
    req.headers["Content-Type"] || req.headers["content-type"] || "";
  const accept = req.headers["Accept"] || req.headers["accept"] || "";
  if (req.method === "GET") {
    if (accept === "application/gzip") {
      instance
        .get(uri, { responseType: "arraybuffer" })
        .then((response) => {
          return res.end(response.data);
        })
        .catch((err) => {
          return res.end(JSON.stringify(err?.response?.data || {})); // <= send error
        });
    } else {
      instance
        .get(uri, { params: req.query })
        .then((response) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(response.data)); // <= send data to the client
        })
        .catch((err) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(err?.response?.data || {})); // <= send error
        });
    }
  } else if (req.method === "POST") {
    instance
      .post(
        uri,
        req.body,
        contentType === "application/gzip"
          ? {
              headers: { "Content-Type": "application/gzip" },
            }
          : {}
      )
      .then((response) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(response.data));
      })
      .catch((err) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(err?.response?.data || {})); // <= send error
      });
  } else if (req.method === "PUT") {
    instance
      .put(
        uri,
        req.body,
        contentType === "application/gzip"
          ? {
              headers: { "Content-Type": "application/gzip" },
            }
          : {}
      )
      .then((response) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(response.data));
      })
      .catch((err) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(err?.response?.data || {})); // <= send error
      });
  } else if (req.method === "DELETE") {
    instance
      .delete(uri)
      .then((response) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(response.data)); // <= send data to the client
      })
      .catch((err) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(err?.response?.data || {})); // <= send error
      });
  }
};

export default { forward };
