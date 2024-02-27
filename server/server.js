const express = require('express');
const cors = require('cors'); // Stuff breaks if you remove this

// Load environment variables

// Add Routes here
const userRoutes = require('./routes/userRoutes');
const postsRoutes = require('./routes/postsRoutes');
const imageRoutes = require('./routes/imageRoutes');
//Add Routes here

const app = express();
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Use the user routes
app.use(userRoutes);
// User the posts routes
app.use(postsRoutes);
// Use the image routes
app.use(imageRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
