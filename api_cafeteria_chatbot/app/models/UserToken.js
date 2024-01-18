const mongoose = require("mongoose")
//modelo de los productos
const userTokenSchema = new mongoose.Schema({ 
    username: { type: String, required: true, unique: true},
    password: String
},{timestamps: true})
const UserToken = mongoose.model('UsersToken', userTokenSchema)

module.exports = UserToken
