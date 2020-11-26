import { TextField } from '@material-ui/core'
import React from 'react'

import Quiz from 'widgetv2'
import 'widgetv2/dist/index.css'
import { useInput } from './hooks'
import { StylesProvider } from '@material-ui/core/styles'

import './index.css'

const App = () => {
  const id = useInput('id', null)
  const accessToken = useInput('savedAccessToken', null)
  const baseUrl = useInput('savedBaseUrl', 'https://quizzes.mooc.fi')
  return (
    <StylesProvider injectFirst>
      <h1>Quizzes playground</h1>
      <div>
        <TextField
          className='example-input-field'
          fullWidth
          variant='outlined'
          {...id}
          label='Quiz id'
        />
        <TextField
          className='example-input-field'
          fullWidth
          variant='outlined'
          {...accessToken}
          label='Access token'
        />
        <TextField
          className='example-input-field'
          fullWidth
          variant='outlined'
          {...baseUrl}
          label='Base url'
        />
      </div>
      <Quiz
        id={id.value}
        accessToken={accessToken.value}
        baseUrl={baseUrl.value}
      />
    </StylesProvider>
  )
}

export default App
