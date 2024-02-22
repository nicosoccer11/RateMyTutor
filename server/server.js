const express = require('express');

// Add Routes here
const userRoutes = require('./routes/userRoutes');
const postsRoutes = require('./routes/postsRoutes');
//Add Routes here

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use the user routes
app.use(userRoutes);
// User the posts routes
app.use(postsRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
