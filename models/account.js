const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const accountSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

// Hash password before saving
accountSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
    }
    next();
});

// Method to check the entered password against the hashed one
accountSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, (err, match) => {
        if (err) {
            return callback(err);
        }
        callback(null, match);
    });
};

module.exports = mongoose.model('Account', accountSchema, 'account');
