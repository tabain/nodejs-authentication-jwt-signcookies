const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const user = require('./user/user.route');
const mongoose = require('mongoose');
const session = require('express-session'); 
const cookieParser = require('cookie-parser');
mongoose.connect('mongodb://localhost/local',{ useNewUrlParser: true });

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/checking', function(req, res){
   res.json({
      "Tutorial": "Welcome to the Node express JWT Tutorial"
   });
});
app.use(cookieParser('CP7AWaXDfAKIRfH49dQ23T@B@!nzKJx7sKzzSoPq7/AcBBRVwlI3'));
app.use('/user', user);

app.listen(PORT, function(){
   console.log('Server is running on Port',PORT);
});
