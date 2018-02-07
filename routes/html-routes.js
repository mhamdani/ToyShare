// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
const db = require('../models');

// Routes
// =============================================================
module.exports = (app) => {


  // index route loads view.html
  app.get('/', (req, res) => {
    /* **** Sample/Mocked Data *****/
    const data = [
      {
        id: 1,
        poster_name: 'Michelle',
        item_name: 'Baby Bjorn',
        item_img: '',
        item_desc: 'Baby Carrier',
        borrowed: '',
        poster_email: 'example@gmail.com'
      },
      {
        id: 2,
        poster_name: 'Patricia',
        item_name: 'Pack n Play',
        item_img: '',
        item_desc: 'Baby Crib/Bassinet',
        borrowed: '',
        poster_email: 'example@gmail.com'
      }
    ];
    /* **** Sample/Mocked Data *****/

    res.render('index', { post: data });
  });

  /****** Route for listing all posts ******/
  app.get('/posts/', (req, res) => {

    db.Post.findAll({
      include: db.Document//,
      // where: {
      //   borrowed: true;
      // }
    }).then(function (data) {
      console.log(data);
      res.render('post-listing', { post: data });
    });

  });

  /****** Route for the new Post page ******/
  app.get('/posts/new', (req, res) => {

    res.render('upload');
  });

  // Proof of concept file Uploader.
  app.get('/posts/:id', (req, res) => {

    db.Post.findOne({
      include: db.Document,
      where: {
        id: req.params.id
      }
    }).then(function (data) {
      res.render('post-detail', { post: data.dataValues });
    });

  });
  app.get('/posts/success/:id', (req, res) => {

    db.Post.findOne({
      include: db.Document,
      where: {
        id: req.params.id
      }
    }).then(function (data) {
      res.render('success', { post: data.dataValues });
    });

  });

  // Sending them
  app.get("/signup", (req, res) => {
    res.render("signup");
  });


  app.get("/signin", (req, res) => {
    res.render("signin");
  });



  // Receiving from the client
  app.post("/signin", (req, res) => {

    const {
      email,
      password
    } = req.body;

    db.User.findOne({ email })
      .then((user) => {
        if(user.password === password){
          res.status(409).json({error:"Password doesn't match"});
        } else{
          res.json({msg:"Ok"});
        }
      })
      .catch((err) => {
        res.status(409).json({error:"Internal server error"});
      })
  });


  app.post("/signup", (req, res) => {
    const {
      email,
      phone,
      password
    } = req.body;

    console.log("Body: ", req.body);

    db.User.findOne({ 
        where:{
          email
        }
     })
      .then((user) => {
        console.log("User: ", user);
        if (user) {
          res.status(409).json({ error: "User already exists" })
        } else {


          // Secure the password
          db.User.create({
            email,
            phone,
            password
          })
            .then((newUser) => {
              res.json({msg: "User is created"});
            })
            .catch((error) => {
              res.status(409).json({error: "Oopps, user not created"});
            });
        }
      })
      .catch((error) => {
        res.status(401).json({error: "Eror"});
      });



  });

};
