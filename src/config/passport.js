const JwtStrategy = require('passport-jwt').Strategy;
const BearerStrategy = require('passport-http-bearer');
const { ExtractJwt } = require('passport-jwt');
const { jwtToken } = require('./vars');
const authProviders = require('../services/auth/authProvider');
const userModel = require("../models/user.model");

const jwtOptions = {
  secretOrKey: jwtToken,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const jwt = async (payload, done) => {
  try {
    const user = await userModel.findOne({user_id: payload.sub});
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

const oAuth = (service) => async (token, done) => {
  try {
    const userData = await authProviders[service](token);
    const user = await userModel.oAuthLogin(userData);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);
exports.facebook = new BearerStrategy(oAuth('facebook'));
exports.google = new BearerStrategy(oAuth('google'));
