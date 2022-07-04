"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const settingController_1 = __importDefault(require("../controllers/settingController"));
const userController_1 = __importDefault(require("../controllers/userController"));
const userRoleController_1 = __importDefault(require("../controllers/userRoleController"));
const fileController_1 = __importDefault(require("../controllers/fileController"));
const roleController_1 = __importDefault(require("../controllers/roleController"));
const checkJwt_1 = require("../middlewares/checkJwt");
const digdagController_1 = __importDefault(require("../controllers/digdagController"));
const monitorController_1 = __importDefault(require("../controllers/monitorController"));
const datalakeFolderController_1 = __importDefault(require("../controllers/datalakeFolderController"));
const datalakeFileController_1 = __importDefault(require("../controllers/datalakeFileController"));
const projectController_1 = __importDefault(require("../controllers/projectController"));
const router = express_1.default.Router();
/**
 * @swagger
 * /login:
 *   post:
 *     description: Log in to the system
 *     parameters:
 *      - name: email
 *        description: email exists in the system
 *        in: formData
 *        required: true
 *        type: string
 *      - name: password
 *        description: email exists in the system
 *        in: formData
 *        required: true
 *        type: string
 *
 *     responses:
 *       200:
 *         description: Login success
 *         schema:
 *              type: object
 *              properties:
 *                   code:
 *                      type: string
 *                   msgKey:
 *                      type: string
 *                   description:
 *                      type: string
 *                   data:
 *                      type: object
 *                      properties:
 *                          accessToken:
 *                              type: string
 */
router.post("/login", authController_1.default.login);
/**
 * @swagger
 * /setting:
 *   get:
 *     description: Get timezone
 *     responses:
 *       200:
 *         description: Get timezone success
 *         schema:
 *              type: object
 *              properties:
 *                  code:
 *                      type: string
 *                  msgKey:
 *                      type: string
 *                  description:
 *                      type: string
 *                  data:
 *                      type: string
 */
router.get("/setting", [checkJwt_1.checkJwt], settingController_1.default.setting);
// user
/**
 * @swagger
 * /me:
 *   get:
 *     description: Get profile user login
 *     responses:
 *       200:
 *         description: Get profile success
 *         schema:
 *              type: object
 *              properties:
 *                  code:
 *                      type: string
 *                  msgKey:
 *                      type: string
 *                  description:
 *                      type: string
 *                  data:
 *                      type: object
 *                      properties:
 *                          user_id:
 *                              type: string
 *                          user_email:
 *                              type: string
 *                          user_first_name:
 *                              type: string
 *                          user_last_name:
 *                              type: string
 *                          user_status:
 *                              type: integer
 *                          user_create_at:
 *                              type: string
 *                              format: date-time
 *                          user_update_at:
 *                              type: string
 *                              format: date-time
 *                          user_create_by:
 *                              type: string
 *                          user_update_by:
 *                              type: string
 *                          user_roles:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      user_id:
 *                                          type: string
 *                                      role_id:
 *                                          type: string
 *                                      user_role_create_date:
 *                                          type: string
 *                                          format: date-time
 *                                      user_role_update_date:
 *                                          type: string
 *                                          format: date-time
 *                                      user_role_create_by:
 *                                          type: string
 *                                      user_role_update_by:
 *                                          type: string
 *                                      role:
 *                                          type: object
 *                                          properties:
 *                                              role_id:
 *                                                  type: integer
 *                                              role_name:
 *                                                  type: integer
 *                                              role_create_date:
 *                                                  type: string
 *                                                  format: date-time
 *                                              role_update_date:
 *                                                  type: string
 *                                                  format: date-time
 *                                              role_create_by:
 *                                                  type: string
 *                                              role_update_by:
 *                                                  type: string
 *
 *
 */
