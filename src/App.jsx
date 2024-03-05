import { OrbitControls, Plane } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { useEffect, useState } from 'react'
import Sample from './Sample'
import { DoubleSide } from 'three'
import Toggler from './components/Toggler'
import InfoModal from './components/InfoModal'
import AnimPresets from './components/AnimPresets'


// let array = [ 1, 2, 3, 4, 5, 6 ]; 
// for (let index = 2; index < array.length; index++) { 
//     console.log(array[index]); 
// }
// for (let traverse of array ){
//   console.log(traverse)
// }

// const actions = ()=> {
//   onpointerdown
// }


const App = () => {

  const [toggleAnimation, setToggleAnimation] = useState(false)
  const [infoText, setInfoText] =  useState([])

  const[selectedPreset, setSelectedPreset] = useState(null)
  const[presetPosition, setPresetPosition] = useState( {active: false, x: 0, y: 0})

  const[hasProceeded, setHasProceeded] = useState(false)

  const animationHandler = ()=> {
    setToggleAnimation(prevState => !prevState);

    if(hasProceeded == true) {  //check to ensure that on toggling in to animation mode after toggling out, options checkboard can still be accessed.
      setHasProceeded(false) 
    }
    setInfoText("Click on any object to animate it")
  }

useEffect(()=> {
  if (toggleAnimation === false) {
    setInfoText("")
  }
},[toggleAnimation])
  

  const handleAnimationPresetOptions = (option) => {
    setSelectedPreset(option)
  }

  const handleSelectionModal = (e)=> {
    if(toggleAnimation){
      setInfoText("Select an option to help make your animation simpler")
      console.log("it worked?", e)

      if(hasProceeded == false) { // check to ensure that the animation options checkboard doesn't appear again once I click the proceed button
        setPresetPosition({active: true, x: e.clientX + 5, y: e.clientY})
      }

    }
    
    
  }

  const handleProceedButton = ()=> {    
    if(selectedPreset) {
      setPresetPosition((...prev)=> ({...prev, active:false}))
      console.log(selectedPreset)
      setHasProceeded(true)   //state to signal the start of another function that will lead to opening the GUI controls
      if(selectedPreset==="none") { 
        setHasProceeded(false)  //this skips the adding objects to an array, and just goes straight to the animation, giving the user the opportunity to try another animation.
      }
    }else {
      setInfoText("Please select an option")
    }
   
  }

  const updateInfoText = () => {
    setInfoText("Ensure all the fan blades are selected. Click to select/deselect any object. Objects highlighted in blue are the selected objects")
  }



  // hasProceeded? setPresetPosition((...prev)=> ({...prev, active:false})) : setPresetPosition((...prev)=> ({...prev, active:true}))

  return (
    <div className='w-full h-screen'>
      Apparation
      <h1 className="text-3xl font-bold underline text-red-500">
        Animations with Three JS
      </h1>
      <Toggler modeFunction={animationHandler}/>
      <InfoModal infoText={infoText}/>
      <AnimPresets 
        selectedPreset={selectedPreset} 
        handleAnimationPresets={handleAnimationPresetOptions}
        presetPosition={presetPosition}
        handleProceedButton={handleProceedButton}
      />

      <Canvas camera={{position:[-1, 4, 10]}}>
        <ambientLight intensity={0.4} />
        <directionalLight color="#1c1db4" position={[0, 5, 5]} />
        <mesh rotation={[0, -5, 0]} position={[0, 0.5, 0]}>
          <boxGeometry />
          <meshPhongMaterial />
        </mesh>
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <planeGeometry args={[10,10]}/>
          <meshStandardMaterial color = "pink" side = {DoubleSide}/>
        </mesh>

        <Sample
         toggleAnimation = {toggleAnimation}
         selectedPreset = {selectedPreset}
         handleSelectionModal={handleSelectionModal}
         hasProceeded={hasProceeded}
         updateInfoText={updateInfoText}
        /> 

        <axesHelper scale={3}/>
        <OrbitControls target={[0, 1, 0]}/>
      </Canvas>

    </div>
  )
}

export default App
