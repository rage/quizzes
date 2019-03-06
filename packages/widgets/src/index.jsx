/* eslint-disable import/no-extraneous-dependencies */
import { render } from 'react-dom'
import HelloWorld from './components/'

const root = document.getElementById('root')

const ids = {
  scale_id: "37263843-2319-4ef6-8c32-1c33a49e6c04",
  essay_id: "4901fd41-2e77-4c3f-a2d9-255582fca7b6",
  multiple_choice_id: "4bf4cf2f-3058-4311-8d16-26d781261af7"
}

render((
  <HelloWorld id={ids.scale_id} accessToken={""}
  languageId={"en_US"} />
), root)
