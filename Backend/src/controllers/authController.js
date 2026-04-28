import * as authService from "../services/authService.js";

/* ---------------- REGISTER ---------------- */
export const registerUser = async (req, res, next) => {
    try {
        const { fullName, email, password, role } = req.body;

        const user = await authService.register(fullName, email, password, role);

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
};

/* ---------------- LOGIN ---------------- */
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await authService.login(email, password);

        // SESSION CREATION
        req.session.user = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        };

        res.status(200).json({
            message: "Logged in successfully",
            user: req.session.user,
        });
    } catch (err) {
        next(err);
    }
};

/* ---------------- LOGOUT ---------------- */
export const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                message: "Logout failed",
            });
        }

        res.clearCookie("connect.sid");

        res.status(200).json({
            message: "Logged out successfully",
        });
    });
};

/* ---------------- ME (SESSION CHECK) ---------------- */
export const getMe = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            message: "Not authenticated",
        });
    }

    res.status(200).json({
        user: req.session.user,
    });
};