const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({ // create scheme for transactions collection
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // reference to User model
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'], // only allow these two values cite: https://mongoosejs.com/docs/schematypes.html#enum
        required: true
    },
    amount: {
        type: Number,
        min: 0,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    note: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);