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

	// Method follow -> PATCH /api/user/follow/:id
	follow: (req, res) => {
		// Check if the ID is valid
		if (
			!ObjectId.isValid(req.params.id) ||
			!ObjectId.isValid(req.body.idToFollow)
		) {
			return res.status(400).json({ message: 'Invalid ID : ' + req.params.id });
		}

		// Find the user to follow
		const updateUserFollowing = UserModel.findByIdAndUpdate(
			req.params.id, // The ID of the user who wants to follow another user
			{ $addToSet: { following: req.body.idToFollow } }, // Add the ID of the user to be followed to the "following" array
			{ new: true, upsert: true }
		).select('-password');

		// Find the user to be followed
		const updateUserFollower = UserModel.findByIdAndUpdate(
			req.body.idToFollow, // The ID of the user to be followed another user
			{ $addToSet: { followers: req.params.id } }, // Add the ID of the user who wants to follow another user to the "followers" array
			{ new: true, upsert: true }
		).select('-password');

		// Promise.all is used to execute multiple promises at the same time.
		Promise.all([updateUserFollowing, updateUserFollower])
			.then(([userFollowing, userFollower]) => {
				// Destructure the result of both promises
				if (userFollowing && userFollower) {
					// Check if both promises are successful
					res.status(200).json({ userFollowing, userFollower }); // Send a successful response with the updated users
				} else {
					res.status(404).json({ message: error });
				}
			})
			.catch((error) => {
				res.status(500).json({ message: error.message });
			});
	},

	// Method unfollow -> PATCH /api/user/unfollow/:id
	unfollow: (req, res) => {
		// Check if the ID is valid
		if (
			!ObjectId.isValid(req.params.id) ||
			!ObjectId.isValid(req.body.idToUnfollow)
		) {
			return res.status(400).json({ message: 'Invalid ID :' + req.params.id });
		}

		// Find the user to unfollow
		const updateUserFollowing = UserModel.findByIdAndUpdate(
			req.params.id, // The ID of the user who wants to unfollow another user
			{ $pull: { following: req.body.idToUnfollow } }, // Remove the ID of the user to be unfollowed from the "following" array
			{ new: true, upsert: true }
		).select('-password');

		// Find the user to be unfollowed
		const updateUserFollower = UserModel.findByIdAndUpdate(
			req.body.idToUnfollow, // The ID of the user to be unfollowed another user
			{ $pull: { followers: req.params.id } }, // Remove the ID of the user who wants to unfollow another user from the "followers" array
			{ new: true, upsert: true }
		).select('-password');

		// Promise.all is used to execute multiple promises at the same time.
		Promise.all([updateUserFollowing, updateUserFollower])
			.then(([userFollowing, userFollower]) => {
				// Destructure the result of both promises
				if (userFollowing && userFollower) {
					// Check if both promises are successful
					res.status(200).json({ userFollowing, userFollower }); // Send a successful response with the updated users
				} else {
					res.status(404).json({ message: error });
				}
			})
			.catch((error) => {
				res.status(500).json({ message: error.message });
			});
	},
};
