import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // steps to create registerUser

  //step 1-->----- get user details from frontend-------------
  const { fullname, username, email, password } = req.body; // req.body form ya phit json data ko acces karta hai

  // console.log("req.files =>", req.body);

  //step 2-->----- validation ( check weather any field is empty )-------------

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

  //step 3-->----- check if user ( with curr email or username ) exist or not-------------

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
  //console.log("FILES =>", req.files); // assignment read this

  // step 4--->  ------- check for files(here image and avatar) ------------
  // yahan hum req.files se avatar and coverimage ka url extract kar rhe hai
  //  and usko  cloudinary pe upload kar rhe hai
  // optional chaining // Assignment
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // the above way to check coverImage was giving undefined err thats why
  // this is manual way to check
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

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



//----------LOGIN PROCESS-------------

const loginUser = asyncHandler(async (req, res) => {
  // step-1 -----get data from req.body----
  const { username, email, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "username or email is required");
  }

  // step-2 ---------use email or username to login---------
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  // step-3 ---------find user---------
  if (!user) {
    throw new ApiError(404, "User not Exist");
  }

  // step-4 ---------check password---------

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(404, "Incorrect Password");
  }

  // step-5 ---------generate access and refreshToken---------

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  ); //jab bhi hume dikh rha hai ki db use ho rha hai to await use karlo

  // step-6 ---------send token in form of cookies---------
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); // assignment why this is created and what else we can do (like updating object)
  // .select("") use hota hai curr object ka konsa values ignore karna hai

  const options = {
    // these cookies can be modified by any user from frontend if we dont use these 2
    // now it can be only modified by server
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken, // Assignment why these if already send in cookies
        },
        "User LoggedIn SuccessFully"
      )
    );
});

// ------logOut User----------

const logoutUser=asyncHandler(async(req,res)=>{
  await User.find
})

// jab bhi hum iss method ko call karenge ye automatically refresh and AccessToken de dega
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateAccessToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh Token"
    );
  }
};

export { registerUser,loginUser,logoutUser };
