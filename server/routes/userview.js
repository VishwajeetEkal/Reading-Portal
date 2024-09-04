const express = require('express');
const jwt = require('jsonwebtoken'); 
const Book = require('../models/Book');  
const User = require('../models/user_model');
const multer = require('multer');
const router = express.Router();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1]; 

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: 'Failed to authenticate token.' });
        }

        req.userId = decoded.id;
        next();
    });
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './postedbooks/');
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
const upload = multer({ storage: storage });

router.post('/postbook', verifyToken, upload.single('image'), async (req, res) => {
    try {
        if (typeof req.body.location === 'string') {
            try {
              req.body.location = JSON.parse(req.body.location);
            } catch (e) {
              return res.status(400).json({ message: 'Invalid location format' });
            }
          }
          
        const bookData = req.body;
        bookData.image = req.file.path;
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1]; 
        const decoded = jwt.verify(token, 'mysecretkey170904');
        const user = await User.findById(decoded.userId);
        bookData.owner_user_id = user._id;
        console.log(bookData);
        const newBook = new Book(bookData);
        await newBook.save();

        res.json({ message: 'Book posted successfully' });
    } catch (error) {
        console.error('Error posting book:', error);
        res.status(500).json({ message: 'Error posting book' });
    }
});

router.get('/browsebooks', async (req, res) => {
  try {
    const books = await Book.find({active:true}).populate();
    //console.log(books);
    res.json(books);
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

module.exports = router;


module.exports = router;