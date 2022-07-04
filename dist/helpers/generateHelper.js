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
exports.nameDefault = void 0;
const fs_1 = __importDefault(require("fs"));
function nameDefault(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        let dem = 0;
        while (true) {
            console.log(dir + "New.dig");
            console.log(dem);
            if (dem !== 0) {
                if (!fs_1.default.existsSync(dir + "New-" + dem + ".dig")) {
                    break;
                }
            }
            else {
                if (!fs_1.default.existsSync(dir + "New.dig")) {
                    break;
                }
            }
            dem++;
        }
        return dem;
    });
}
exports.nameDefault = nameDefault;
