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
    console.log(profile)
    const { email, displayName, id } = profile
    try {
      var user = await User.findOne({ googleId: id })
      console.log(user)
      if (user) {
        user = await User.findOneAndUpdate({ googleId: id }, { email: email, name: displayName, avatar: profile.picture }, { new: true })
        console.log('update google user', user.email)
        return done(null, user)
      } else {
        user = await User.create({ googleId: id, email: email, name: displayName, password: "", avatar: profile.picture })
        console.log('create gg user', user.email)
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
    callbackURL: FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'photos', 'emails']
  },
  async (accessToken, freshToken, profile, done) => {
    try {
      console.log(profile)
      const { emails, displayName } = profile
      const email = emails[0].value
      var user = await User.findOne({ facebookId: profile.id })
      if (user) {
        console.log("update  user facebook");
        user = await User.findOneAndUpdate({ facebookId: profile.id }, { email: email, name: displayName, avatar: profile.photos[0].value },{new:true})
        return done(null, user)
      } else {
        user = await User.findOne({ email: email })
        if (!user) {
          console.log("create user facebook")
          user = await User.create({ facebookId: profile.id, email: email, name: displayName, password: "", avatar: profile.photos[0].value })
        } else {
          console.log('update facebook user have email')
          user = await User.findOneAndUpdate({ email: email}, { facebookId: profile.id, name: displayName, avatar: profile.photos[0].value },{new:true})
          return done(null, user)
        }
      }
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  }
))