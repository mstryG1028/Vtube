import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // steps to create registerUser

  //step 1-->----- get user details from frontend-------------
  const { fullname, username, email, password } = req.body; // req.body form ya phit json data ko acces karta hai

  console.log("BODY =>", req.body);
  //step 2-->----- validation-------------

  // ye beginners ke liye hai aise hi password email sabke liye check kar lena hai if lga ke
  // if(fullName===""){
  //   throw new ApiError(400,"fullName is required")
  // }

  //we can this one shortcut also
  if (
    [fullname, email, username, password].some(
      (field) => field?.trim() === "" // har values ko trim karega(remove spaces) if any of fields is "" (empty string) return true
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

  if (existedUser) {
    throw new ApiError(409, "User with this username or email exist");
  }
  console.log("FILES =>", req.files);

  // step 4--->  ------- check for files(here image and avatar) ------------

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }


  // step 5:--->  ----- upload them to cloudinary------
  const avatar = await uploadOnCloudinary(avatarLocalPath); // uploadOnCloudinary is method which is already defined in utils
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // since avatar is required fields thats why we are checking here
  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  // step 6--> ---- create user object - create entry in db------

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", // since coverImage is not mandatory that why if present then add link else ""
    email,
    password,
    username: username.toLowerCase(), // we want to store username in lowercase
  });

  // this will check weather user is created or not
  // if it finds user._id in DB then it is created else not
  const createdUser = await User.findById(user._id).select(
    //step 7--->  ---- remove password and refreshToken fields from response-----

    "-password -refreshToken" // Assignment aur kitne ways hai fields ko remove karne ke
  );

  // step 8 -->   -----check for user creation-------
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering");
  }

  // step-9 -->  ------ return response-----

  return res.status(201).json(
    //new ApiResponse(statusCode, which dat want to send, message); this is defined in utils/ApiResponse
    new ApiResponse(200, createdUser, "User Registered Successfully")
  );
});

// yahan pe control app.js--> user.routes.js--> user.controller.js se aa rha hai
// app.js me prefix path define karte hai like "/api/v1/users"
// routes me suffix path like regiter, login
// /users/login pe kya karna hai wo controller me

export { registerUser };
