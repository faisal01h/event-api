const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require('../models/user');
const clr = require('../lib/Color')

const secretOrKey = process.env.KEY || "confidential";

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload._id)
        .then((user) => {
          if (user) {
            clr.success("Triggered"+clr.Color.fg.cyan+" PASSPORT"+clr.Color.reset);
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => clr.fail(err));
    })
  );
};