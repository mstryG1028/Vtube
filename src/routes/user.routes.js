import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
// iska add /users/register ho jaayega kyunki yahan pe hum directly nhi aa rhe hai 
// hum aa rhe hai app.js ke app.use() se jahan pe already "/user" defined hai

export default router;
