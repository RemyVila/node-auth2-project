const router = require("express").Router();
const { checkUsernameExists, validateRoleName } = require('./auth-middleware');
const { JWT_SECRET } = require("../secrets"); // use this secret!
const jwt = require('jsonwebtoken')
const Auths = require('./auth-middleware')
const bcryptjs = require('bcryptjs')
const User = require('../users/users-model')

router.post("/register", validateRoleName, (req, res, next) => {
  const credentials = req.body;

  /**
    [POST] /api/auth/register { "username": "anna", "password": "1234", "role_name": "angel" }

    response:
    status 201
    {
      "user"_id: 3,
      "username": "anna",
      "role_name": "angel"
    }
   */
});


router.post("/login", checkUsernameExists, (req, res, next) => {
  const { username, password } = req.body

  if(Auths.checkUsernameExists(req.body)) {
    User.findBy({username: username})
    .then(([user]) => {
      if(user && bcryptjs.compareSync(password, user.password)) {
        res.status(200).json({ message: 'Welcome, validated user!'} )
      } else {
        res.status(401).json({message: 'NOPE!'});
      }
    })
  }
  
  /**
    [POST] /api/auth/login { "username": "sue", "password": "1234" }

    response:
    status 200
    {
      "message": "sue is back!",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ETC.ETC"
    }

    The token must expire in one day, and must provide the following information
    in its payload:

    {
      "subject"  : 1       // the user_id of the authenticated user
      "username" : "bob"   // the username of the authenticated user
      "role_name": "admin" // the role of the authenticated user
    }
   */
});

module.exports = router;
