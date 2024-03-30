import { button } from 'leva'
import React, { useState } from 'react'

const Toggler = ({modeFunction, buttonName, disabled}) => {
  const [active, setActive] = useState(false)

  const handleTheMode = ()=> {
    modeFunction()
    setActive(active => !active)
  }

  return (
    <button className={`${active? 'bg-[#161749] text-white p-2 rounded-[8px] shadow-md mr-3' : 'bg-[white] p-2 rounded-[8px] shadow-md mr-3'} ${disabled?"pointer-events-none opacity-50": "pointer-events-auto"}`} onClick={()=>{handleTheMode()}}>
        {buttonName}
    </button>
  )
}

export default Toggler
