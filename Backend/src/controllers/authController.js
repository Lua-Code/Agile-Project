import User from './../models/User.js';
import { generateToken } from './../utils/generateJWT.js';

export const registerUser = async (req, res, next) => {
    try {
        const { fullName, email, password, role } = req.body;
        const newUser = await User.register(fullName, email, password, role)

        const token = generateToken(newUser)

        res.status(201).json({
            token,
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            role: newUser.role
        })
    } catch(err) {
        if (err.name === 'TypeError') {
            err.statusCode = 400
            err.message = 'All required fields must be filled'
        }
        next(err)
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.login(email, password);

        const token = generateToken(user)

        res.status(200).json({
            token,
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        })
    } catch(err) {
        if (err.name === 'TypeError') {
            err.statusCode = 400
            err.message = 'All required fields must be filled'
        }
        next(err)
    }
}