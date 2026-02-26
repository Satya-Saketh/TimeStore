import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const JWT_SECRET = 'your_jwt_secret_here';

export const authMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: " Not Authorized, Token is missing"
        })
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(payload.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user not found"
            })
        }

        req.user = user;

        next();
    } catch (error) {

        console.error("JWT Verification Failed: ", error);
        return res.status(401).json({ success: false, message: "Token Expired or missing" });

    }

}