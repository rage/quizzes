import React, {Component} from 'react'
import { RadioGroup, FormControl, FormLabel, FormControlLabel, Radio } from "@material-ui/core"


// for now set here - might this differ for different scales, or alway
const scale_options = 7

class Scale extends Component {

    constructor(props){
        super(props)
        this.state = {
            value: "1"
        }
    }


    handleChange = (event) => {
        this.setState({value: event.target.value})
    }

    render()
    {
        return (

        <div>
        <FormControl component="fieldset">
          <FormLabel component="legend">{this.props.title}</FormLabel>
          <RadioGroup
          row={true}
            aria-label="agreement"
            name="agreement"
            value={this.state.value}
            onChange={this.handleChange}
          >

          {
              Array.from(
                  {length: scale_options},
                  (v, i) => i+1
              ).map(
                  number => (
                      <FormControlLabel
                      key={number}
                      value={"" + number}
                      control={<Radio color="primary" />} 
                      label={"" + number}
                      labelPlacement="top"
                      />
                  
              ))
          }



          </RadioGroup>
        </FormControl>
        </div>
       )
    }}


    const ScaleOption = ({ arvo }) => (
        <FormControlLabel
            value={arvo}
            control={<Radio color="primary" />} 
            label={arvo}
            labelPlacement="top"
            />
            
    )



export default Scale
