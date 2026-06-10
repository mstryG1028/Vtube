import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
      trim: true,
      index: true, // this is used for searching
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
      trim: true,
      index: true, // this is used for searching
    },
    avatar: {
      type: String, // use cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // use cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// these are the hooks in mongoose which is used to trigger after or before saving data // assignment
//Note : dont use arrow fn here bcz it doesnt support this ref
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     // modifieid is built in method to check is this pass is modified or not
//     // if we dont use if condition here then every time
//     //  when we store or change data, password will hashed
//     return next();
//   }
//   this.password =await  bcrypt.hash(this.password, 10);
//   next();
// });
// upar waala fn bilkul corrcet hai but modern code me async ke sath next ka use ni karte next id not a fn err will throw

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// we can pas any no of methods in userSchema
// we can write these methods in diff file also but every time we have to pass user.password to validate
// but here we only need this.pass here (this===Curruser)
// it make code cleaner and reusable
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  jwt.sign(
    // these are the payload means which info you should store
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  jwt.sign(
    // these are the payload means which info you should store
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);

//jwt is a bearer token
