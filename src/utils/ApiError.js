// Assignment complete file
// This class is used to create custom API errors with a consistent structure across your backend.
// this is used to maintain consistency throughout the application
// how any error will look like which fields it should contains
// it increases the code reusability

//ex:

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",// if no message is passed by user the by default this will sended
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null; // assignment
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export {ApiError}


/*

Middleware defines HOW the response is sent.

ApiError defines WHAT data the error object contains.


--------------------------------------------------
diff way to throw err
--------------------------------------------------
1. using built in class of err

Controller:

if (existedUser) {
    throw new Error("User already exists");
}

response:
{
    message: "User already exists"
}

2. Middleware:

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        message: err.message
    });
});

Controller:

if (existedUser) {
    const err = new Error("User already exists");
    err.statusCode = 409;
    throw err;
}

Problems:
- every time hame  itna code likhna padega jab bhi hame err throw karna hai
- isliye jab hame ek-do baar hi use karna ho to thi hai ye wala
if (existedUser) {
    const err = new Error("User already exists");
    err.statusCode = 409;
    throw err;
}

--------------------------------------------------
CASE 3: ApiError
--------------------------------------------------

Create once:

class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

Controller:

throw new ApiError(409, "User already exists");

isme hame less code likhna padta hai bas ek line like hai 
iska response same as middleware hoga

--------------------------------------------------
THE REAL BENEFIT APPEARS LATER
--------------------------------------------------
Suppose you want every error to have:

{
    success: false,
    message: "...",
    errors: [],
    statusCode: ...
}

Without ApiError:

const err = new Error("Validation failed");
err.statusCode = 400;
err.success = false;
err.errors = ["Email required"];
throw err;

You'll repeat this everywhere.

With ApiError:

throw new ApiError(
    400,
    "Validation failed",
    ["Email required"]
);

The class automatically creates:

{
    statusCode: 400,
    success: false,
    message: "Validation failed",
    errors: ["Email required"]
}

*/