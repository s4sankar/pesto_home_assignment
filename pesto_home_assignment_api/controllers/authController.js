const HttpStatusCode = require("../utils/httpStatusCode");
const User = require('../models/User');

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Email and password are required' });

    try {
        const foundUser = await User.findOne({ 'email': email });

        if (!foundUser) return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'Email doesn\'t exists' });

        // Evaluate Password
        const match = await bcrypt.compare(password, foundUser.password);

        if (match) {
            const accessToken = jwt.sign({
                "UserInfo": {
                    "id": foundUser._id,
                    "email": foundUser.email,
                }
            }, config.ACCESS_TOKEN_SECRET, {
                expiresIn: '30m'
            });

            const refreshToken = jwt.sign({
                "email": foundUser.email,
            }, config.REFRESH_TOKEN_SECRET, {
                expiresIn: '1d'
            });

            foundUser.refreshToken = refreshToken;
            const result = await foundUser.save();

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 1000 * 60 * 60 * 24,
            });

            res.json({
                "message": "Login Successful", "userInfo": {
                    "fullName": foundUser.fullName,
                    "email": foundUser.email,
                    "accessToken": accessToken
                }
            });
        } else {
            res.status(HttpStatusCode.UNAUTHORIZED).json({ "error": 'Invalid Password' });
        }
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ "error": "Internal Server Error" });
    }
};

const addNewUser = async (req, res) => {

    try {
        const newUser = req.body;

        if (!newUser['fullName'] || !newUser['email'] || !newUser['password']) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'All fields are required' });
        }

        const duplicateEmail = await User.findOne({ 'email': newUser['email'] });

        if (duplicateEmail) return res.status(HttpStatusCode.CONFLICT).json({ error: 'User already exists' });

        const hashedPwd = await bcrypt.hash(newUser['password'], 10);

        const result = await User.create({
            fullName: newUser['fullName'],
            email: newUser['email'],
            password: hashedPwd,
        });

        return res.status(HttpStatusCode.CREATED).json({ result });
    } catch (error) {
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ "error": 'Error adding user' });
    }
}

module.exports = {
    handleLogin,
    addNewUser,
};