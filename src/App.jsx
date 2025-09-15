import { OrbitControls, Plane } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import Sample from './Sample'
import Toggler from './components/Toggler'
import InfoModal from './components/InfoModal'
import AnimPresets from './components/AnimPresets'
import ReadMeModal from './components/ReadMeModal'
import { int } from 'three/examples/jsm/nodes/shadernode/ShaderNode'
import Loader from './components/Loader'
import { Link, useParams } from 'react-router-dom'


const App = () => {
  const params = useParams()

  const selectedModel = params.linkId;

  const [activeToggler, setActiveToggler] = useState(null)
 
  const [toggleAnimation, setToggleAnimation] = useState(false)
  const [infoText, setInfoText] =  useState([])

  const [toggleResize, setToggleResize] = useState(false)

  const [planeEditor, setPlaneEditor] = useState(false)

  const [selectedPreset, setSelectedPreset] = useState(null)
  const [presetPosition, setPresetPosition] = useState( {active: false, x: 0, y: 0})
  const [submittedPreset, setSubmittedPreset] = useState(null)

  const [hasProceeded, setHasProceeded] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const refd = useRef()
  const refdResize = useRef()
  const refdPlane = useRef()

  const [disabled, setDisabled] =useState(false);
  const [readMe, setReadMe] =useState([]);


  const animationHandler = ()=> {  //handles the animation mode
    setToggleAnimation(prevState => !prevState);
    if (activeToggler === "Animate") {
      setActiveToggler(null)
    }else {
      setActiveToggler('Animate')
    }
    console.log(activeToggler)

   
    setInfoText("Click on any object on your model to animate it")
  }

  const resizeHandler = ()=> {
    setToggleResize(prevState => !prevState);
    if (activeToggler === "Adjust") {
      setActiveToggler(null)
    }else {
      setActiveToggler('Adjust')
    }
  }

  const planeToggler = ()=> {
    setPlaneEditor(prevState => !prevState);
    if (activeToggler === "Plane") {
      setActiveToggler(null)
    }else {
      setActiveToggler('Plane')
    }
  }



  useEffect(()=> {

    if(hasProceeded == true) {  //check to ensure that on toggling in to animation mode after toggling out, options checkboard can still be accessed.
        setHasProceeded(false) 
      }

    if (toggleAnimation === false) { //to ensure that all stuff related to animation is shut-off when the mode is deselected
      setInfoText("")
      setPresetPosition((...prev)=> ({...prev, active:false}))
      setConfirmed(false)
    }
  },[toggleAnimation])
  

  const handleAnimationPresetOptions = (option) => {
    setSelectedPreset(option)
  }

  const handleSelectionModal = (e)=> {
    if(toggleAnimation){
      setInfoText("Select an option to help make your animation simpler")

      if(hasProceeded == false) { // check to ensure that the animation options checkboard doesn't appear again once I click the proceed button
        setPresetPosition({active: true, x: e.clientX + 5, y: e.clientY})
      }
    }
  }

 
  const handlePresetChange = ()=> {  // this ensures that when I click on an object already in the fan array, it sets itspreset to fa, enabling me to acces its accurate pane controls. i'm a bit makeshift with this. Would look for a better workaround later.
    setSelectedPreset("fan")
  }

  const handleProceedButton = ()=> {    
    if(selectedPreset) {
      setPresetPosition((...prev)=> ({...prev, active:false}))
      
      function updateSubmit(newSt) {
        setSubmittedPreset(prv=> {
          console.log("previous", prv)
          console.log("new", newSt)
          return newSt
        })
      }
      
      updateSubmit(selectedPreset);  
      
      setHasProceeded(true)   //state to signal the start of another function that will lead to opening the GUI controls
      if(selectedPreset==="none") { 
        setHasProceeded(false)  //this skips the adding objects to an array, and just goes straight to the animation, giving the user the opportunity to try another animation.
      }
    }else {
      setInfoText("Please select an option")
    }
   
  }

  const updateInfoText = () => {
    if (selectedPreset === "fan") {
      setInfoText("Ensure all the fan blades are selected.Ensure to deselect any object that is not a fan blade. \n Click to select/deselect any object. Objects highlighted in blue are the selected objects. Click the Confirm selection button when you're certain all the fan blades are selected")
    }
  }

  const confirmSelectionFunction = ()=> {
    setConfirmed(true);
    setInfoText("");

    setTimeout(()=> {  //a short check to return to its default position to ensure the option can always be accessible
      setConfirmed(false)
    }, 200)
  }

  useEffect(()=> {  // to be modified. Currently unsatisfied with the output. It's mainly to provide the user with tips on how to operate his presets, whether they be fans, conveyor belts or the like.
    if (confirmed) {
      setHasProceeded(false);
    }
    if (submittedPreset==="fan") {

      let continueExecution = true;

      setTimeout(() => {
        if(toggleAnimation === true){
          setReadMe("If you have multiple fans in your model, you can select them all together and control them all at the same speed. If you want them rotating at different speeds. Go over this process again to enable you create a new GUI control for each fan.");
        }else{
          setReadMe("")
        }
      }, 2000)
      
      setTimeout(() => {
        if(toggleAnimation === true){
          setReadMe("Upon confirming selection, the GUI controls for your fan blades will appear at the top right. Use them to set the rotation speeds for each of the axes until you find the axis at which your fan blades rotate correctly.");
        }else{
          setReadMe("")
        }
      }, 12000);
      setTimeout(() => {
        if(toggleAnimation === true){
          setReadMe("fan blades only rotate in one direction. Therefore you can't operate more than ONE GUI control at a time. If you want to try rotating in another axis, set the active GUI contol back to zero.");
        }else{
          setReadMe("")
        }
      }, 22000);  

      const intervalId = setInterval(() => {

        if(toggleAnimation === true){
          setReadMe("If you have multiple fans in your model, you can select them all together and control them all at the same speed. If you want them rotating at different speeds. Go over this process again to enable you create a new GUI control for each fan.");
        }else{
          setReadMe("")
        }
        setTimeout(() => {
          if(toggleAnimation === true){
            setReadMe("Upon confirming selection, the GUI controls for your fan blades will appear at the top right. Use them to set the rotation speeds for each of the axes until you find the axis at which your fan blades rotate correctly.");
          }else{
            setReadMe("")
          }
        }, 10000);
        setTimeout(() => {
          if(toggleAnimation === true){
            setReadMe("fan blades only rotate in one direction. Therefore you can't operate more than ONE GUI control at a time. If you want to try rotating in another axis, set the active GUI contol back to zero.");
          }else{
            setReadMe("")
          }
        }, 20000);  
      }, 30000);

      if(toggleAnimation === false) {
        clearInterval(intervalId);
        console.log("Cleaning up interval...");
      }
      return () => {
        clearInterval(intervalId)
      }
    }
  }, [confirmed, submittedPreset, toggleAnimation])

  


  return (
    <div className='w-full h-screen p-4'>
      <section className='absolute z-10 w-2/5'>
        <h1 className="text-3xl font-bold underline text-red-500">
         Orbyt-3D
        </h1>
        <Toggler onClick={resizeHandler} activeToggler={activeToggler} buttonName='Adjust'/>
        <Toggler onClick={planeToggler} activeToggler={activeToggler} buttonName='Plane'/>
        <Toggler onClick={animationHandler} activeToggler={activeToggler} buttonName='Animate'/>
        <Toggler onClick={()=>{console.log('coming soon')}} activeToggler={activeToggler} buttonName='Populate'/>
        <Toggler onClick={()=>{console.log('coming soon')}} activeToggler={activeToggler} buttonName='mini-Map'/>
        <InfoModal 
          infoText={infoText}
          openFunction={confirmSelectionFunction}
          toggleAnimation={toggleAnimation}
          hasProceeded={hasProceeded}
        />
        
          
      
        <AnimPresets 
          selectedPreset={selectedPreset} 
          handleAnimationPresets={handleAnimationPresetOptions}
          presetPosition={presetPosition}
          handleProceedButton={handleProceedButton}
        />
      </section>
      <Link to='/' className='absolute right-0 z-10 p-2'>
        <i className="fa fa-sign-out text-4xl hover:text-red-800" aria-hidden="true"></i>
      </Link>
      <section ref={refd} className={toggleAnimation? 'absolute right-0 z-10 p-2' : 'hidden'}></section>
      <section ref={refdResize} className={toggleResize? 'absolute right-0 z-10 p-2' : 'hidden'}></section>
      <section ref={refdPlane} className={planeEditor? 'absolute right-0 z-10 p-2' : 'hidden'}></section>
      

      <Canvas camera={{position:[5, 5, 5]}}>
      <Suspense fallback={<Loader/>}>
        <ambientLight intensity={0.8} />
        <directionalLight color="#ffffff" position={[0, 1, 5]} />
        <pointLight color='#ffffff' intensity={4.8} position={[0, 1, 0]}/>
          {/* <mesh rotation={[0, -5, 0]} position={[0, 0.5, 0]}>
            <boxGeometry />
            <meshPhongMaterial />
          </mesh>*/} 

          <Sample
          toggleResize = {toggleResize}
          planeEditor = {planeEditor}
          toggleAnimation = {toggleAnimation}
          selectedPreset = {selectedPreset}
          submittedPreset = {submittedPreset}
          handlePresetChange={handlePresetChange}
          handleSelectionModal={handleSelectionModal}
          hasProceeded={hasProceeded}
          updateInfoText={updateInfoText}
          confirmed={confirmed}
          refd={refd}
          refdResize={refdResize}
          refdPlane={refdPlane}
          selectedModel={selectedModel}
          /> 

          <axesHelper scale={3}/>
          <OrbitControls target={[0, 1, 0]}/>
      </Suspense>
      
      </Canvas>

      <ReadMeModal readMe= {readMe}/>

    </div>
  )
}

export default App
