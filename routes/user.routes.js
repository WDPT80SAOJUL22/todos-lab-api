const { Router } = require('express')

const User = require('../models/User')

const router = Router()

router.get('/', async (req, res) => {
    try {
        const userFromDb = await User.find().populate('todos')
        res.status(200).json(userFromDb)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports = router
