import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  // steps to create registerUser
  //1. get user details from frontend
  const { fullName, username, email, password } = req.body; // req.body form ya phit json data ko acces karta hai
  console.log(fullName, email);

  //2.validation

  // ye beginners ke liye hai aise hi password email sabke liye check kar lena hai if lga ke
  // if(fullName===""){
  //   throw new ApiError(400,"fullName is required")
  // }

  //but one shortcut is

  if([fullName,email,username,password].some((field)={field?.trim()===""}))


  //3. check if user exist or not
  //4 check for images, check for avatar
  //5 upload them to cloudinary
  //6 create user object - create entry in db
  //7 remove password and refreshToken fields from response
  //8 check for user creation
  //9 return response

  // let newUser = new User({
  //   username,
  //   email,
  //   password,
  // });
  // await newUser.save();
});

// yahan pe control app.js--> user.routes.js--> user.controller.js se aa rha hai
// app.js me prefix path define karte hai like "/api/v1/users"
// routes me suffix path like regiter, login
// /users/login pe kya karna hai wo controller me
export { registerUser };
