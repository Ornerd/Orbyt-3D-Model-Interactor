import React from 'react'

const ButtonComp = ({openFunction, toggleAnimation, hasProceeded}) => {

    const handleFunction = () => {
        openFunction()
    }

  return (
    <button className={toggleAnimation && hasProceeded? "block": "hidden"} onClick={()=> {handleFunction()}}>
      Confirm Selection
    </button>
  )
}

export default ButtonComp
