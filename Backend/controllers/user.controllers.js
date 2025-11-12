import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import coludinary from "../config/cloudinary.js"

const generateToken = (res, user) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "5y",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // must be true on Railway
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 5 * 365 * 24 * 60 * 60 * 1000, // 5 years
  });
};
export const registerUser = async (req , res) => {
    try{
        const { username, email , password } = req.body;

        if(!username) {
            return res.status(422).json({ message: "Username is required!" });
        }
        if(!email) {
            return res.status(422).json({ message: "Email is required!" });
        }
        if(!password) {
            return res.status(422).json({ message: "Password is required!" });
        }
        
        const existUser = await User.findOne({ email });

        if(existUser) {
            return res.status(400).json({success: false, message: "User already exist" });
        }

        const hasedPassword = bcrypt.hashSync(password, 8);
        const updateData = new User({
            username,
            email,
            password: hasedPassword,
        });

        const user = await updateData.save();

        generateToken(res, user);
        const {password: pass, ...rest} = user._doc;
        res.json({
            success: true,
            message: "User resgistered Successfully!",
            user: rest,
        });

    } catch (error){
        res.json({
            success: false,
            message: "Error with registration!",
            error,
        });
    }
};

export const loginUser = async (req , res) => {
    try{
        const { email , password } = req.body;

        if(!email) {
            return res.status(422).json({ message: "Email is required!" });
        }
        if(!password) {
            return res.status(422).json({ message: "Password is required!" });
        }
        
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({success: false, message: "User does not exist" });
        }

        const isMatchPassword = bcrypt.compareSync(password, user.password);

        if(!isMatchPassword) {
            return res
                .status(400)
                .json({success: false, message: "Invalid Credentials" });
        }

        const { password: pass, ...rest } = user._doc;
        generateToken(res, user);
        res.json({
            success: true,
            message: "User login Successfully!",
            user: rest,
        });

    } catch (error){
        res.json({
            success: false,
            message: "Error with login!",
            error,
        });
    }
};

export const logoutUser = async (req, res) => {
    res.clearCookie("token");
    res.json({ message: "logged out successfully"});
}; 

export const profileUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("-password");
        if(!user) {
           return res 
            .status(400)
            .json({
                succes: false, 
                message: "User not found!"
            });
        }
        res.status(200).json({
            succes:true,
            user,
        });

    } catch (error) {
      return res.status(500).json({
        succes: false,
        message: "Something Went Wrong with get user profile!"
      });
    }
};

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select("-password");
        if(!user) {
           return res 
            .status(400)
            .json({
                succes: false, 
                message: "User not found!"
            });
        }
        res.status(200).json({
            succes:true,
            user,
        });

    } catch (error) {
      return res.status(500).json({
        succes: false,
        message: "Something Went Wrong with get user by id!"
      });
    }
};

export const updateprofile = async (req, res) => {
    try {
      const userId = req.user?._id; 
      const {name, username, email, phone, bio } = req.body;

      const updateData = {};
      if(name) updateData.name = name ;
      if(username) updateData.username = username ;
      if(email) updateData.email = email ;
      if(phone) updateData.phone = phone ;
      if(bio) updateData.bio = bio ;

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      }).select("-password");

      res.status(200).json({
        succes: true,
        message: "User profile updated Successfully!",
        user: updatedUser,
      });
        
    } catch (error) {
      return res.status(500).json({
        succes: false,
        message: "Something Went Wrong with update user profile!"
      });  
    }
};

export const updateprofileImage = async (req, res) => {
    try {
      const userId = req.user?._id; 
      const profileImage = req.file?.path ; // cloudinary URL
      const publicId = req.file?.filename || req.file?.public_Id;
      console.log("req.file :", req.file);


      if(!profileImage || !publicId) {
        return res.status(400).json({
            succes: false,
            message: "No file uploaded",
        });
      }

      const user = await User.findById(userId).select("-password");
      // Delete old image if exists
      if (user?.profileImagePublicId) {
        await coludinary.uploader.destroy(user?.profileImagePublicId);
      } 

      user.profileImage = profileImage ;
      user.profileImagePublicId = publicId ;

      await user.save();

      res.status(200).json({
        succes: true,
        message: "User profile image updated Successfully!",
        user,
      });
        
    } catch (error) {
      return res.status(500).json({
        succes: false,
        message: "Something Went Wrong with update user profile!",
      });  
    }
};