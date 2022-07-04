import express from "express";
import authController from "../controllers/authController";
import settingController from "../controllers/settingController";
import userController from "../controllers/userController";
import userRoleController from "../controllers/userRoleController";
import fileController from "../controllers/fileController";
import roleController from "../controllers/roleController";
import { checkJwt } from "../middlewares/checkJwt";
import workflowController from "../controllers/workflowController";
import digdagController from "../controllers/digdagController";
import monitorController from "../controllers/monitorController";
import datalakeFolderController from "../controllers/datalakeFolderController";
import datalakeFileController from "../controllers/datalakeFileController";
import projectController from "../controllers/projectController";
const router = express.Router();

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

router.post("/login", authController.login);

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
router.get("/setting", [checkJwt], settingController.setting);

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
router.get("/me", [checkJwt], userController.getProfile);
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
router.post("/users", [checkJwt], userController.searchByCriteria);
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
router.post("/users/register", userController.register);
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
router.post("/users/invitation", [checkJwt], userController.inviteUser);
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
router.post("/users/delete", [checkJwt], userController.softDelete);
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
router.post(
  "/users/validate-invitation-link",
  userController.validateInvitationLink
);

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
router.put("/users/role", [checkJwt], userRoleController.update);
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
router.get("/files", [checkJwt], fileController.listFiles);

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
router.post("/files", [checkJwt], fileController.updateOrCreateFile);
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
router.delete("/files/:fileId", [checkJwt], fileController.deleteFile);

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
router.get("/roles", [checkJwt], roleController.get);

router.all("/digdag/*", [checkJwt], digdagController.forward);
router.get(
  "/query-engine-monitor/source-code",
  [checkJwt],
  monitorController.getSourceCode
);
router.all(
  "/query-engine-monitor/:auth_token/*",
  [checkJwt],
  monitorController.forward
);
/**
 * @swagger
 * /datalake-folders:
 *   get:
 *     description: Get list folders
 *     parameters:
 *      - name: folderId
 *        in: query
 *        description: Folder id
 *        required: true
 *        type: integer
 *        format: int64
 *     responses:
 *       200:
 *         description: List folders successful
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
 *                          folders:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      dl_folder_id:
 *                                          type: number
 *                                      dl_folder_name:
 *                                          type: string
 *                                      dl_parent_folder_id:
 *                                          type: number
 *                                      dl_folder_deleted:
 *                                          type: number
 *                                      dl_folder_created_by:
 *                                          type: number
 *                                      dl_folder_updated_by:
 *                                          type: number
 *                                      dl_folder_deleted_at:
 *                                          type: string
 *                                          format: date-time
 *                                      dl_folder_updated_at:
 *                                          type: string
 *                                          format: date-time
 *                                      dl_folder_created_at:
 *                                          type: string
 *                                          format: date-time
 *                                      files:
 *                                          type: array
 *                                          items:
 *                                            type: object
 *                                            properties:
 *                                              dl_file_id:
 *                                                type: number
 *                                              dl_file_name:
 *                                                type: string
 *                                              dl_folder_id:
 *                                                type: number
 *                                              dl_file_content:
 *                                                type: string
 *                                              dl_file_deleted:
 *                                                type: number
 *                                              dl_file_created_by:
 *                                                type: number
 *                                              dl_file_updated_by:
 *                                                type: number
 *                                              dl_file_deleted_at:
 *                                                type: string
 *                                                format: date-time
 *                                              dl_file_updated_at:
 *                                                type: string
 *                                                format: date-time
 *                                              dl_file_created_at:
 *                                                type: string
 *                                                format: date-time
 *
 *
 */
router.get(
  "/datalake-folders",
  [checkJwt],
  datalakeFolderController.listFolders
);
/**
 * @swagger
 * /datalake-folders:
 *   post:
 *     description: Create a folder
 *     parameters:
 *      - name: folderName
 *        in: formData
 *        description: Folder name
 *        required: true
 *        type: string
 *      - name: parentFolderId
 *        in: formData
 *        description: Parent folder id
 *        required: true
 *        type: number
 *     responses:
 *       200:
 *         description: Create folder successfully
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
 *                          dl_folder_id:
 *                            type: number
 *                          dl_folder_name:
 *                            type: string
 *                          dl_parent_folder_id:
 *                            type: number
 *                          dl_folder_deleted:
 *                            type: number
 *                          dl_folder_created_by:
 *                            type: number
 *                          dl_folder_updated_by:
 *                            type: number
 *                          dl_folder_deleted_at:
 *                            type: string
 *                            format: date-time
 *                          dl_folder_updated_at:
 *                            type: string
 *                            format: date-time
 *                          dl_folder_created_at:
 *                            type: string
 *                            format: date-time
 *
 *
 */
router.post(
  "/datalake-folders",
  [checkJwt],
  datalakeFolderController.createFolder
);

/**
 * @swagger
 * /datalake-folders/{folderId}:
 *   delete:
 *     description: Delete a folder
 *     parameters:
 *      - name: folderId
 *        in: path
 *        description: Folder id
 *        required: true
 *        type: number
 *     responses:
 *       200:
 *         description: Delete folder successfully
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
 *                      type: null
 *
 */
router.delete(
  "/datalake-folders/:folderId",
  [checkJwt],
  datalakeFolderController.deleteFolder
);

