import React, { useEffect, useState } from 'react'

const AnimPresets = ({handleAnimationPresets,selectedPreset, presetPosition, handleProceedButton}) => {

  const handlePresetToggle = (option) => {
    handleAnimationPresets(option)
    
  }

  const handleProceed = ()=> {
    handleProceedButton()
  }

  useEffect(()=>{
    console.log("boolean is", presetPosition)
  }, [presetPosition])

  return (
  
    <div className={presetPosition.active? "block bg-[white] w-[220px] p-2 rounded-[8px] shadow-md" : "hidden"} style={{position:"absolute", zIndex: 1000, top: presetPosition.y, left: presetPosition.x}}>
      <h3>Which among these options best describes this object?</h3>
      <div className="flex flex-col">
        <label>
            <input
                type = "radio"
                value = "fan"
                checked = {selectedPreset === "fan"}
                onChange={()=> {handlePresetToggle("fan")}}
            />
            fan
        </label>
        <label>
            <input
                type = "radio"
                value = "none"
                checked = {selectedPreset === "none"}
                onChange={()=> {handlePresetToggle("none")}}
            />
            none
        </label>
        <button onClick={()=> {handleProceed()}}>Proceed</button>
      </div>
    </div>
  )
}

export default AnimPresets
