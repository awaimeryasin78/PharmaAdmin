const mongoose = require('mongoose')

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    genericName: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Antibiotic', 'Analgesic', 'Vitamin', 'Antacid', 'Antihistamine', 'Anti-inflammatory', 'Proton Pump Inhibitor', 'Antidiabetic', 'Other']
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    manufacturer: {
        type: String,
        trim: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    description: {
        type: String
    }
}, { timestamps: true })

const Medicine = mongoose.model('Medicine', medicineSchema)

module.exports = Medicine