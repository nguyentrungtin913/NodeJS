"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const instance = axios_1.default.create({
    baseURL: process.env.DIGDAG_BASEURL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});
const forward = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const uri = req.url.replace("/digdag", "");
    const contentType = req.headers["Content-Type"] || req.headers["content-type"] || "";
    const accept = req.headers["Accept"] || req.headers["accept"] || "";
    if (req.method === "GET") {
        if (accept === "application/gzip") {
            instance
                .get(uri, { responseType: "arraybuffer" })
                .then((response) => {
                return res.end(response.data);
            })
                .catch((err) => {
                var _a;
                return res.end(JSON.stringify(((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) || {})); // <= send error
            });
        }
        else {
            instance
                .get(uri, { params: req.query })
                .then((response) => {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(response.data)); // <= send data to the client
            })
                .catch((err) => {
                var _a;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) || {})); // <= send error
            });
        }
    }
    else if (req.method === "POST") {
        instance
            .post(uri, req.body, contentType === "application/gzip"
            ? {
                headers: { "Content-Type": "application/gzip" },
            }
            : {})
            .then((response) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(response.data));
        })
            .catch((err) => {
            var _a;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) || {})); // <= send error
        });
    }
    else if (req.method === "PUT") {
        instance
            .put(uri, req.body, contentType === "application/gzip"
            ? {
                headers: { "Content-Type": "application/gzip" },
            }
            : {})
            .then((response) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(response.data));
        })
            .catch((err) => {
            var _a;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) || {})); // <= send error
        });
    }
    else if (req.method === "DELETE") {
        instance
            .delete(uri)
            .then((response) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(response.data)); // <= send data to the client
        })
            .catch((err) => {
            var _a;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) || {})); // <= send error
        });
    }
});
exports.default = { forward };
