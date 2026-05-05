const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
}

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email and password' })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' })
        }

        const user = await User.create({ name, email, password })

        const token = generateToken(user)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            message: 'Account created successfully',
            user: { id: user._id, name: user.name, email: user.email }
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' })
        }

        const user = await User.findOne({ email })
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const token = generateToken(user)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email }
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ user })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const logout = (req, res) => {
    res.clearCookie('token')
    res.status(200).json({ message: 'Logged out successfully' })
}

module.exports = { register, login, getProfile, logout }