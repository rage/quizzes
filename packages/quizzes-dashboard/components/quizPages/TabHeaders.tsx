import React from "react"
import Head from "next/head"

interface TabHeaderProps {
  text: string
}

export const TabText = ({ text }: TabHeaderProps) => {
  return (
    <>
      <Head>
        <title>{text} | Quizzes</title>
        <meta name="quizzes" content="initial-scale=1.0, width=device-width" />
      </Head>
    </>
  )
}

export const TabTextLoading = () => {
  return (
    <>
      <Head>
        <title>loading... | Quizzes</title>
        <meta name="quizzes" content="initial-scale=1.0, width=device-width" />
      </Head>
    </>
  )
}

export const TabTextError = () => {
  return (
    <>
      <Head>
        <title>womp womp womp... | Quizzes</title>
        <meta name="quizzes" content="initial-scale=1.0, width=device-width" />
      </Head>
    </>
  )
}
