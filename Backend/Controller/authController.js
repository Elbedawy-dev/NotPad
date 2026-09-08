const User = require('../models/User')
const bcrypt = require('bcrypt')
const generateToken = require('../utils/generateToken')

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(400).json({
                message: 'user already exist'
            });
        }

        const newUser = await User.create({
            name,
            email,
            password
        });

        const token = generateToken(newUser._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const Login = async(req, res) => {

    try {
        const {email, password} = req.body;
        const loginUser  = await User.findOne({email})
    
        if (!loginUser ) {
            return res.status(400).json({ message: 'Email or Password is wrong' });
        }

        const isMatch = await bcrypt.compare(password, loginUser.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'password is invalid' });
        } 

        const token = generateToken(loginUser._id)
        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }) 

        return res.status(200).json({
            _id: loginUser._id,
            name: loginUser.name,
            email: loginUser.email
        });
    } catch (error) {
       return res.status(500).json({message: error.message})
    }
}

const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    return res.status(200).json({ message: 'logout success' });
}

const getMe = async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select('-password');

        if(!user) {
            return res.status(404).json({message: 'User not found'})
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {register, Login, logout, getMe}