import React from "react"
import LoginView from "../components/LoginView"
import CourseList from "../components/CourseList"
import { checkStore, getProfile } from "../services/tmcApi"
import { useTypedSelector } from "../store/store"
import { initUserState, setUser } from "../store/user/userActions"
import { useDispatch } from "react-redux"

const setUpUser = async () => {
  const dispatch = useDispatch()

  const userInfo = checkStore()

  if (!userInfo) {
    dispatch(initUserState())
  } else {
    const user = await getProfile(userInfo.accessToken)
    dispatch(
      setUser(userInfo.username, userInfo.accessToken, user.administrator),
    )
  }
}

const Index = () => {
  setUpUser()
  return (
    <>
      {useTypedSelector(state => state.user.loggedIn) ? (
        <CourseList />
      ) : (
        <LoginView />
      )}
    </>
  )
}

export default Index
// <Home />
