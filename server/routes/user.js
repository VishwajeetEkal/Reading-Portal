const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user_model');
//const profile  = require('../models/Profile');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const ResetToken = require('../models/reset_token');
const generateToken = require('../helper/generate_token');

router.post('/login', async (req, res) => {
  try {
    let user;
    if (req.body.emailOrUsername.includes('@')) {
      user = await User.findOne({ email: req.body.emailOrUsername });
    } else {
      user = await User.findOne({ username: req.body.emailOrUsername });
    }

    if (!user) return res.status(400).send('User not found');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    const token = jwt.sign(
      { userId: user._id },
      'mysecretkey170904',  
      { expiresIn: '5h' }  
    );

    // Send token to frontend
    res.json({ token:token,role:user.role });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/signup', async (req, res) => {
    try {
      const emailName = req.body.email.split('@')[0];
      const randomNum = Math.floor(Math.random() * 10000);
      const username = `${emailName}${randomNum}`;

      if(req.body.password != req.body.confirmpassword)
      res.send({message: 'password not matched'});
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        role: req.body.role,
        email: req.body.email,
        username: username,
        password: hashedPassword,
        securityQuestion1 : req.body.securityQuestion1,
        securityAnswer1 : req.body.securityAnswer1,
        securityQuestion2 : req.body.securityQuestion2,
        googleId: "-",
        securityAnswer2: req.body.securityAnswer2
      })
      res.send({message :'ok'})
    } catch (error) {
        console.log(error)
        res.json({status: 'error', error: 'Duplicate email'})
    }
  });

  router.post('/Forgot', async (req,res) => {
    const email = req.body.email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No account with this email found." });
  }
  const token = generateToken();
  //console.log("generate Token", token);
//console.log("user",user);
    // Save the token in the database
    const resetToken = new ResetToken({
        userId: user.username,
        token: token
    });
    await resetToken.save();
    let mailTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user:"ubookint@gmail.com",
            pass:"ufgj gaun khqk vpsn"
        }
    });
    const details = {
        from:"Support@UBook.com",
        to:email,
        subject:"Password Reset",
        //text:'http://localhost:3000/Reset/${user._id}'
        html: `<p>Hi, This email is being sent in response to a password reset request. Please click <a href ='https://ubookfront.onrender.com/Reset?token=${token}/'>here</a> to reset your password.</p>`
    }
    const check = await mailTransport.sendMail(details);
    res.send({message: 'ok'});
    console.log =("Status ",check.status);
});

router.post('/get-security-questions', async (req,res) => {
  const email = req.body.email
  try{
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "No account with this email found." });
}
const questions = {
  question1: user.securityQuestion1,
  question2: user.securityQuestion2
  };
  console.log(questions)
res.json(questions);
  } catch(err){
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post('/verify-answers', async (req, res) => {
  const { email, answers } = req.body;
  const user = await User.findOne({ email });
  const verifiedAnswers = [user.securityAnswer1, user.securityAnswer2]
  console.log(user)
  console.log(email,answers)
  if (!user || JSON.stringify(verifiedAnswers) !== JSON.stringify(answers)) {
      return res.status(400).json({ message: 'Answer is incorrect or email not found' });
  }
  const token = generateToken();
 
    const resetToken = new ResetToken({
        userId: user.username,
        token: token
    });
    await resetToken.save();
  return res.status(200).json({resetToken: resetToken})
});


  router.post('/reset/:token', async (req, res) => {
    const {token} = req.params
    const resetToken = await ResetToken.findOne({ token });
    //console.log("resetToken",resetToken)
    
    if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired token." });}
    //const {password} = req.body
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //console.log(hashedPassword)

    try{
     // User.findByIdAndUpdate({_id:id},{password})
     const user = await User.findOne({username:resetToken.userId});
     console.log(user);
    user.password = hashedPassword;
    await user.save();
    await ResetToken.deleteOne({ token });
      res.send('Password was changed');
    }
    catch (error) {
      res.status(500).send(error.message)
    }
  });
  //gets personal user profile by token
  /*router.post('/profile/:token', (req,res) => {
    const {token} = req.params
    const resetToken = await ResetToken.findOne({ token });
    const user = await User.findOne({username:resetToken.userId});
    res.send(user.firstname,user.lastname);
  })*/
module.exports = router;

router.get('/home', async (req, res) => {
  const token = req.header('x-auth-token');
//console.log(token)
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, 'mysecretkey170904');
    //console.log(decoded)
    // Find user by ID
    const user = await User.findById(decoded.userId).select('-password'); // Exclude password from user data
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user data
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
});

router.get('/user', async (req, res) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, 'mysecretkey170904');
    //console.log(decoded)
    // Find user by ID
    const user = await User.findById(decoded.userId);
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Send user data
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
});
