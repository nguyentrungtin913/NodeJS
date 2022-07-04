import * as Yup from 'yup';
import { Request, Response, NextFunction } from "express";
import { setError } from '../helpers/errorHelper';

export async function auth(req: Request, res: Response) {
    const email = req.body.email ?? '';
    const password = req.body.password ?? '';
    const auth = {
        email,
        password
    };
    try {
        const schema = Yup.object().shape({
            email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
            password: Yup.string().max(255).required("Password is required"),
        });
        await schema.validate(auth, { abortEarly: false });
        return true;
    } catch (error) {
        const err = JSON.parse(JSON.stringify(error));
        let description = '';
        let msgKey = '';
        let code = ''
        if (err.errors) {
            switch (err.errors[0]) {
                case "Must be a valid email":
                    description = 'Must be a valid email';
                    msgKey = 'email.invalid';
                    code = 'email_invalid';
                    break;
                case "Email is required":
                    description = 'Email is required';
                    msgKey = 'email.required';
                    code = 'email_required';
                    break;
                case "Password is required":
                    description = 'password is required';
                    msgKey = 'password.required';
                    code = 'password_required';
                    break;
                default:
                    description = 'error';
                    msgKey = 'error';
                    code = 'error';
                    break;
            }
        }
        setError(res, 400, code, msgKey, description)
        return false;
    }
}
