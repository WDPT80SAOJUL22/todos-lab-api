const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');

const router = Router();

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            throw new Error ('all fields are required!')
        }
        const user = await User.findOne({email});
        if (user) {
            throw new Error('email already registered')
        }
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(password, salt)
        const newUser = await User.create({
            name,
            email,
            passwordHash: hash
        })
        res.status(201).json({user: newUser.name, email: newUser.email})
    } catch (error) {
        res.status(500).json({msg:`User not created`})
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email})
        if (!user) {
            throw new Error('User not found')
        }
        const verificationHash = bcrypt.compareSync(password, user.passwordHash)
        if (!verificationHash) {
            throw new Error('Invalid email or password')
        }
        const payload = {
            id: user._id,
            name: user.name,
            email
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d'    
        })
        res.status(200).json({user: payload, token})
    } catch {
        res.status(500).json({msg:`Login error`})
    }
})

module.exports = router;