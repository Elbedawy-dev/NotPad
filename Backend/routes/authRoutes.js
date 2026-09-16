const { register, Login, logout, getMe, updateAvatar, uploadAvatarFile, updateProfile, deleteAccount } = require('../Controller/authController')
const protect = require('../middleware/protect')
const upload = require('../middleware/upload')
const express = require('express')
const router = express.Router()

router.post('/register', register)
router.post('/login', Login)
router.post('/logout', logout)
router.get('/me', protect, getMe)
router.put('/avatar', protect, updateAvatar)
router.post('/avatar/upload', protect, upload.single('avatar'), uploadAvatarFile)
router.put('/profile', protect, updateProfile)
router.delete('/me', protect, deleteAccount)

module.exports = router