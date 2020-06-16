import axios, { AxiosError, AxiosResponse } from "axios"
import TmcClient from "tmc-client-js"
import { TMCCredentials, TMCProfile, TMCProfileDetails } from "../types/TMC"

const BASE_URL = "https://tmc.mooc.fi/api/v8"
const TmcClientClass: any = TmcClient
const tmcClient = new TmcClientClass(
  "59a09eef080463f90f8c2f29fbf63014167d13580e1de3562e57b9e6e4515182",
  "2ddf92a15a31f87c1aabb712b7cfd1b88f3465465ec475811ccce6febb1bad28",
)

export function getProfile(accessToken: string): Promise<TMCProfileDetails> {
  return axios
    .get<TMCProfileDetails>(
      `${BASE_URL}/users/current?access_token=${accessToken}`,
    )
    .then((res: AxiosResponse<TMCProfileDetails>) => {
      if (res.status !== 200) {
        res.data.error = "user not found"
      }
      return res.data
    })
    .catch((err: AxiosError) => Promise.reject(err))
}

export function authenticate(credentials: TMCCredentials): Promise<TMCProfile> {
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

export function unauthenticate() {
  tmcClient.unauthenticate()
}

export const checkStore = ():
  | { username: string; accessToken: string }
  | undefined => {
  const res = tmcClient.getUser()
  console.log(res)
  return res
}

export default { getProfile, authenticate, checkStore, unauthenticate }
