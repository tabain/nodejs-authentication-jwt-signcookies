const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const User = require('./user.model');
const jwt = require('jsonwebtoken');



router.post('/signup', function(req, res) {
	console.log(JSON.stringify(req.body));   
//console.log(bcrypt);

 const user = new User({
            _id: new  mongoose.Types.ObjectId(),
            email: req.body.email,
            password: req.body.password,
            username:req.body.username,
            fullName:req.body.fullName
         });
    user.save().then(function(result) {
        console.log(result);
        res.status(200).json({
            success: 'New user has been created'
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });


})


router.post('/signin', function(req, res){
  User.findOne({email: req.body.email})
    .exec()
    .then(function(user) {
        user.verifyPassword( req.body.password, function (err, isMatched) {
            if (err) return res.status(401).json({
                failed: 'Unauthorized Access'
            });
            if (!isMatched)  return res.status(401).json({
                failed: 'Unauthorized Access'
            });
            else {
                const JWTToken = jwt.sign({
                        email: user.email,
                        _id: user._id
                    },
                    'secret-jwt-auth',
                    {
                        expiresIn: '2h'
                    });
                res.cookie('Authorization',JWTToken, {path:'/',httpOnly:true,signed: true , secure:process.env.cookieSecure === 'true' ? true : false });
                return res.status(200).json({
                    success: 'OK',
                    token: JWTToken,
                    user: user
                });

            };
        } );
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
});

router.get('/me', function (req, res,next) {

    if (req.signedCookies.Authorization) {
        jwt.verify(req.signedCookies.Authorization, 'secret-jwt-auth', function(err, decoded) {
            if (err) return res.status(500).json({
                error: err
            });
            User.findOne({email:decoded.email})
                .then(user => {
                    return res.status(200).json({
                        success: 'OK',
                        user: user
                    });
                })
                .catch(err =>{
                    res.status(500).json({
                        error: err
                    });
                })
        });
    }
    else next('Authorization Failed');
})

module.exports = router;
