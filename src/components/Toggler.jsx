import { button } from 'leva'
import React from 'react'

const Toggler = ({modeFunction}) => {

  const handleTheMode = ()=> {
    modeFunction()
  }

  return (
    <button onClick={()=>{handleTheMode()}}>
        click me
    </button>
  )
}

export default Toggler
