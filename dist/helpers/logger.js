"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston = __importStar(require("winston"));
require("winston-daily-rotate-file");
module.exports = winston.createLogger({
    // format của log được kết hợp thông qua format.combine
    format: winston.format.combine(winston.format.splat(), 
    // Định dạng time cho log
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), 
    // thêm màu sắc
    winston.format.colorize(), 
    // thiết lập định dạng của log
    winston.format.printf(log => {
        // nếu log là error hiển thị stack trace còn không hiển thị message của log 
        if (log.stack)
            return `[${log.timestamp}] [${log.level}] ${log.stack}`;
        return `[${log.timestamp}] [${log.level}] ${log.message}`;
    })),
    transports: [
        // hiển thị log thông qua console
        new winston.transports.DailyRotateFile({
            filename: 'gend-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            maxSize: '20m',
            maxFiles: '14d'
        }),
    ],
});
