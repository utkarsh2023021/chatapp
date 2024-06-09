const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
//signup
router.get('/', (req, res) => {
  res.render('signup')
});
router.post("/signup", async(req,res)=>{
    const { name, email, password } = req.body;
    await User.create({
      name,
      email,
      password,
    });
    return res.redirect("/user/login");
});

//login
router.get('/login',(req,res)=>{
  res.render('login');
})
router.post("/login",async(req,res)=>{
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
  
    if (!user)
      
      return res.render("login", {
     
        error: "Invalid Username or Password",
      });
  
   // const sessionId = uuidv4();
   // setUser(sessionId, user);
  //  res.cookie("uid", sessionId);
    return res.redirect('/user/chat');
});

//redirect to chatroom 
router.get("/chat",async(req, res) => {
  return res.render('index');
 });

module.exports = router;