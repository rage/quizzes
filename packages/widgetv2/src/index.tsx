import styles from './styles.module.css'
import React, { useMemo } from 'react'
import { Provider } from 'react-redux'
import storeCreator from './store'

interface Props {
  id: string | null
  accessToken: string | null
  baseUrl: string | null
}

const Quiz = ({ id, accessToken }: Props) => {
  if (!id) {
    return <div>Quiz was not provided with a quiz id.</div>
  }
  // TODO: this may be discarded
  const store = useMemo(() => storeCreator(id, accessToken), [accessToken, id])
  return (
    <Provider store={store}>
      <div className={styles.test}>Example Component: {id}</div>
    </Provider>
  )
}

export default Quiz
