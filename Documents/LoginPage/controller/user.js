const express = require("express");
const mongoose = require("mongoose");
const users = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");
const Secretkey = process.env.SecretKey;
// let SaltRounds = 5;

const SignUpUser = async (req, res) => {
  try {
    let data = req.body;
    console.log("data", data);
    let isUserExist = await users.findOne({ email: data.email });
    console.log("==", isUserExist);
    if (isUserExist) {
      console.log("User Exist");
      return res.status(404).json({
        message: "User  Already Exist",
      });
    }
    const token = jwt.sign({ email: data.email }, "Secretkey", {
      expiresIn: "5h",
    });
    console.log("token", token);

    let HashPassword = await bcrypt.hash(data.password, 4);
    console.log("HashPassword", HashPassword);

    let RegisterUser = await users.create({
      name: data.name,
      email: data.email,
      password: HashPassword,
      token: token,
    });

    console.log("token", token);
    console.log("===", RegisterUser);

    return res.status(201).json({
      message: "Successfully Registered",
      data: RegisterUser,
      token: token,
    });
  } catch (error) {
    console.log("------", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Something went wrong",
      error: error,
    });
  }
};

const LoginUser = async (req, res) => {
  try {
    let bodyData = req.body;
    console.log("bodyData", bodyData);
    let isUserExist = await users.findOne({ email: bodyData.email });
    console.log("==", isUserExist);
    if (!isUserExist) {
      console.log("User Not Exist Kindly Register Your Account");
      return res.status(404).json({
        message: "User Not Exist Kindly Register Your Account",
      });
    }

    if (!bodyData.email || !bodyData.password) {
      return res.status(400).json({
        success: false,
        message: "Email And Password Is Required",
      });
    }
    let CheckUser = await users.findOne({
      email: bodyData.email,
    });

    console.log("CheckUser:", CheckUser);

    if (!CheckUser) {
      console.log("User Not Found");
      return res.status(404).json({
        message: "User  Not Found",
      });
    }

    const matchPassword = await bcrypt.compare(
      bodyData.password,
      CheckUser.password
    );
    if (!matchPassword) {
      console.log("User not found");
      return res.status(404).json({
        message: "Password Not Match",
      });
    }
    const token = jwt.sign({ email: bodyData.email }, "Secretkey", {
      expiresIn: "5h",
    });
    console.log("token", token);
    console.log("User Login");
    return res.status(200).json({
      message: "User Login",
      data: CheckUser,
      token: token,
    });
  } catch (error) {
    console.log("==", error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

const ForgotPassword = async (req, res) => {
  try {
    let email = req.body.email;
    console.log("email", email);

    let IsUserExist = await users.findOne({ email: email });

    console.log("IsUserExist", IsUserExist);

    if (IsUserExist) {
      const randomString = randomstring.generate();
      EmailSend(IsUserExist.name, IsUserExist.email, randomString);

      const userUpdate = await users.updateOne(
        { email: IsUserExist.email },
        { token: randomString },
        { new: true }
      );
      console.log("userUpdate", userUpdate);

      res.status(200).json({
        success: true,
        data: IsUserExist,
        message: "Kindly Check Your Email And Reset Password",
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Email Id Does Not Exists" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Something Went Wrong",
      error: error,
    });
  }
};
const EmailSend = async (name, email, token) => {
  try {
    console.log("email", email);
    console.log("token", token);
    const tranPortar = await nodemailer.createTransport({
      service: "smtp@gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: "rohitkanwar2905@gmail.com",
        pass: "koec fxcd hykl iaue",
      },
    });

    const mailOption = {
      from: "rohitkanwar2905@gmail.com",
      to: "jack2905@yopmail.com",
      subject: "For Reset Password",
      html: ` <p> Hi  
        ${name}, 
        kindly click the link and <a href="http://localhost:3001/api/ResetPassword?token=${token}"
        > Reset Your Password </a> </p>`,
    };

    console.log("mailOption", mailOption);
    tranPortar.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail Has Been Sent", info.response);
      }
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Something Went Wsrong",
    });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
     return res.status(400).json({
        success: false,
        msg: "Token not available",
      });
    }
    console.log("token", token);
    const tokenData = await users.findOne({ token: token });
    if (tokenData) {
      const password = req.body.password;
      const newPassword = await bcrypt.hash(password, 4);
      const userData = await users.findByIdAndUpdate(
        { _id: tokenData._id },

        { password: newPassword, token: "" },
        { new: true }
      );
      console.log("Your Password Has Been Reset")
      return res.status(200).json({
        success: true,
        msg: "Your Password Has Been Reset",
        data: userData,
      });
    } else {
      console.log("this link has been expired");
      
    return  res.status(400)
        .json({ success: false, msg: "this link has been expired" });
    }
  } catch (error) {
    console.log("error", error);
     return res.status(500).json({
      success: false,
      message: error?.message || "something went wrong",
    });
  }
};

module.exports = {
  EmailSend,
  SignUpUser,
  LoginUser,  
  ForgotPassword,
  ResetPassword,
};
