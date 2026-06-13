import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

// there are some files like avatar and coverImage
// which should upload before registering any user
//therefor middleware upload is injected before registerUser controller
router.route("/register").post(
  upload.fields([
    // here we are uploading only two file therefore we are using 2 objets
    // similarly we can upload multiple file by creating multiple objects
    // ek time pe ek hi file le (1 avatar, 1 coverimage) therefore maxCount=1
    { name: "avatar", maxCount: 1 },

    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

// iska address /users/register ho jaayega kyunki yahan pe hum directly nhi aa rhe hai
// hum aa rhe hai app.js ke app.use() se jahan pe already "/user" defined hai

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("refresh-token").post(refreshAccessToken);



export default router;
