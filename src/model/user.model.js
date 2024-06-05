import mongoose, { Schema } from "mongoose"


const userSchema = new Schema({

    username: {
        type: String,
        required: [true, "Please Provide a username"],
        unique: [true, "Username must be Unique"]
    },
    password: {
        type: String,
        required: [true, "Please Provide a Password"],

    }, email: {
        type: String,
        required: [true, "Please Provide a Email"],
        unique: [true, "Email must be Unique"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    forgetpasswordtoken: String,
    forgetpasswordtokenexpiry: Date,
    verifytoken: String,
    verifytokenexpiry: Date,
}, {
    timestamp: true
})

const User = mongoose.models.users || mongoose.model("users", userSchema)

export default User