const express = require('express');
const userRoutes = require('./routes/user.routes');
require('dotenv').config({ path: './config/.env' });
require('./config/db');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/user', userRoutes);

// Start the server
app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