router.get("/me", [checkJwt_1.checkJwt], userController_1.default.getProfile);
/**
 * @swagger
 * /users:
 *   post:
 *     description: Get all user
 *     parameters:
 *      - name: page
 *        in: formData
 *        description: Page
 *        type: string
 *      - name: limit
 *        in: formData
 *        description: Limit
 *        type: string
 *      - name: status
 *        in: formData
 *        description: Status
 *        type: string
 *      - name: email
 *        in: formData
 *        description: Email
 *        type: string
 *     responses:
 *       200:
 *         description: Get a list of successful users
 *         schema:
 *              type: object
 *              properties:
 *                  code:
 *                      type: string
 *                  msgKey:
 *                      type: string
 *                  description:
 *                      type: string
 *                  data:
 *                      type: object
 *                      properties:
 *                          ListUsers:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      user_id:
 *                                          type: string
 *                                      user_email:
 *                                          type: string
 *                                      user_first_name:
 *                                          type: string
 *                                      user_last_name:
 *                                          type: string
 *                                      user_status:
 *                                          type: integer
 *                                      user_create_at:
 *                                          type: string
 *                                          format: date-time
 *                                      user_update_at:
 *                                          type: string
 *                                          format: date-time
 *                                      user_create_by:
 *                                          type: string
 *                                      user_update_by:
 *                                          type: string
 *                                      user_roles:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  user_id:
 *                                                      type: string
 *                                                  role_id:
 *                                                      type: string
 *                                                  user_role_create_date:
 *                                                      type: string
 *                                                      format: date-time
 *                                                  user_role_update_date:
 *                                                      type: string
 *                                                      format: date-time
 *                                                  user_role_create_by:
 *                                                      type: string
 *                                                  user_role_update_by:
 *                                                      type: string
 *                                                  role:
 *                                                      type: object
 *                                                      properties:
 *                                                          role_id:
 *                                                              type: integer
 *                                                          role_name:
 *                                                              type: integer
 *                                                          role_create_date:
 *                                                              type: string
 *                                                              format: date-time
 *                                                          role_update_date:
 *                                                              type: string
 *                                                              format: date-time
 *                                                          role_create_by:
 *                                                              type: string
 *                                                          role_update_by:
 *                                                              type: string
 *
 *
 */
router.post("/users", [checkJwt_1.checkJwt], userController_1.default.searchByCriteria);
/**
 * @swagger
 * /users/register:
 *   post:
 *     description: Register account
 *     parameters:
 *      - name: email
 *        in: formData
 *        description: Email
 *        required: true
 *        type: string
 *      - name: password
 *        in: formData
 *        description: Password
 *        required: true
 *        type: string
 *      - name: confirmPassword
 *        in: formData
 *        description: Confirm password
 *        required: true
 *        type: string
 *      - name: firstName
 *        in: formData
 *        description: First name
 *        required: true
 *        type: string
 *      - name: lastName
 *        in: formData
 *        description: Last name
 *        required: true
 *        type: string
 *      - name: token
 *        in: formData
 *        description: Token
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Create successful user
 *         schema:
 *              type: object
 *              properties:
 *                  code:
 *                      type: string
 *                  msgKey:
 *                      type: string
 *                  description:
 *                      type: string
 *                  data:
 *                      type: object
 *                      properties:
 *                          accessToken:
 *                              type: string
 */
router.post("/users/register", userController_1.default.register);
/**
 * @swagger
 * /users/invitation:
 *   post:
 *     description: Invite users to the system
 *     parameters:
 *      - name: mailTo
 *        in: formData
 *        description: Email invite
 *        required: true
 *        type: array
 *        items:
 *          type: string
 *        collectionFormat: multi
 *      - name: role
 *        in: formData
 *        description: Role user
 *        required: true
 *        type: string
 *      - name: text
 *        in: formData
 *        description: Text
 *        type: string
 *     responses:
 *       200:
 *         description: Find successful user
 *         schema:
 *              type: object
 *              properties:
 *                  code:
 *                      type: string
 *                  msgKey:
 *                      type: string
 *                  description:
 *                      type: string
 *                  data:
 *                      type: string
 *
 */
router.post("/users/invitation", [checkJwt_1.checkJwt], userController_1.default.inviteUser);
/**
 * @swagger
 * /users/delete:
 *   post:
 *     description: Delete user
 *     parameters:
 *      - name: userId
 *        in: formData
 *        description: User id to delete
 *        required: true
 *        type: number
 *
 *     responses:
 *      200:
 *         description: Find successful user
 *         schema:
 *              type: object
 *              properties:
 *                  code:
 *                      type: string
 *                  msgKey:
 *                      type: string
 *                  description:
 *                      type: string
 *                  data:
 *                      type: object
 *                      properties:
 *                          count:
 *                              type: integer
 *                              format: int64
 *
 */
