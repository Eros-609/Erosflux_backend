const mongoose = require('mongoose')

const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    symbol: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    change24h: {
        type: Number,
        default: 0
    },
    marketCap: {
        type: String,
        default: 'N/A'
    },
    volume: {
        type: String,
        default: 'N/A'
    }
}, { timestamps: true })

module.exports = mongoose.model('Crypto', cryptoSchema)