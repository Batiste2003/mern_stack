const mongoose = require('mongoose');
// Import validator to ensure that the email is valid
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

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
		picture: {
			type: String,
			default: './uploads/profil/random-user.png',
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

// Hash the password before saving it to the database
userSchema.pre('save', function (next) {
	const user = this;

	bcrypt
		.genSalt()
		.then((salt) => bcrypt.hash(user.password, salt))
		.then((hash) => {
			user.password = hash;
			next();
		})
		.catch((error) => console.log('Error hashing the password =>', error));
});

// Login the user if the password is correct
userSchema.statics.login = function (email, password) {
	return this.findOne({ email })
		.then((user) => {
			if (!user) {
				return Promise.reject('Invalid email or password');
			}
			return bcrypt.compare(password, user.password).then((auth) => {
				if (auth) {
					return user;
				} else {
					return Promise.reject('Invalid email or password');
				}
			});
		})
		.catch((error) => console.log('Error logging in the user =>', error));
};

// Create the User model
const UserModel = mongoose.model('User', userSchema);

// Export the User model
module.exports = UserModel;
