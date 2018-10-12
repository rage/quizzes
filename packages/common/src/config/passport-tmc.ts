// import { passport } from "passport"
import * as passport from "passport"
import * as passportHttpBearer from "passport-http-bearer"
import TMCApi from "../services/TMCApi"
import { ITMCProfile, ITMCProfileDetails } from "../types"

const BearerStrategy = passportHttpBearer.Strategy

passport.serializeUser((TMCProfile: ITMCProfile, done: any) => {
  done(undefined, TMCProfile.accessToken)
})

passport.deserializeUser((accessToken: string, done: any) => {
  TMCApi.getProfile(accessToken)
    .then((TMCProfile: ITMCProfileDetails) => done(undefined, TMCProfile))
    .catch((err: any) => done(err))
})

passport.use(
  new BearerStrategy((token: string, done: any) => {
    TMCApi.getProfile(token)
      .then((TMCProfile: ITMCProfileDetails) => {
        if (!TMCProfile) {
          return done(undefined, false)
        }
        return done(undefined, TMCProfile)
      })
      .catch((err: any) => done(err))
  }),
)

export { passport }
