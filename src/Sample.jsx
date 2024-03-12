import { useFrame, useLoader, useThree } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three';
import { useControls } from 'leva';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useGLTF } from '@react-three/drei'
import { Pane } from 'tweakpane';




const Sample = ({toggleAnimation, selectedPreset, handleSelectionModal, hasProceeded, updateInfoText}) => {
  const {gl, camera, size, scene}= useThree();
  const rayCaster= new THREE.Raycaster();
  const referee =useRef()
  const boundingBoxHelper = useRef(); 


  const [clicked, setClicked] = useState(false)
  const [clickedObject, setClickedObject] = useState(null);
  const [clickedName, setClickedName] = useState(null);

  const [originalRotation, setOriginalRotation] = useState([])
  const [originalPosition, setOriginalPosition] = useState([])

  const [animationControls, setAnimationControls] = useState([])
  const [panes, setPanes] = useState({});
  const [selectedObjectName, setSelectedObjectName] = useState(null);

  const [handleBladeSelection, setHandleBladeSelection] = useState(false)
  const [bladeParent, setBladeParent] = useState([]) //to store all the fan blades for rotation

 
  
 

  
  const handleClick = (e) => {

    if (toggleAnimation && !handleBladeSelection) {
      e.stopPropagation();
      const clickedObj = e.object;
      setClickedObject(clickedObj)
      // e.object.material.color.set(5,5,5);

      const objectName = e.object.name;
      console.log(e.object.parent)

      function updateIt(newSt) {
        setClickedName(prv=> {
          console.log("previous", prv)
          console.log("new", newSt)
          return newSt
        })
      }

      updateIt(objectName);  
      setSelectedObjectName(objectName);

      handleSelectionModal(e);
    }else {
      return;
    }
    
  }

  useEffect(()=> {
    const handleItemSelection = ()=> {
      if(hasProceeded){
        if (selectedPreset === "fan") {
          console.log('fan is going to work')
          
          referee.current.traverse((child) => {
            if (child.name === clickedName) {
              if (child.parent.name === referee.current.name) {
                console.log("this blade is standalone")
                child.material.emissive.set(0x0000ff);
              }else if (child.parent.name !== referee.current.name) {
                // const bladparenT =child.parent;
                child.parent.children.forEach(child => {
                  setBladeParent(prevBlade=> [...prevBlade, child])
                  child.material.emissive.set(0x0000ff);
                })
              }
              setHandleBladeSelection(true)
              updateInfoText();
            }

          })
        }else {
          setHandleBladeSelection(false)
        }
      }
    }
    handleItemSelection();
  },[hasProceeded])
  

  useEffect(()=> {
    const positions = {};
    const rotations = {};

    referee.current.children.forEach(object => {
      if (object.isMesh) {
        positions[object.name] = {x:object.position.x, y:object.position.y, z:object.position.z};
        rotations[object.name] = {x:object.rotation.x, y:object.rotation.y, z:object.rotation.z};
      }

      if (object.isGroup || object.isObject3D) {
        object.children.forEach(obj => {
          positions[obj.name] = {x:obj.position.x, y:obj.position.y, z:obj.position.z};
          rotations[obj.name] = {x:obj.rotation.x, y:obj.rotation.y, z:obj.rotation.z};
        })
      }
      
    });

    console.log('originalRotations:', rotations);
    setOriginalPosition(positions);
    setOriginalRotation(rotations)

    console.log("orr",originalRotation)
  },[])
 

 const handleSecondClick = (e)=> {
  if(toggleAnimation && handleBladeSelection) {
    console.log(originalRotation)
    let obj =e.object;
    if(selectedPreset=== "fan") {
      setBladeParent((prevBlades=> {
        if (prevBlades.includes(obj)) {
          console.log("removed",prevBlades)
          obj.material.emissive.set(0x000000)
          return prevBlades.filter(blade => blade != obj)
        }else {
          console.log("added",prevBlades)
          obj.material.emissive.set(0x0000ff)
          return [...prevBlades, e.object]
        }
      }))
    }
    }
    
 }
  


  useEffect(() => {

  if (hasProceeded) {
    const pane = new Pane();

  const params = {
    rotationSpeedX: 0,
    rotationSpeedY: 0,
    rotationSpeedZ: 0,
  };

  if(selectedPreset === "fan") {

    const folder = pane.addFolder({ title: selectedPreset==="fan"? "fan": clickedName || 'any', expanded: true });
    const bindings = [];

    
    ['X', 'Y', 'Z'].forEach((axis) => {
      const propName = `rotationSpeed${axis}`;
      const binding = folder.addBinding(params, propName, { min: 0, max: 0.3, step: 0.01 }).on('change', (e) => {
        if (e.value === 0) {
          referee.current.children.forEach((object) => {
            if (object.isMesh) {
              console.log("how many", originalRotation[object.name]);
              // object.rotation[axis.toLowerCase()] = originalRotation[object.name];
              object.position.set(originalPosition[object.name].x, originalPosition[object.name].y, originalPosition[object.name].z);
              object.rotation.set(originalRotation[object.name].x, originalRotation[object.name].y, originalRotation[object.name].z);
            }
            if (object.isGroup || object.isObject3D) {
              object.children.forEach(object=> {
                object.position.set(originalPosition[object.name].x, originalPosition[object.name].y, originalPosition[object.name].z);
                object.rotation.set(originalRotation[object.name].x, originalRotation[object.name].y, originalRotation[object.name].z);
              })
              
            }
          });
        }
        setAnimationControls((prev) => ({
          ...prev,
          [clickedName]: { ...prev[clickedName], [`speed${axis}`]: e.value },
        }));
      });
      bindings.push(binding);
    });
  }

 

 

  setPanes((prevPanes) => ({
    ...prevPanes,
    [selectedObjectName]: pane,
  }));

  return () => {
    // bindings.forEach((binding) => binding.dispose());
    pane.dispose();
  };
  }
  }, [hasProceeded, clickedName, bladeParent])

  useFrame(() => {
    Object.entries(animationControls).forEach(([objectName, controls]) => {

      if (selectedPreset === "fan") {
        ['X', 'Y', 'Z'].forEach((axis) => {
          bladeParent.forEach(pikin => {
              pikin.rotation[axis.toLowerCase()] += controls[`speed${axis}`] || 0;
            })
          });
      }else if(selectedPreset === "none") {
        referee.current.traverse((child) => {
          if (child.name === objectName) {
            ['X', 'Y', 'Z'].forEach((axis) => {
              child.rotation[axis.toLowerCase()] += controls[`speed${axis}`] || 0;
            });
          }
        });
      }
      
    });
  });

  


  useEffect(() => {
    boundingBoxHelper.current = new THREE.Box3Helper(new THREE.Box3(), 0xffff00);
    boundingBoxHelper.current.geometry.computeBoundingBox();
    boundingBoxHelper.current.box.setFromObject(referee.current);
    scene.add(boundingBoxHelper.current);
  }, [scene]);
  
  
  



    const loadedThreeD = useGLTF('../untitled.glb')
    const loadedThreeD2 = useGLTF('../fox.glb')
  return (
    <>
    <primitive ref={referee} object={loadedThreeD.scene} scale={3.5}  position={[1, 0, 1]} rotation={[0, -Math.PI/3, 0]} onPointerDown={(e)=>{handleClick(e), handleSecondClick(e)}}/>
    <primitive object={loadedThreeD2.scene} scale={0.5} position={[-2, 1.6, 1]} onPointerEnter={(e) => console.log( e.object)}/>
    </>
  )
}

export default Sample;