router.post("/users/delete", [checkJwt_1.checkJwt], userController_1.default.softDelete);
/**
 * @swagger
 * /users/validate-invitation-link:
 *   post:
 *     description: Validate invitation link
 *     parameters:
 *      - name: token
 *        in: formData
 *        description: Token
 *        required: true
 *        type: string
 *
 *     responses:
 *      200:
 *         description: Invitation link is valid
 *         schema:
 *              type: object
 *              properties:
 *                  code:
 *                      type: string
 *                  msgKey:
 *                      type: string
 *                  description:
 *                      type: string
 *                  data:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *
 */
router.post("/users/validate-invitation-link", userController_1.default.validateInvitationLink);
/**
 * @swagger
 * /users/role:
 *   put:
 *     description: Update user role
 *     parameters:
 *      - name: userId
 *        description: User id exists in the system
 *        in: formData
 *        required: true
 *        type: string
 *      - name: roleId
 *        description: Role id exists in the system
 *        in: formData
 *        required: true
 *        type: string
 *
 *     responses:
 *       200:
 *         description: Update user role success
 *         schema:
 *              type: object
 *              properties:
 *                   code:
 *                      type: string
 *                   msgKey:
 *                      type: string
 *                   description:
 *                      type: string
 *                   data:
 *                      type: object
 *                      properties:
 *                          user_id:
 *                              type: string
 *                          role_id:
 *                              type: string
 *                          user_role_create_date:
 *                              type: string
 *                              format: date-time
 *                          user_role_update_date:
 *                              type: string
 *                              format: date-time
 *                          user_role_create_by:
 *                              type: string
 *                          user_role_update_by:
 *                              type: string
 *
 */
router.put("/users/role", [checkJwt_1.checkJwt], userRoleController_1.default.update);
//File
/**
 * @swagger
 * /files:
 *   get:
 *     description: Detail file
 *     parameters:
 *      - name: projectId
 *        in: query
 *        description: Project id exists in the system
 *        required: true
 *        type: integer
 *        format: int64
 *      - name: workflowId
 *        in: query
 *        description: Workflow id exists in the system
 *        required: true
 *        type: integer
 *        format: int64
 *
 *     responses:
 *       200:
 *         description: Get list file success
 *         schema:
 *              type: object
 *              properties:
 *                   code:
 *                      type: string
 *                   msgKey:
 *                      type: string
 *                   description:
 *                      type: string
 *                   data:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              file_id:
 *                                  type: string
 *                              file_path:
 *                                  type: string
 *                              project_id:
 *                                  type: string
 *                              file_create_date:
 *                                  type: date-time
 *                              file_update_date:
 *                                  type: date-time
 *                              file_create_by:
 *                                  type: string
 *                              file_update_by:
 *                                  type: string
 *                              file_deleted:
 *                                  type: string
 *                              file_deleted_at:
 *                                  type: string
 *                              file_content:
 *                                  type: string
 *
 */
router.get("/files", [checkJwt_1.checkJwt], fileController_1.default.listFiles);
/**
 * @swagger
 * /files:
 *   post:
 *     description: Create file
 *     parameters:
 *      - name: projectName
 *        description: Project name exists in the system
 *        in: formData
 *        required: true
 *        type: string
 *      - name: workflowId
 *        description: Workflow id exists in the system
 *        in: formData
 *        required: true
 *        type: string
 *      - name: projectRevision
 *        description: Project revision exists in the system
 *        in: formData
 *        type: string
 *      - name: fileName
 *        description: File name
 *        in: formData
 *        type: string
 *      - name: content
 *        description: File content
 *        in: formData
 *        type: string
 *
 *     responses:
 *       200:
 *         description: Create workflow success
 *         schema:
 *              type: object
 *              properties:
 *                   code:
 *                      type: string
 *                   msgKey:
 *                      type: string
 *                   description:
 *                      type: string
 *                   data:
 *                      type: object
 *                      properties:
 *                          file_id:
 *                              type: string
 *                          file_path:
 *                              type: string
 *                          project_id:
 *                              type: string
 *                          file_create_date:
 *                              type: date-time
 *                          file_update_date:
 *                              type: date-time
 *                          file_create_by:
 *                              type: string
 *                          file_update_by:
 *                              type: string
 *                          file_deleted:
 *                              type: string
 *                          file_deleted_at:
 *                              type: string
 *
 */
