const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var name = null;
var username = null;

mongoose.connect(
  "mongodb+srv://user:user@123@cluster0.bc1ab.mongodb.net/user?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/assets')))
app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/signup', (req, res) => {
  res.render(__dirname + '/views/signup.ejs')
})

app.get('/login', (req, res) => {
  res.render(__dirname + '/views/login.ejs')
})

app.post("/signup", urlencodedParser, (req, res, next) => {
  console.log(req.body.email)
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user.save().then(result => {
              console.log(result);
              name = result.email;
              username = result._id;
              res.status(201).redirect('/profile');
            }).catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              });
            });
          }
        });
      }
    });
});


app.post("/login", (req, res, next) => {
  User.find({ email: req.body.email }).exec().then(user => {
    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      if (result) {
        name = req.body.email;
        username = new mongoose.Types.ObjectId();
        return res.redirect('/profile')
      }
      res.status(401).json({
        message: "Auth failed"
      });
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

app.get('/profile', (req, res, next) => {
  res.render(__dirname + '/views/index.ejs', { name: name, username: username })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('Port no is http://localhost:4000/signup');
});