/**
 * @swagger
 * /datalake-folders/{folderId}/files:
 *   get:
 *     description: Get list file
 *     parameters:
 *      - name: folderId
 *        in: path
 *        description: Folder id
 *        required: true
 *        type: number
 *     responses:
 *       200:
 *         description: Get list files successfully
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
 *                          folders:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      dl_file_id:
 *                                          type: number
 *                                      dl_file_name:
 *                                          type: string
 *                                      dl_folder_id:
 *                                          type: number
 *                                      dl_file_content:
 *                                          type: string
 *                                      dl_file_deleted:
 *                                          type: number
 *                                      dl_file_created_by:
 *                                          type: number
 *                                      dl_file_updated_by:
 *                                          type: number
 *                                      dl_file_deleted_at:
 *                                          type: string
 *                                          format: date-time
 *                                      dl_file_updated_at:
 *                                          type: string
 *                                          format: date-time
 *                                      dl_file_created_at:
 *                                          type: string
 *                                          format: date-time
 *
 */
router.get(
  "/datalake-folders/:folderId/files",
  [checkJwt],
  datalakeFileController.listFiles
);
/**
 * @swagger
 * /datalake-folders/{folderId}/files/{fileId}:
 *   get:
 *     description: Get detail file
 *     parameters:
 *      - name: folderId
 *        in: path
 *        description: Folder id
 *        required: true
 *        type: number
 *      - name: fileId
 *        in: path
 *        description: File id
 *        required: true
 *        type: number
 *     responses:
 *       200:
 *         description: Get detail file successfully
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
 *                          dl_file_id:
 *                              type: number
 *                          dl_file_name:
 *                              type: string
 *                          dl_folder_id:
 *                              type: number
 *                          dl_file_content:
 *                              type: string
 *                          dl_file_deleted:
 *                              type: number
 *                          dl_file_created_by:
 *                              type: number
 *                          dl_file_updated_by:
 *                              type: number
 *                          dl_file_deleted_at:
 *                              type: string
 *                              format: date-time
 *                          dl_file_updated_at:
 *                              type: string
 *                              format: date-time
 *                          dl_file_created_at:
 *                              type: string
 *                              format: date-time
 *                                  
 *
 */
router.get(
  "/datalake-folders/:folderId/files/:fileId",
  [checkJwt],
  datalakeFileController.detailFile
);
/**
 * @swagger
 * /datalake-folders/{folderId}/file:
 *   post:
 *     description: Create file
 *     parameters:
 *      - name: folderId
 *        in: path
 *        description: Folder id
 *        required: true
 *        type: number
 *      - name: fileName
 *        in: formData
 *        description: File name
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Create file successfully
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
 *                          dl_file_id:
 *                              type: number
 *                          dl_file_name:
 *                              type: string
 *                          dl_folder_id:
 *                              type: number
 *                          dl_file_content:
 *                              type: string
 *                          dl_file_deleted:
 *                              type: number
 *                          dl_file_created_by:
 *                              type: number
 *                          dl_file_updated_by:
 *                              type: number
 *                          dl_file_deleted_at:
 *                              type: string
 *                              format: date-time
 *                          dl_file_updated_at:
 *                              type: string
 *                              format: date-time
 *                          dl_file_created_at:
 *                              type: string
 *                              format: date-time
 *                                  
 *
 */
router.post(
  "/datalake-folders/:folderId/file",
  [checkJwt],
  datalakeFileController.createFile
);
/**
 * @swagger
 * /datalake-folders/{folderId}/files/{fileId}:
 *   put:
 *     description: Update file
 *     parameters:
 *      - name: folderId
 *        in: path
 *        description: Folder id
 *        required: true
 *        type: number
 *      - name: fileId
 *        in: path
 *        description: File id
 *        required: true
 *        type: number
 *      - name: fileContent
 *        in: formData
 *        description: File name
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Update file successfully
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
 *                          dl_file_id:
 *                              type: number
 *                          dl_file_name:
 *                              type: string
 *                          dl_folder_id:
 *                              type: number
 *                          dl_file_content:
 *                              type: string
 *                          dl_file_deleted:
 *                              type: number
 *                          dl_file_created_by:
 *                              type: number
 *                          dl_file_updated_by:
 *                              type: number
 *                          dl_file_deleted_at:
 *                              type: string
 *                              format: date-time
 *                          dl_file_updated_at:
 *                              type: string
 *                              format: date-time
 *                          dl_file_created_at:
 *                              type: string
 *                              format: date-time
 *                                  
 *
 */
router.put(
  "/datalake-folders/:folderId/files/:fileId",
  [checkJwt],
  datalakeFileController.updateFile
);
/**
 * @swagger
 * /datalake-folders/{folderId}/files/{fileId}:
 *   delete:
 *     description: Delete file
 *     parameters:
 *      - name: folderId
 *        in: path
 *        description: Folder id
 *        required: true
 *        type: number
 *      - name: fileId
 *        in: path
 *        description: File id
 *        required: true
 *        type: number
 *     responses:
 *       200:
 *         description: Delete file successfully
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

router.delete(
  "/datalake-folders/:folderId/files/:fileId",
  [checkJwt],
  datalakeFileController.deleteFile
);


router.put(
  "/datalake-folders/:folderId/files/:fileId/parent",
  [checkJwt],
  datalakeFileController.updateParentFolder
);
router.all("/datalake-query/*", [checkJwt], datalakeFileController.forward);
router.get("/projects", projectController.listProjects);
router.post("/projects", [checkJwt], projectController.createProject);
router.post("/workflows", [checkJwt], workflowController.createWorkflow);
export = router;
