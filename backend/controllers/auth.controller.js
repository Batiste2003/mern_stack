const UserModel = require('../models/user.model');

module.exports = {
	// Method signUp -> POST /api/user/register
	signUp: (req, res) => {
		// console.log(req.body);
		const { pseudo, email, password } = req.body;
		const newUser = new UserModel({ pseudo, email, password });
		newUser
			.save()
			.then((user) => res.status(201).json({ user: user._id }))
			.catch((error) => res.status(400).json(error));
	},
};
