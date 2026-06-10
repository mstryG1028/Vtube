import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
 
  // steps to create registerUser

  //step 1-->----- get user details from frontend-------------
  const { fullname, username, email, password } = req.body; // req.body form ya phit json data ko acces karta hai
  console.log(fullname, email);

  //step 2-->----- validation-------------

  // ye beginners ke liye hai aise hi password email sabke liye check kar lena hai if lga ke
  // if(fullName===""){
  //   throw new ApiError(400,"fullName is required")
  // }

  //we can this one shortcut also
  if (
    [fullname, email, username, password].some(
      (field) => 
      field?.trim() === ""// har values ko trim karega(remove spaces) if any of fields is "" (empty string) return true
    )
  ) {
    throw new ApiError(400, "all Fields are Required");
  }

  //step 3-->----- check if user exist or not-------------

  // we can use this but it will behave like $AND ( if both exist then only return true )
  // const existedUser = User.findOne({ email, username });

  //this will check if either is present return true or false
  //NOTE: we can pass multiple field to check
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if(existedUser){
    throw new ApiError(409,"User with this username or email exist")
  }

  // step 4--->  ------- check for images, check for avatar------------

  const avatarLocalPath=req.files?.avatar[0]?.path;
  console.log(avatarLocalPath)
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
console.log(coverImageLocalPath)

  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
  }
   const avatar=await uploadOnCloudinary(avatarLocalPath)
   const coverImage=await uploadOnCloudinary(coverImageLocalPath)

   if (!avatar){
    throw new ApiError(400,"Avatar is required")
   }

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
