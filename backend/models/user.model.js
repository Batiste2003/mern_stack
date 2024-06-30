const mongoose = require('mongoose');
// Import validator to ensure that the email is valid
const { isEmail } = require('validator');

// Define the user schema
const userSchema = new mongoose.Schema(
	{
		pseudo: {
			type: String,
			required: true,
			minLength: 3,
			maxLength: 20,
			unique: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			validate: [isEmail],
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 6,
			maxLength: 1024,
		},
		bio: {
			type: String,
			maxLength: 1024,
		},
		followers: {
			type: [String],
		},
		following: {
			type: [String],
		},
		likes: {
			type: [String],
		},
	},
	{
		timestamps: true,
	}
);

// Create the User model
const UserModel = mongoose.model('User', userSchema);

// Export the User model
module.exports = UserModel;
