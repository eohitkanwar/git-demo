const Joi = require("joi");

const SignUpValidation = async (req, res, next) => {
  try {
    const   SignUpvalidation = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().lowercase().email().required(),
      password: Joi.string().min(4).required(),
    });
    const { error } = SignUpvalidation.validate(req.body, { abortEarly: false });
    if (error) {
      console.log("error", error.details);
      return res.status(400).json(error.details);
    }
    next();
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      Message: error.details || "Somthing went wrong",
    });
  }
};

const LoginValidation = async (req, res, next) => {
  try {
    const Loginvalidation = Joi.object({
      email: Joi.string().lowercase().email().required(),
       password: Joi.string().required(),
    });
    const { error } = Loginvalidation.validate(req.body, { abortEarly: false });
    if (error) {
      console.log("error", error.details);
      return res.status(400).json(error.details);
    }
    next();
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      Message: error.details || "Somthing went wrong",
    });
  }
};
const ForgotPasswordValidation = async (req, res, next) => {
  try {
    const Forgotvalidation = Joi.object({
      email: Joi.string().lowercase().email().required(),
    });
    const { error } = Forgotvalidation.validate(req.body, { abortEarly: false });
    if (error) {
      console.log("error", error.details);
      return res.status(400).json(error.details);
    }
    next();
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      Message: error.details || "Somthing went wrong",
    });
  }
};
module.exports = {  
  SignUpValidation,
  LoginValidation,
  ForgotPasswordValidation
};
