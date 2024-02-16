import jwt from "jsonwebtoken";

export const isValidRequest = (req) => {
    return (
        req.body &&
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    );
};

export const decodeToken = (token, privateKey) => {
    const verifiedToken = jwt.verify(token, privateKey, function (err, decoded) {
        if (err) {
            throw err;
        }
        return decoded;
    });
    return verifiedToken;
};