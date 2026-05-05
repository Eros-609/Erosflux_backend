const Crypto = require('../models/Crypto')

const getAllCryptos = async (req, res) => {
    try {
        const cryptos = await Crypto.find().sort({ createdAt: -1 })
        res.status(200).json({ cryptos })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const getGainers = async (req, res) => {
    try {
        const gainers = await Crypto.find({ change24h: { $gt: 0 } }).sort({ change24h: -1 })
        res.status(200).json({ cryptos: gainers })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const getNewListings = async (req, res) => {
    try {
        const newListings = await Crypto.find().sort({ createdAt: -1 })
        res.status(200).json({ cryptos: newListings })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const addCrypto = async (req, res) => {
    try {
        const { name, symbol, price, image, change24h } = req.body

        if (!name || !symbol || !price) {
            return res.status(400).json({ message: 'Please provide name, symbol and price' })
        }

        const existing = await Crypto.findOne({ symbol: symbol.toUpperCase() })
        if (existing) {
            return res.status(400).json({ message: 'Cryptocurrency with this symbol already exists' })
        }

        const crypto = await Crypto.create({
            name,
            symbol: symbol.toUpperCase(),
            price,
            image: image || '',
            change24h: change24h || 0
        })

        res.status(201).json({ message: 'Cryptocurrency added successfully', crypto })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

module.exports = { getAllCryptos, getGainers, getNewListings, addCrypto }