// ye middleware ka basic kaam hai jo bhi req aa rha hai usko check karna ki req valid user se aa rhi hai ki nhi
// uske liye hum pehle req se accessToken nikal lete hai (token me hamne  id, username etc store kiya hai generally bas id hota hai)
// phir token se user_id nikal lenge usko check karenge db me, if exist then move to next else exit

// ye middleware yahan pe logout ke liye ho rha hai


import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
// since hamne app.use(cookieParser()) kiya hai iske wajah se hume req and res dono me
//cookies available hai // Assignment
// ye wala middleware me hum accesToken nikal rhe hai from req

// jab bhi hum req karte hai tab header me "authorization": "Bearer <token or accessToken>" // Assignment
//isliye agar "Bearer and space" remove kar diye to bas token bachega
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {

    // ye statements bta rha hai ki cookies me se accesToken lelo
    // ya phir Header ke Authorization se
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
