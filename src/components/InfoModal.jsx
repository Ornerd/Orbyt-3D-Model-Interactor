import React, { useEffect, useState } from 'react'

const InfoModal = ({infoText, openFunction, toggleAnimation, hasProceeded}) => {
  

  const handleFunction = () => {
    openFunction()
  }


  return (
    <div>
      <h3>{infoText}</h3>
      <button className={toggleAnimation && hasProceeded? "block": "hidden"} onClick={()=> {handleFunction()}}>
        Confirm Selection
      </button>
    </div>
  )
}

export default InfoModal
