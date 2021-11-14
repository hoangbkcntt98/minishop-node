import passport from 'passport'
import { ExtractJwt } from 'passport-jwt'
import { Strategy as JwtStrategy } from 'passport-jwt'
import User from '../models/user.model.js'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  FACEBOOK_CALLBACK_URL,
} from '../config/config.js'
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
  secretOrKey: 'Minishop'
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.id)
    if (user) return done(null, user)
    return done(null)
  } catch (error) {
    done(error)
  }
}))
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL,

  passReqToCallback: true
},
  async (request, accessToken, refreshToken, profile, done) => {
    //   console.log(profile)
    const { email, displayName, id } = profile
    try {
      var user = await User.findOne({ email: email })
      console.log(user)
      if (user) {
        return done(null, user)
      } else {
        console.log('createuser');
        user = await User.create({ googleId: id, email: email, name: displayName, password: "" })
      }
      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }
));
passport.use(new FacebookStrategy(
  {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: FACEBOOK_CALLBACK_URL
  },
  async (accessToken, freshToken, profile, done) => {
    try{
      console.log(profile)
    }catch(err){
      return done(err)
    }
  }
))