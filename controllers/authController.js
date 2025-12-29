const User = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")



// // password validation function
const validationPassword = (password)=>{
    // const pass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    const pass = /^.{8,}$/;
    return pass.test(password)

}

exports.resgister = async(req, res)=>{
    const {firstName, lastName, email, phone, password, confirmPassword, role} = req.body

    //check if password match
    if (password !== confirmPassword) {
        return res.json("no match")
    }

    //Validate Password
    if (!validationPassword(password)) {
        return res.json("invalid password")
    }

    try {
        //check if user already exist
        let user = await User.findOne({email})
        if (user) {
            return res.json("exist")
        }else {
             user = new User({firstName, lastName, email, phone, password, role})
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        await user.save()

        const token = user.generateAuthToken()
        res.header("auth-token", token).json(user) 
        }
    } catch (error) {
        console.error("Error during registration:", error);
        // res.status(500).json({ message: error.message });
        res.json({message: error.message})
    }

}

exports.login = async(req, res) =>{
    const {email, password} = req.body
    try {
       const user = await User.findOne({email})
       if (!user) {
        return res.json("Invalid Email/Password")
       }

       const validPassword = await bcrypt.compare(password, user.password)
       if (!validPassword) {
        return res.json("successful")
       }

       const token = user.generateAuthToken()
       res.json({token})
    } catch (error) {
        res.json({message: error.message})
    }
}


//new with upload image when registering
// const User = require("../model/user");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

// // Validate password (at least 8 characters)
// const validatePassword = (password) => {
//   const pass = /^.{8,}$/;
//   return pass.test(password);
// };

// exports.register = async (req, res) => {
//   const { firstName, lastName, email, phone, password, confirmPassword, role } = req.body;
//   const img = req.file ? req.file.path : ""; // ⬅️ Get uploaded image path

//   if (password !== confirmPassword) {
//     return res.json("no match");
//   }

//   if (!validatePassword(password)) {
//     return res.json("invalid password");
//   }

//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.json("exist");
//     }

//     user = new User({
//       firstName,
//       lastName,
//       email,
//       phone,
//       password,
//       role,
//       img, // ⬅️ Save image path in database
//     });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);
//     await user.save();

//     const token = user.generateAuthToken();
//     res.header("auth-token", token).json(user);
//   } catch (error) {
//     console.error("Error during registration:", error);
//     res.json({ message: error.message });
//   }
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.json("Invalid Email/Password");
//     }

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.json("Invalid Email/Password");
//     }

//     const token = user.generateAuthToken();

//     // You can return user info as well if needed
//     res.json({
//       token,
//       user: {
//         _id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         phone: user.phone,
//         img: user.img, // ⬅️ So you can show profile picture on frontend
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };
