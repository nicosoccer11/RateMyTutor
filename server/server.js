const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Add Routes here
const userRoutes = require('./routes/userRoutes');
const postsRoutes = require('./routes/postsRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');
const friendRoutes = require('./routes/friendRoutes');
const messageRoutes = require('./routes/messageRoutes');
const qualificationRoutes = require('./routes/qualificationRoutes');
const educationRoutes = require('./routes/educationRoutes');
const imageRoutes = require('./routes/imageRoutes');
const likeRoutes = require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentRoutes');
const qualityRoutes = require('./routes/qualityRoutes');
const userQualityRoutes = require('./routes/userQualityRoutes');
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
// Use the friend routes
app.use(friendRoutes);
// Use the message routes
app.use(messageRoutes);
// Use the qualification routes
app.use(qualificationRoutes);
// Use the education routes
app.use(educationRoutes);
// Use the image routes
app.use(imageRoutes);
// Use the like routes
app.use(likeRoutes);
// Use the comment routes
app.use(commentRoutes);
// Use the quality routes
app.use(qualityRoutes);
// Use the userQuality routes
app.use(userQualityRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
