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
Object.defineProperty(exports, "__esModule", { value: true });
const role_1 = require("../models/role");
const dataHelper_1 = require("../helpers/dataHelper");
const responseHelper_1 = require("../helpers/responseHelper");
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = yield (0, role_1.get)();
        return (0, dataHelper_1.getList)(res, users, "list_roles", "get_role_success", "get.role.success", "Get list role successful");
    }
    catch (uncaughtException) {
        return (0, responseHelper_1.errors)(res, 'request_failed', 500, 'request.failed', uncaughtException);
    }
});
exports.default = { get };
