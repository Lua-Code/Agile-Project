import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import validator from 'validator'

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["student", "professor", "admin","ta"],
    required: true
  }
});

userSchema.statics.register = async function(fullName, email, password, role) {
    if (!fullName || !email || !password || !role) {
        const err = new Error('Required fields are missing')
        err.statusCode = 400
        throw err;
    }
    if (!validator.isEmail(email)) {
        const err = new Error('Invalid email format')
        err.statusCode = 400
        throw err;
    }
    if (password.length < 8) {
        const err = new Error('Password must be at least 8 characters')
        err.statusCode = 400
        throw err;
    }
    const emailExists = await this.findOne({ email });
    if (emailExists) {
        const err = new Error("Email already exists.")
        err.statusCode = 409
        throw err
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await this.create({fullName, email, passwordHash, role});
    return newUser;
};

userSchema.statics.login = async function(email, password) {
    if (!email || !password ) {
        const err = new Error('Required fields are missing')
        err.statusCode = 400
        throw err;
    }

    const user = await this.findOne({ email }) 

    if (!user) {
        const err = new Error('Invalid credentials')
        err.statusCode = 401
        throw err;
    }

    const match = await bcrypt.compare(password, user.passwordHash)

    if (!match) {
        const err = new Error('Invalid credentials')
        err.statusCode = 401
        throw err;
    }

    return user
}

export default mongoose.model("User", userSchema);