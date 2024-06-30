const mongoose = require('mongoose');

// Connect to MongoDB
mongoose
	.connect(process.env.MONGO_DB_URL)
	.then(() => console.log('Connected to MongoDB'))
	.catch((error) => console.log('Error connecting to MongoDB =>', error));
