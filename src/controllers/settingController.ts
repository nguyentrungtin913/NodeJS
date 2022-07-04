import { Request, Response, NextFunction } from 'express';
import { success } from '../helpers/responseHelper';

const setting = (req: Request, res: Response, next: NextFunction) => {
    let timeZone = process.env.TIMEZONE ?? null;
    return success(res, 'get_setting_success', 'get.success', 'Request successfully', timeZone);
};

export default { setting };
