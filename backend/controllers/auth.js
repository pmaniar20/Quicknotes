if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const crypto = require('crypto')

const User = require('../models/User')
const jwt = require('jsonwebtoken');
const ExpressError = require('../utils/ExpressError');


module.exports.createUser = async (req, res) => {
    const { username, email, password } = req.body
    const user = new User({ username, email, password })
    const resp = await user.save()
    const data = {
        user: { id: user._id }
    }
    console.log(process.env.SECRET);
    const authToken = jwt.sign(data, 'b0742345623214e7f5aac75a4200799d80b55d26a62b97cd23015c33ae3ac11513e2e7', { expiresIn: 60000 })
    res.status(201).json({ success: true, user: resp, authToken })
}

module.exports.loginUser = async (req, res) => {
    const { username, password } = req.body
    const foundUser = await User.findAndValidate(username, password)
    if (foundUser) {
        const data = {
            user: { id: foundUser._id }
        }
        const authToken = jwt.sign(data, 'b0742345623214e7f5aac75a4200799d80b55d26a62b97cd23015c33ae3ac11513e2e7', { expiresIn: 600 })
        res.status(201).json({ success: true, authToken })
    } else {
        throw new ExpressError("invalid credentials !!", 400)
    }
}

module.exports.getUser = async (req, res) => {
    const userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.status(201).json(user)
}
