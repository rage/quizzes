import dotenv from 'dotenv'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { whyDidYouUpdate } from 'why-did-you-update'
import App from './App';
import { persistor, store } from './store/store'
// whyDidYouUpdate(React)

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: ".env" })
    console.log(process.env)
}

const render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>,
        document.getElementById('root')
    )
}

render()
store.subscribe(render)
