const HttpStatusCode = require("../utils/httpStatusCode");
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/envConfig');

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(HttpStatusCode.BAD_REQUEST).json({ 'message': 'Email and password are required' });

    try {
        const foundUser = await User.findOne({ 'email': email });

        if (!foundUser) return res.status(HttpStatusCode.UNAUTHORIZED).json({ 'message': 'Email doesn\'t exists' });

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
                "message": "Login Successful",
                "accessToken": accessToken
            });
        } else {
            res.status(HttpStatusCode.UNAUTHORIZED).json({ 'message': 'Invalid Password' });
        }
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 'message': "Internal Server Error" });
    }
};

const addNewUser = async (req, res) => {

    try {
        const newUser = req.body;

        if (!newUser['fullName'] || !newUser['email'] || !newUser['password']) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ 'message': 'All fields are required' });
        }

        const duplicateEmail = await User.findOne({ 'email': newUser['email'] });

        if (duplicateEmail) return res.status(HttpStatusCode.CONFLICT).json({ 'message': 'User already exists' });

        const hashedPwd = await bcrypt.hash(newUser['password'], 10);

        const result = await User.create({
            fullName: newUser['fullName'],
            email: newUser['email'],
            password: hashedPwd,
        });

        return res.status(HttpStatusCode.CREATED).json();
    } catch (error) {
        console.log(error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 'message': 'Error adding user' });
    }
}

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(HttpStatusCode.UNAUTHORIZED);

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ 'refreshToken': refreshToken });
    if (!foundUser) return res.sendStatus(HttpStatusCode.FORBIDDEN);

    jwt.verify(
        refreshToken,
        config.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.email !== decoded.email) return res.sendStatus(403);

            const accessToken = jwt.sign({
                "UserInfo": {
                    "id": foundUser._id,
                    "email": foundUser.email,
                }
            }, config.ACCESS_TOKEN_SECRET, {
                expiresIn: '30m'
            });

            res.json({ "accessToken": accessToken });
        }
    );
}


const handleLogout = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(HttpStatusCode.NO_CONTENT);

        const refreshToken = cookies.jwt;

        const foundUser = await User.findOne({ 'refreshToken': refreshToken });

        if (!foundUser) {
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'None',
                secure: true
            });
            return res.sendStatus(HttpStatusCode.NO_CONTENT);
        }

        foundUser.refreshToken = '';
        const result = await foundUser.save();

        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });
        res.sendStatus(HttpStatusCode.NO_CONTENT);
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ "message": "Internal Server Error" });
    }
}

module.exports = {
    handleLogin,
    addNewUser,
    handleRefreshToken,
    handleLogout
};