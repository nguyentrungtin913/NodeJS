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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("./routes/index"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const env = __importStar(require("env-var"));
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const router = (0, express_1.default)();
router.use((0, cors_1.default)());
process.env.TZ = env.get("TIMEZONE").asString();
const swaggerOptions = {
    swaggerDefinition: {
        schemes: [
            "https",
            "ws"
        ],
        info: {
            title: "GenD API",
            version: '1.0.0',
        },
        host: (_a = env.get('HOST').asString()) !== null && _a !== void 0 ? _a : "localhost" + ":" + env.get('PORT').required().asString(),
        securityDefinitions: {
            Bearer: {
                type: "apiKey",
                name: "Authorization",
                in: "header"
            }
        },
        security: [
            {
                Bearer: []
            }
        ]
    },
    // apis: ["src/routes/index.ts"],
    apis: ["dist/routes/index.js"],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
router.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
/** Logging */
router.use((0, morgan_1.default)('dev'));
/** Parse the request */
router.use(express_1.default.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express_1.default.json());
router.use(body_parser_1.default.raw({
    inflate: true,
    type: 'application/gzip'
}));
/** Routes */
router.use('/', index_1.default);
/** Error handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});
router.use(errorMiddleware_1.default);
const httpServer = http_1.default.createServer(router);
const PORT = (_b = process.env.PORT) !== null && _b !== void 0 ? _b : 3000;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
httpServer.timeout = 10000;
