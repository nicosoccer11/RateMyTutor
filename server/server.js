const multer = require('multer');
const express = require('express');
const cors = require('cors'); 
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv')


dotenv.config()

// Load environment variables
const { bucket_name, bucket_region, access_key, secret_access_key } = process.env;

const s3 = new S3Client ({
    region: bucket_region,
    credentials: {
      accessKeyId: access_key,
      secretAccessKey: secret_access_key
    }
  });

// Add Routes here
const userRoutes = require('./routes/userRoutes');
const postsRoutes = require('./routes/postsRoutes');
//Add Routes here

const app = express();
app.use(cors());
// For image stuff
const storage = multer.memoryStorage()
const upload = multer({storage: storage})


app.post('/api/posts', upload.single('image'), async (req, res) => {
  console.log("Route accessed!");
  console.log("req.file", req.file);
  // the req.file.buffer is the important part
  const params = {
    Bucket: bucket_name,
    Key: req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }
  const command = new PutObjectCommand(params)
  await s3.send(command)
  res.send({});
});

// Middleware to parse JSON bodies
app.use(express.json());

// Use the user routes
app.use(userRoutes);
// User the posts routes
app.use(postsRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
