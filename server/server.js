const express = require('express');
const userRoutes = require('./routes/userRoutes');
//Add other routes here
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use the user routes
app.use(userRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
