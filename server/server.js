const multer = require('multer');// TODO: move 
const express = require('express');
const cors = require('cors'); // TODO: move 
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteBucketCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');// TODO: move 
const dotenv = require('dotenv')// TODO: move 
const crypto = require('crypto')// TODO: move 
const { UserUploadPicture, getUserByUsername,fetchUserByUsername } = require('./controllers/usersController.js'); // TODO: move 
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
//const {jimp} = require('jimp')

dotenv.config()// TODO: move 

const randomImageName = (bytes = 32) => crypto.randomBytes(16).toString('hex')
const imageName = randomImageName()
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

app.get('/api/posts', async (req, res) => {
  const { username } = req.query;
  //const user = await getUserByUsername({ params: { username } }, res);
  
  // add error handeling
  try {
    const user = await fetchUserByUsername(username);
    // console.log("Here")
    // console.log(user.username);
    // console.log("Here")
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const pictureName = user.profilepicture;

    const getObjectParams = {
    Bucket: bucket_name,
    Key: pictureName,
    }
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.json({ imageUrl: url });
  } catch (error) {
    console.error('Error retrieving user data:', error);
    res.status(500).send('Server Error');
  }
  
});

app.post('/api/posts', upload.single('image'), async (req, res) => {
  // Checking if image url already exists so we can delete the image from S3
  
  const user = await fetchUserByUsername("User test"); //TODO: currently hardcoded 
  if (!user) {
    
    return res.status(404).json({ error: 'User not found' });
  }
  const pictureURL = user.profilepicture;
  if (pictureURL != ""){
    const params = {
      Bucket: bucket_name,
      Key:pictureURL,
    } 
    const command = new DeleteObjectCommand(params)
    await s3.send(command);
  }
  // Posting new image
  // the req.file.buffer is the important part, its the image itself

  // resizing the image
  // const image = await jimp.read(req.file.buffer);
  // await image.resize(500, 500);
  // const buffer = await image.getBufferAsync(Jimp.AUTO);
  const params = {
    Bucket: bucket_name,
    Key: imageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }
  
  const command = new PutObjectCommand(params)
  await s3.send(command)
  // update database with image
  await UserUploadPicture(imageName); 
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
