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

	// Method getUserById -> GET /api/user/:id
	getUserById: (req, res) => {
		console.log(req.params);
		// Check if the ID is valid
		if (!ObjectId.isValid(req.params.id)) {
			return res.status(400).json({ message: 'Invalid ID ' + req.params.id });
		}

		UserModel.findById(req.params.id)
			.select('-password')
			.then((user) => {
				if (user) {
					res.status(200).json(user);
				} else {
					res.status(404).json({ message: 'User not found' });
				}
			})
			.catch((error) => {
				res.status(500).json({ message: 'ID not found', error: error });
			});
	},

	// Method updateUser -> PUT /api/user/:id
	updateUser: (req, res) => {
		// Check if the ID is valid
		if (!ObjectId.isValid(req.params.id)) {
			return res.status(400).json({ message: 'Invalid ID' + req.params.id });
		}

		// $set is used to set the value of a field to a new value.
		UserModel.findOneAndUpdate(
			{ _id: req.params.id },
			{ $set: { bio: req.body.bio } },
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		)
			.then((user) => {
				if (user) {
					res.status(200).json(user);
				} else {
					res.status(404).json({ message: 'User not found' });
				}
			})
			.catch((error) => {
				res.status(500).json({ message: error.message });
			});
	},

	// Method deleteUser -> DELETE /api/user/:id
	deleteUser: (req, res) => {
		// Check if the ID is valid
		if (!ObjectId.isValid(req.params.id)) {
			return res.status(400).json({ message: 'Invalid ID' + req.params.id });
		}

		UserModel.findOneAndDelete({ _id: req.params.id })
			.then((user) => {
				if (user) {
					res.status(200).json({ message: 'Successfully deleted user' });
				} else {
					res.status(404).json({ message: 'User not found' });
				}
			})
			.catch((error) => {
				res.status(500).json({ message: error.message });
			});
	},
};
