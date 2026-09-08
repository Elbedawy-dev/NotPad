const { register, Login, logout, getMe } = require('../Controller/authController')
const protect = require('../middleware/protect')    
const express = require('express')
const router = express.Router()

router.post('/register', register)
router.post('/login', Login)
router.post('/logout', logout)
router.get('/me', protect, getMe)

module.exports = router