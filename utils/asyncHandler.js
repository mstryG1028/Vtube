const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

// sometimes this format is used

//const asyncHandler = (fn) => (req, res, next) => {}; // this is called as higher oredr function

// A Higher-Order Function is a function that:
// 1. Takes another function as an argument, OR
// 2. Returns a function, OR
// 3. Both



// const asyncHandler = (fn) => (req,res,next) => {
// try{
// await fn(req,res,next);
// }
// catch(err){
// res.status(err.code||500).json({
//     success:false,
//     message:err.message
// })
// }
// };

export { asyncHandler };
