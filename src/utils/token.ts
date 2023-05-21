import jwt from "jsonwebtoken";
import Token from "./interfaces/token.interfact";


const createToken = (id:string):string =>{
    const expiresIn = 3600;
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: Token = {
        id: id,
        expiresIn:expiresIn
    }
    return jwt.sign(dataStoredInToken,secret as jwt.Secret,{expiresIn});
}
const verifyToken = async (
    token: string
): Promise<jwt.VerifyErrors | Token> => {
    const secret = process.env.JWT_SECRET;
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret as jwt.Secret, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded as Token);
        });
    });
}

export {createToken,verifyToken};