router.post("/files", [checkJwt_1.checkJwt], fileController_1.default.updateOrCreateFile);
/**
 * @swagger
 * /files:
 *   delete:
 *     description: Delete file
 *     parameters:
 *      - name: fileName
 *        description: File name exists in the system
 *        in: formData
 *        required: true
 *        type: string
 *      - name: workflowId
 *        description: Workflow id exists in the system
 *        in: formData
 *        required: true
 *        type: string
 *      - name: projectId
 *        description: Project id exists in the system
 *        in: formData
 *        required: true
 *        type: string
 *
 *     responses:
 *       200:
 *         description: Delete file success
 *         schema:
 *              type: object
 *              properties:
 *                   code:
 *                      type: string
 *                   msgKey:
 *                      type: string
 *                   description:
 *                      type: string
 *                   data:
 *                      type: object
 *                      properties:
 *                          file_id:
 *                              type: string
 *                          file_path:
 *                              type: string
 *                          project_id:
 *                              type: string
 *                          file_create_date:
 *                              type: date-time
 *                          file_update_date:
 *                              type: date-time
 *                          file_create_by:
 *                              type: string
 *                          file_update_by:
 *                              type: string
 *                          file_deleted:
 *                              type: string
 *                          file_deleted_at:
 *                              type: string
 *
 */
router.delete("/files/:fileId", [checkJwt_1.checkJwt], fileController_1.default.deleteFile);
//role
/**
 * @swagger
 * /roles:
 *   get:
 *     description: Get all role
 *     responses:
 *       200:
 *         description: Get a list of successful users
 *         schema:
 *              type: object
 *              properties:
 *                  code:
 *                      type: string
 *                  msgKey:
 *                      type: string
 *                  description:
 *                      type: string
 *                  data:
 *                      type: object
 *                      properties:
 *                          ListRoles:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      role_id:
 *                                          type: string
 *                                      role_name:
 *                                          type: string
 *                                      role_create_date:
 *                                          type: date-time
 *                                      role_update_date:
 *                                          type: date-time
 *                                      role_create_by:
 *                                          type: string
 *                                      role_update_by:
 *                                          type: string
 *
 *
 */
router.get("/roles", [checkJwt_1.checkJwt], roleController_1.default.get);
router.all("/digdag/*", [checkJwt_1.checkJwt], digdagController_1.default.forward);
router.get("/query-engine-monitor/source-code", [checkJwt_1.checkJwt], monitorController_1.default.getSourceCode);
router.all("/query-engine-monitor/:auth_token/*", [checkJwt_1.checkJwt], monitorController_1.default.forward);
router.get("/datalake-folder", [checkJwt_1.checkJwt], datalakeFolderController_1.default.listFolders);
router.post("/datalake-folder", [checkJwt_1.checkJwt], datalakeFolderController_1.default.createFolder);
router.delete("/datalake-folder/:folderId", [checkJwt_1.checkJwt], datalakeFolderController_1.default.deleteFolder);
router.get("/datalake-folder/:folderId/files", [checkJwt_1.checkJwt], datalakeFileController_1.default.listFiles);
router.get("/datalake-folder/:folderId/files/:fileId", [checkJwt_1.checkJwt], datalakeFileController_1.default.detailFile);
router.post("/datalake-folder/:folderId/file", [checkJwt_1.checkJwt], datalakeFileController_1.default.createFile);
router.put("/datalake-folder/:folderId/files/:fileId", [checkJwt_1.checkJwt], datalakeFileController_1.default.updateFile);
router.delete("/datalake-folder/:folderId/files/:fileId", [checkJwt_1.checkJwt], datalakeFileController_1.default.deleteFile);
router.all("/datalake-query/*", [checkJwt_1.checkJwt], datalakeFileController_1.default.forward);
router.get("/projects", projectController_1.default.listProjects);
router.post("/projects", [checkJwt_1.checkJwt], projectController_1.default.createProject);
module.exports = router;
