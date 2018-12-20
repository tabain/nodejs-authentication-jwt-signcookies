const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./user.model');
const jwt = require('jsonwebtoken');



router.post('/signup', function(req, res) {
	console.log(JSON.stringify(req.body));   
//console.log(bcrypt);

 const user = new User({
            _id: new  mongoose.Types.ObjectId(),
            email: req.body.email,
            password: req.body.password
         });
console.log('2  ');
         user.save().then(function(result) {
            console.log(result);
            res.status(200).json({
               success: 'New user has been created'
            });
         }).catch(error => {
            res.status(500).json({
               error: err
            });
});
})


router.post('/signin', function(req, res){
  User.findOne({email: req.body.email})
    .exec()
    .then(function(user) {
      if(user.password === req.body.password) {
        
	const JWTToken = jwt.sign({
        email: user.email,
        _id: user._id
      },
      'secret-jwt-auth',
       {
         expiresIn: '2h'
       });
       res.cookie('Authorization',JWTToken, {path:'/',httpOnly:true,signed: true ,expire:1800, secure:process.env.cookieSecure === 'true' ? true : false });
       return res.status(200).json({
         success: 'Welcome to the JWT Auth',
         token: JWTToken
       });		

      }
      return res.status(401).json({
        failed: 'Unauthorized Access'
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
});

router.get('/me', middle, function (req, res) {
       return res.status(200).json({
        success: 'Welcome to the JWT Auth',
        token: 'success'
    });
})
function middle(req,res, next){

    if (req.signedCookies.Authorization) {
        jwt.verify(req.signedCookies.Authorization, 'secret-jwt-auth', function(err, decoded) {
            if (err) next('Authorization Failed');
            else next(null);
        });
    }
    else next('Authorization Failed');

}
module.exports = router;
