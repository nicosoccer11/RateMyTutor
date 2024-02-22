const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Add Routes here
const userRoutes = require('./routes/userRoutes');
const postsRoutes = require('./routes/postsRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');
//Add Routes here

const app = express();


// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Use the user routes
app.use(userRoutes);
// Use the posts routes
app.use(postsRoutes);
// Use the reviews routes
app.use(reviewsRoutes);



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
