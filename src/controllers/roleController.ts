import { Request, Response, NextFunction } from 'express';
import { get as getRoleModel } from '../models/role';
import { getList } from '../helpers/dataHelper';
import { errors } from '../helpers/responseHelper';

const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let users = await getRoleModel();
        return getList(res, users, "list_roles", "get_role_success", "get.role.success", "Get list role successful");
    } catch (uncaughtException) {
        return errors(res, 'request_failed', 500, 'request.failed', uncaughtException);
    }
};

export default { get };