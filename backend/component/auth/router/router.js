const express =require("express");
const Router = express.Router();
const cors = require("cors");
const {registerCtrl, loginCtrl, forgetPassword, resetPassword, cafeLoginCtrl, getUserById, updateUser, resetSuperadminPassword, getStyxData, forgetCafePassword, resetCafePassword, customerRegisterCtrl, customerLoginCtrl, customerAuthCtrl, authMiddleware, logoutUser, customerVerifyOtpCtrl, customerSendOtpCtrl} = require('../controller/controller');
const saAuth = require("../../../middleware/saAuth");
const { loginLimiter } = require("../../../middleware/rateLimiter");

Router
  .route('/')
  .post(registerCtrl)
  .get(getStyxData)

  Router
  .route('/user/register')
  .post(customerRegisterCtrl)

  Router
  .route('/user/login')
  .post(customerLoginCtrl)

    Router
  .route('/user/logout')
  .post(logoutUser)

  Router
  .route('/user/auth-check')
  .post(customerAuthCtrl)

  Router
  .route('/user/me')
  .get(authMiddleware)

  Router
  .route('/:id')
  .get(saAuth, getUserById)
  .put(saAuth, updateUser)
  
  Router
  .route('/reset-password/:id')
  .put(saAuth, resetSuperadminPassword)

  Router
  .route('/login')
  .post(loginLimiter, loginCtrl)  

  Router
  .route('/admin/login')
  .post(loginLimiter, cafeLoginCtrl)  

  Router
  .route('/forget-password')
  .post(forgetPassword) 

  Router
  .route('/reset-password')
  .post(resetPassword) 

  Router
  .route('/admin/forget-password')
  .post(forgetCafePassword) 

  Router
  .route('/admin/reset-password')
  .post(resetCafePassword) 

  Router
  .route('/user/send-otp')
  .post(customerSendOtpCtrl)
  
  Router
  .route('/user/verify-otp')
  .post(customerVerifyOtpCtrl) 

module.exports = Router;