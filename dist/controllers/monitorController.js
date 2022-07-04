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
const qs_1 = __importDefault(require("qs"));
const tough_cookie_1 = require("tough-cookie");
const axios_cookiejar_support_1 = require("axios-cookiejar-support");
const instance = axios_1.default.create({
    baseURL: process.env.QUERY_ENGINE_MONITOR_BASEURL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});
const getSourceCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    (0, axios_cookiejar_support_1.wrapper)(axios_1.default);
    const jar = new tough_cookie_1.CookieJar();
    const { config, data } = yield axios_1.default.post(`${process.env.QUERY_ENGINE_MONITOR_BASEURL}/login`, qs_1.default.stringify({ username: "admin" }), { headers: { "Content-Type": "application/x-www-form-urlencoded" }, jar });
    const cookies = Array.isArray((_b = (_a = config === null || config === void 0 ? void 0 : config.jar) === null || _a === void 0 ? void 0 : _a.toJSON()) === null || _b === void 0 ? void 0 : _b.cookies)
        ? (_d = (_c = config === null || config === void 0 ? void 0 : config.jar) === null || _c === void 0 ? void 0 : _c.toJSON()) === null || _d === void 0 ? void 0 : _d.cookies
        : [];
    if (cookies) {
        const tokenCookie = cookies.find((cookie) => cookie.key === "Trino-UI-Token");
        if (tokenCookie) {
            res.setHeader("Content-Type", "application/html");
            return res.send(data
                .replaceAll('href="', `href="${process.env.API_BASE_URL}/query-engine-monitor/${req.body.currToken}/`)
                .replaceAll('src="', `src="${process.env.API_BASE_URL}/query-engine-monitor/${req.body.currToken}/`));
        }
    }
    res.setHeader("Content-Type", "application/html");
    return res.end("");
});
const forward = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h;
    const uri = req.url
        .replace("/query-engine-monitor", "")
        .replace(`/${req.params.auth_token}`, "");
    (0, axios_cookiejar_support_1.wrapper)(axios_1.default);
    const jar = new tough_cookie_1.CookieJar();
    const { config } = yield axios_1.default.post(`${process.env.QUERY_ENGINE_MONITOR_BASEURL}/login`, qs_1.default.stringify({ username: "admin" }), { headers: { "Content-Type": "application/x-www-form-urlencoded" }, jar });
    const cookies = Array.isArray((_f = (_e = config === null || config === void 0 ? void 0 : config.jar) === null || _e === void 0 ? void 0 : _e.toJSON()) === null || _f === void 0 ? void 0 : _f.cookies)
        ? (_h = (_g = config === null || config === void 0 ? void 0 : config.jar) === null || _g === void 0 ? void 0 : _g.toJSON()) === null || _h === void 0 ? void 0 : _h.cookies
        : [];
    const headers = {};
    if (cookies) {
        const tokenCookie = cookies.find((cookie) => cookie.key === "Trino-UI-Token");
        if (tokenCookie) {
            headers["Cookie"] = `${tokenCookie === null || tokenCookie === void 0 ? void 0 : tokenCookie["key"]}=${tokenCookie === null || tokenCookie === void 0 ? void 0 : tokenCookie["value"]}`;
        }
    }
    const configToRequest = { params: req.query, headers };
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
            }
            else if (uri.indexOf(".png") > -1) {
                res.setHeader("Content-Type", "image/png");
                res.end(response.data); // <= send data to the client
            }
            else {
                if (uri.indexOf("dist/index.js") > -1) {
                    response.data = response.data.replaceAll('"/ui/api/', `"${process.env.API_BASE_URL}/query-engine-monitor/${req.params.auth_token}/api/`);
                    response.data = response.data.replaceAll(`'/ui/api/`, `'${process.env.API_BASE_URL}/query-engine-monitor/${req.params.auth_token}/api/`);
                    response.data = response.data.replaceAll('"assets/', `"${process.env.API_BASE_URL}/query-engine-monitor/${req.params.auth_token}/assets/`);
                    res.end(response.data); // <= send data to the client
                }
                else {
                    res.end(response.data); // <= send data to the client
                }
            }
        })
            .catch((err) => {
            var _a;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) || err)); // <= send error
        });
    }
    else {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify([])); // <= send data to the client
    }
});
exports.default = { forward, getSourceCode };
