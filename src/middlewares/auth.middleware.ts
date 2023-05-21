import { Request,Response,NextFunction } from "express";
import * as token from '../utils/token'
import HttpException from "../utils/exceptions/http.exception";
import { JsonWebTokenError } from "jsonwebtoken";

async function authMiddleware(req:Request,res:Response,next:NextFunction)
: Promise<Response| void> 
{
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401,'Unauthorised User'));
    }

    const tokenString = bearer.split('Bearer ')[1].trim();
    try {
        const payload = await token.verifyToken(tokenString);
        if(payload instanceof JsonWebTokenError){
            return next(new HttpException(401,'Unauthorised User'));
        }
        return next();
    } catch (error) {
        return next(new HttpException(401,'Unauthorised User'));
    }
}

export default authMiddleware;