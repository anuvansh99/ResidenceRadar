import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
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
    avatar: {
        type: String,
        default: "https://thumbs.dreamstime.com/b/illustration-profile-icon-avatar-young-farmer-male-237709823.jpg" 
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;