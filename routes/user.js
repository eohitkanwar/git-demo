const express = require("express");
const app = express()
const router = express.Router();
const {

  SignUpUser,
  LoginUser,
  ForgotPassword,
  ResetPassword,
} = require("../controller/user");
const {
  SignUpValidation,
  LoginValidation,
  ForgotPasswordValidation,
} = require("../validation/user");
const {uploadFile} = require("../controller/uploadfile")
const upload = require('../middleware/multer.js')


router.post ("/upload", upload.single("profilePic"),uploadFile)

router.post("/SignUp", SignUpValidation, SignUpUser);

router.post("/LoginUser", LoginValidation, LoginUser);

router.post("/ForgotPassword", ForgotPasswordValidation, ForgotPassword);

router.post("/ResetPassword", ResetPassword);


module.exports = router;
