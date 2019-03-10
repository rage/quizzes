/* eslint-disable import/no-extraneous-dependencies */
import { render } from 'react-dom'
import Quiz from './components/'

const root = document.getElementById('root')

render((
    <div style={{ width: "100%", maxWidth: 800, margin: "0 auto" }} >
        <Quiz id="5b89394f92e40e7114e49906" languageId="fi_FI" accessToken="1436f0ed8869efc9d89ce0b6706d9ba07747490e2ed5b2ef3dd18caf0f0ac04a" />
    </div>
), root)
