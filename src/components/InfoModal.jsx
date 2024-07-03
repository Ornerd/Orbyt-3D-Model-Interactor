import React, { useEffect, useState } from 'react'

const InfoModal = ({infoText, openFunction, toggleAnimation, hasProceeded}) => {
  

  const handleFunction = () => {
    openFunction()
  }


  return (
    <div>
      <h3 className='pb-3 whitespace-pre-line'>{infoText}</h3>
      <button className={toggleAnimation && hasProceeded? "block bg-[#161749] text-white p-2 rounded-[8px] shadow-md": "hidden"} onClick={()=> {handleFunction()}}>
        Confirm Selection
      </button>
    </div>
  )
}

export default InfoModal
