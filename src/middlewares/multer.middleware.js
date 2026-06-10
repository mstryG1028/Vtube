import multer from "multer";

// const upload=multer({dest:"uploads"});// ye fn  store to kar deta hai hai uploads me
//  but hum usko read nhi kar sakte to uska koi use nhi rha


//isliye always use this 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')// null describe there is no err
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname  + uniqueSuffix) // here also
    //return cb(null,`${file.originalname}`); // bhi likh sakte hai but filename override ho jaayega
  }
})

const upload = multer({ storage: storage })

export {upload};






// NOTE: this is not used in this just for info

// app.post("/upload", upload.single("name"), (req, res) => {
//   // name same hona chaiye jo input field ejs me diya hai
//   console.log(req.body); // ye null dega kyunki koi text data nhi hai ye file ko store nhi karta
//   console.log(req.file); // isliye iska use karna padta hai file ke liye
//   return res.redirect("/");
// });