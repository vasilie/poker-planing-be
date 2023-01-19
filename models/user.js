const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    email: { type: String, required: true},
    firstName: { type: String },
    lastName: { type: String },
}, {collection: "users" });

const model = mongoose.model("UserSchema", UserSchema);

module.exports = model;