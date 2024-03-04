const db = require('../config/db');
const { bucket_name, bucket_region, access_key, secret_access_key } = require('../config/s3');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require('crypto')

const s3 = new S3Client ({
    region: bucket_region,
    credentials: {
      accessKeyId: access_key,
      secretAccessKey: secret_access_key
    }
  });

//TODO: keep or not
const dotenv = require('dotenv');
dotenv.config();

// helper function
async function fetchUserByUsername(username) {
    try {
      const result = await db.query('SELECT * FROM users WHERE Username = $1', [username]);
  
      if (result.rows.length > 0) {
        return result.rows[0]; // Return the user object
      } else {
        return null; // No user found
      }
    } catch (err) {
      console.error(err.message);
      throw new Error('Server Error, check console for logs'); // Propagate error
    }
  }

// Updating user's profile picture
const UserUploadPicture = async (imageName,username) => {
  try {
    await db.query('UPDATE users SET profilepicture = $1 WHERE username = $2', [imageName, username]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error, check console for logs');
  }
};

const getUserProfilePicture = async(req,res) => {
  const { username } = req.params;
    try {
      const user = await fetchUserByUsername(username);
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
};

const randomImageName = (bytes = 32) => crypto.randomBytes(16).toString('hex')
const imageName = randomImageName()
const createUserProfilePicture = async(req,res) => {
  const { username } = req.params;
  const user = await fetchUserByUsername(username); 
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
  const params = {
    Bucket: bucket_name,
    Key: imageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }
  
  const command = new PutObjectCommand(params)
  await s3.send(command)
  // update database with image
  await UserUploadPicture(imageName),username; 
  res.send({});
};

// delete user profile pic
const deleteUserProfilePicture = async(req,res) => {
  const { username } = req.params;
  const user = await fetchUserByUsername(username); //TODO: currently hardcoded 
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
  res.send({});
};
// Export the functions
module.exports = {
  UserUploadPicture,
  getUserProfilePicture,
  createUserProfilePicture,
  deleteUserProfilePicture,
};