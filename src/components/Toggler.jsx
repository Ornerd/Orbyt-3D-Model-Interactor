import { button } from 'leva'
import React, { useState } from 'react'

const Toggler = ({onClick, buttonName, activeToggler}) => {
  // const [active, setActive] = useState(false)

  // const handleTheMode = ()=> {
  //   modeFunction()
  //   setActive(active => !active)
  // }

  return (
    <button disabled={activeToggler && activeToggler !== buttonName} className={`${activeToggler &&activeToggler===buttonName? 'bg-[#161749] text-white p-2 rounded-[8px] shadow-md mr-3' : !activeToggler?'bg-[white] p-2 rounded-[8px] shadow-md mr-3':'bg-[white] p-2 rounded-[8px] shadow-md mr-3 opacity-55'}`} onClick={onClick}>
        {buttonName}
    </button>
  )
}

export default Toggler
