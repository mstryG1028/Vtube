import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "OK",
  });
});


// yahan pe control app.js--> user.routes.js--> user.controller.js se aa rha hai
// app.js me prefix path define karte hai like "/api/v1/users"
// routes me suffix path like regiter, login 
// /users/login pe kya karna hai wo controller me
export { registerUser };
