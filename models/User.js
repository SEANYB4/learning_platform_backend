const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    assignments: [{
        file: Buffer,
        contentType: String,
        submitted: { type: Date, default: Date.now }
    }]
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 8)
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    console.log('Comparing passwords...');
    return await bcrypt.compare(candidatePassword, this.password);

}

const User = mongoose.model('User', userSchema);

module.exports = User;