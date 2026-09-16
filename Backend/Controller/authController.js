const User = require('../models/User')
const Note = require('../models/Note')
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
            email: newUser.email,
            avatar: newUser.avatar,
            createdAt: newUser.createdAt
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
            email: loginUser.email,
            avatar: loginUser.avatar,
            createdAt: loginUser.createdAt
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

const cloudinary = require('../config/cloudinary')

const updateAvatar = async (req, res) => {
    try {
        const { avatar } = req.body
        const user = await User.findByIdAndUpdate(req.user.id, { avatar }, { new: true }).select('-password')
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const uploadAvatarFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        let avatarUrl;
        const dataURI = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        try {
            const result = await cloudinary.uploader.upload(dataURI, { folder: "notpad_avatars" })
            avatarUrl = result.secure_url
        } catch (err) {
            console.error("Cloudinary upload failed, using data URI fallback:", err.message)
            avatarUrl = dataURI
        }

        const user = await User.findByIdAndUpdate(req.user.id, { avatar: avatarUrl }, { new: true }).select('-password')
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, avatar } = req.body
        const updateFields = {}
        if (name !== undefined) updateFields.name = name
        if (avatar !== undefined) updateFields.avatar = avatar

        const user = await User.findByIdAndUpdate(req.user.id, updateFields, { new: true }).select('-password')
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const deleteAccount = async (req, res) => {
    try {
        await Note.deleteMany({ user: req.user.id })
        await User.findByIdAndDelete(req.user.id)
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        return res.status(200).json({ message: 'Account and associated notes deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = { register, Login, logout, getMe, updateAvatar, uploadAvatarFile, updateProfile, deleteAccount }