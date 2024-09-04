

const express = require('express');
const router = express.Router();
const passport = require('../config/passport-setup');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const token = req.user.token;
        // Successful authentication, redirect home.

        //const token = jwt.sign({ id: req.user.id }, 'mysecretkey170904', { expiresIn: '1h' });
        
        //res.cookie('token', token, { httpOnly: true, secure: true });
        //localStorage.setItem('token', response.data.token);
        //res.redirect(`http://localhost:3000/Home?token=${token}`);
        //res.redirect('http://localhost:3000/Home');
        res.redirect(`https://ubook.onrenderfront.com/authcallback?token=${token}`);

        //res.redirect('http://localhost:3000/Home');
        //res.redirect('https://ubook.onrenderfront.com/Home')

    }
);

module.exports = router;
