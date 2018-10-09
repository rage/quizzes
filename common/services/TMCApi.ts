import { AxiosError, AxiosResponse } from "axios"
const TmcClient = require("tmc-client-js")
import axios from "../../common/config/axios"
import { ITMCProfile, ITMCProfileDetails, ITMCLoginCredentials } from "../types"

const BASE_URL = "https://tmc.mooc.fi//api/v8"
const tmcClient: any = new TmcClient(
  "59a09eef080463f90f8c2f29fbf63014167d13580e1de3562e57b9e6e4515182",
  "2ddf92a15a31f87c1aabb712b7cfd1b88f3465465ec475811ccce6febb1bad28",
) as any

function getProfile(accessToken: string): Promise<ITMCProfileDetails> {
  return axios
    .get<ITMCProfileDetails>(`${BASE_URL}/users/current?access_token=${accessToken}`)
    .then((res: AxiosResponse<ITMCProfileDetails>) => {
      if (res.status !== 200) {
        res.data.error = "user not found"
      }
      return res.data
    })
    .catch((err: AxiosError) => Promise.reject(err))
}

function authenticate(credentials: ITMCLoginCredentials): Promise<ITMCProfile> {
  return new Promise((resolve, reject) => {
    tmcClient.authenticate(credentials).then(
      (res: any) => {
        // ok creds
        console.log("hyvä")
        resolve(res)
      },
      (err: any) => {
        console.log("paha")
        reject(err)
      },
    )
  })
}

function unauthenticate() {
  tmcClient.unauthenticate()
}

function checkStore() {
  return tmcClient.getUser()
}

export default { getProfile, authenticate, checkStore, unauthenticate }
