const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

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

	// Method signIn -> POST /api/user/login
	signIn: (req, res) => {
		const { email, password } = req.body;

		UserModel.login(email, password)
			.then((user) => {
				const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
					expiresIn: '1h',
				});
				res.status(200).json({ token: token, message: 'Login successful' });
			})
			.catch((error) => res.status(400).json({ error: 'Invalid Credentials' }));
	},
};
