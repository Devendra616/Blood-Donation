const User = require("../modals/user.modals");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

const handleLogin = async function handleLogin(req, res) {
  /* const email = req.body.email
    const password = req.body.password */

  // const {email,password} = req.body
  // console.log(req.body)
  // User.find({ email, password}, function (err, user) {

  //     if (err){
  //         console.log(err);
  //     }
  //     else{
  //         console.log("User is : ", user);
  //         if(user) {
  //             const msg = "Valid user"
  //             return res.status(200).redirect('/donate')
  //         } else {
  //             const msg = "Invalid login"
  //             return res.status(400).redirect('/login')
  //         }
  //     }
  //  });
  // const { email,password} = req.body
  // if (error.code === 11000 && error.keyPattern.email === 1) {
  //   // Display error message to user
  //   console.log("Email already in use");
  // } else {
  //   // Handle other errors
  //   console.log("error");
  // }
  // // console.log(req.body)
  // try {
  //   const user=   await User.create(req.body)
  //   if(user) {
  //     return res.status(200).redirect('/donate')
  //   } else {
  //     return res.status(400).redirect('/login')
  //   }
  // } catch(err) {
  //     console.log('Error in login',err)
  // }
  // module.exports ={handleRegister};
  try {
    const { email, password } = req.body;
    // const token = await user.generateAuthToken();
    // Pehle check karein ki email already exist karta hai ya nahi
    const existingUser = await User.findOne({ email: req.body.email });
    console.log("🚀 ~ existingUser:", existingUser);

    if (existingUser) {
      // Agar email already exist karta hai
      const match = await bcrypt.compare(password, existingUser.password);
      // token = await existingUser.generateAuthToken();
      // console.log(token);
      // //

      if (match) {
        const token = jwt.sign({ existingUserId: existingUser._id }, secret, {
          expiresIn: "1h",
        });
        req.flash("success", "Login Success!");
        return res.status(200).redirect(`/donate?token=${token}`);
      } else {
        req.flash("error", "Invalid password!");
        return res.status(401).redirect("/login");
      }
    }
    req.flash("error", "User not found!");
    res.status(401).json({ message: "User not found" });
  } catch (err) {
    // Agar koi aur error hota hai to handle karein
    // if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
    //   res.status(409).send('Duplicate key error: Email already exists');
    //  else {
    //     res.status(500).send(err.message);
    //  }

    // return res.status(401).redirect('/help')
    console.log(err);
    req.flash("error", err.message);
    return res.status(401).redirect("/login");
  }
  // const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{
  //   expiresIn: "1d",
  // });
  // return res.status(200).send({
  //   successs: true,
  //   message:"Login Successfully",
  //   token,
  //   user,
  // });
  // function setUser(user){
  //   return jwt.sign(user,secret);

  //   }
  //   function getgUser(token){
  //     return jwt.verify(token,secret);
  //   }
};
const handleLogout = async function handleLogout(req, res) {
  const token = jwt.sign({ existingUserId: null }, secret, {
    expiresIn: "-1",
  });
  return res.status(200).redirect(`/login?token=${token}`);
};
const handleRegister = async function handleRegister(req, res) {
  const { name, email, password, age, gender, phone, bloodType } = req.body;
  if (!name || !email || !password || !age || !gender || !phone || !bloodType) {
    return res.status(422).json({ error: "plz filled the properly" });
  }

  // console.log(req.body)
  // try {
  //   const user=   await User.create(req.body)
  //   if(user) {
  //     return res.status(200).redirect('/login')
  //   } else {
  //     return res.status(400).redirect('/register')
  //   }
  //   const salt = await bcrypt.genSalt(10)
  //   const hashedPassword=await bcrypt.hash(req.body.password,salt)
  //   req.body.password=hashedPasseord
  //   const user1 =new user1model(req.body)
  //   await user1.save()

  //   return res.status(201).send({
  //     success:true,
  //     message:"User Registerd Successfully",
  //   })
  // } catch(err) {
  //     console.log('Error in registeration',err)
  // }
  // module.exports ={handleRegister};
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      req.flash("error", "Email already Exist");
      return res.status(422).json({ error: "Email already Exist" });
    }

    const user = new User({
      name: name,
      email: email,
      password: password,
      age: age,
      gender: gender,
      phone: phone,
      bloodType: bloodType,
    });
    console.log("Gender:", req.body.gender);
    await user.save();
    req.flash("success", "User registered successfully");
    res.status(201).json({ message: "user registered successfuly" });
  } catch (err) {
    req.flash("error", err.message);
    console.log(err);
  }
};
// const handleHelp = async function handleHelp(req, res) {
//   const { name, email, phone, massage } = req.body;

// let isValidUser=true
// if(isValidUser) {
//     const msg = "Valid user"
//     return res.status(200).redirect('/index')
// } else {
//     const msg = "Invalid login"
//     return res.status(400).redirect('/help')
// }

// console.log(req.body)
// try {
//   const user = await User.create(req.body);
//   if (user) {
//     return res.status(200).redirect("/register");
//   } else {
//     return res.status(400).redirect("/help");
//   }
// } catch (err) {
//   console.log("Error in help", err);
// }
// };

module.exports = { handleLogin, handleRegister, handleLogout };
