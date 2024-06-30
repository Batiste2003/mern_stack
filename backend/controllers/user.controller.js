const UserModel = require('../models/user.model');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
	// Method getAllUsers -> GET /api/user/
	getAllUsers: (req, res) => {
		UserModel.find()

			// We dont want to send the password to the client
			.select('-password')
			.then((users) => {
				res.status(200).json(users);
			})
			.catch((error) => {
				res.status(500).json(error);
			});
	},
};
