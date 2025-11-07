const express = require('express');
const Router = express.Router();
const { cafeOwnerSignup } = require('./controller');

// Cafe owner registration route - List Your Court
Router.route('/cafe-signup').post(cafeOwnerSignup);

module.exports = Router;
