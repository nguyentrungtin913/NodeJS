import http from 'http';
import express, { Express, NextFunction, response, Response } from 'express';
import morgan from 'morgan';
import routes from './routes/index';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as env from 'env-var';
import errorMiddleware from "./middlewares/errorMiddleware";
const router: Express = express();
router.use(cors());

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
        host: env.get('HOST').asString() ?? "localhost" + ":" + env.get('PORT').required().asString(),
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

const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/** Logging */
router.use(morgan('dev'));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

router.use(bodyParser.raw({
    inflate: true,
    type: 'application/gzip'
}))

/** Routes */
router.use('/', routes);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

router.use(errorMiddleware)


const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 3000;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
httpServer.timeout = 10000;

