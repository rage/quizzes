import passport from "passport"
import passportHttpBearer from "passport-http-bearer"
import TMCApi from "../services/TMCApi"
import { ITMCProfile } from "../types"

const BearerStrategy = passportHttpBearer.Strategy

passport.serializeUser((TMCProfile: ITMCProfile, done: any) => {
  done(undefined, TMCProfile.accessToken)
})

passport.deserializeUser((accessToken: string, done: any) => {
  TMCApi.getProfile(accessToken)
    .then((TMCProfile: ITMCProfile) => done(undefined, TMCProfile))
    .catch((err: any) => done(err))
})

passport.use(
  new BearerStrategy((token: string, done: any) => {
    TMCApi.getProfile(token)
      .then((TMCProfile: ITMCProfile) => {
        if (!TMCProfile) {
          return done(undefined, false)
        }
        return done(undefined, TMCProfile)
      })
      .catch((err: any) => done(err))
  }),
)

export default passport
