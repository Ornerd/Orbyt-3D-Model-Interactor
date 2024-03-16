import { useFrame, useLoader, useThree } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three';
import { useControls } from 'leva';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useGLTF } from '@react-three/drei'
import { Pane } from 'tweakpane';




const Sample = ({toggleAnimation, selectedPreset, handlePresetChange, submittedPreset, handleSelectionModal, hasProceeded, updateInfoText, confirmed}) => {
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
  const [fanAnimControls, setFanAnimControls] = useState([])
  const [panes, setPanes] = useState({});
  const [fanPanes, setFanPanes] = useState({});
  const [selectedObjectName, setSelectedObjectName] = useState(null);

  const[state, setState] = useState([])

  const [handleBladeSelection, setHandleBladeSelection] = useState(false)
  const [bladeParent, setBladeParent] = useState([]) //to store all the fan blades for rotation
  const [fanBladesArray, setFanBladesArray] = useState([])

 
  
  
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

      const existingBlade = fanBladesArray.findIndex(bladesArray => Array.isArray(bladesArray) && bladesArray.some(blade => blade.name === objectName));

      if (existingBlade === -1){ //used to check if clicked item isn;t part of any fan blade array
        handleSelectionModal(e);
      }else {
        handlePresetChange() // sets preset to fan 
      }
      
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
                setBladeParent(prevBlade=> [...prevBlade, child])
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

    setOriginalPosition(positions);
    setOriginalRotation(rotations)

  },[])
 

 const handleSecondClick = (e)=> {
  if(toggleAnimation && handleBladeSelection) {
    let obj = e.object;
    const existingBladeParentIndex = fanBladesArray.findIndex(bladesArray => Array.isArray(bladesArray) && bladesArray.some(blade => blade.name === obj.name));
    // console.log("here's",bladeParent)
    // console.log("here's the parent",fanBladesArray)
    // console.log("here's the index",existingBladeParentIndex)
    // console.log("here's the object",obj)   
    if(selectedPreset=== "fan") {
      if (existingBladeParentIndex === -1){
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
      } else {
        alert("item already selected as a fanblade");
      }     
    }
    }
    
 }
  

 useEffect(()=>{
  if(confirmed) {
    bladeParent.forEach(blade => {
      blade.material.emissive.set(0x000000)
      console.log('fired')
    })
    setFanBladesArray(prevFans => [...prevFans, bladeParent])
    setTimeout(()=> {
      setBladeParent([])
    }, 500)
    setHandleBladeSelection(false)
  }
 }, [confirmed])


//  useEffect(()=>{
//   console.log(fanBladesArray)
//   console.log(bladeParent)
//  })

  useEffect(() => {

  if (toggleAnimation && submittedPreset) {
   
    const existingBladeIndex = fanBladesArray.findIndex(bladesArray => Array.isArray(bladesArray) && bladesArray.some(blade => blade.name === clickedName));

    if(selectedPreset === "fan") {

      fanBladesArray.forEach((bladesArray, index) => {
        
        const pane = new Pane();

        const params = {
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
        };

        existingBladeIndex !== -1? index = existingBladeIndex : console.log(index)

        const folder = pane.addFolder({ title: `fan ${index + 1}`, expanded: true });
        const bindings = [];


        ['X', 'Y', 'Z'].forEach((axis) => {
          const propName = `rotate${axis}`;
          const binding = folder.addBinding(params, propName, { min: 0, max: 0.3, step: 0.01 }).on('change', (e) => {
            
            if (e.last) {
             const paneState = folder.exportState();
              setState(prev => [...prev, paneState]) 
              console.log(state)
            }
            if (e.value !== 0) {  // check to ensure that only one axis can be rotated at every given time for fan blades. 
              ['X', 'Y', 'Z'].forEach((otherAxis) => {
                if (otherAxis !== axis) {
                  bindings.find(b=> b.label === `rotate${otherAxis}`).disabled = true
                }
              });
            } else {
              ['X', 'Y', 'Z'].forEach((otherAxis) => {
                bindings.find(b=> b.label === `rotate${otherAxis}`).disabled = false;
              });
            }

            if (e.value === 0) {
              referee.current.children.forEach((object) => {
                if (object.isMesh) {
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
            setFanAnimControls(prevControls => ({
              ...prevControls,
              [index]: { ...prevControls[index],[`speed${axis}`]: e.value},
            }));
          });
          bindings.push(binding);
        });

        if(folder.title === `fan ${index + 1}`){
          const currentState = state.filter(stat => stat.title === folder.title)
          const latestState = currentState[currentState.length-1]
          folder.importState(latestState)
          console.log(currentState)
          console.log(latestState)
        }

        setFanPanes((prevPanes) => ({
          ...prevPanes,
          [`fan${index}`]: pane,
        }));
  
        return () => {
          bindings.forEach((binding) => binding.dispose());
          pane.dispose();
        };

      })
      
    }

    if (selectedPreset === "none" && existingBladeIndex === -1) {

      const pane = new Pane();

      const params = {
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
      };

      const folder = pane.addFolder({ title: clickedName? clickedName : 'any', expanded: true });
      const bindings = [];

      ['X', 'Y', 'Z'].forEach((axis) => {
        const propName = `rotate${axis}`;
        const binding = folder.addBinding(params, propName, { min: 0, max: 0.3, step: 0.01 }).on('change', (e) => {
          if (e.value === 0) {
            referee.current.children.forEach((object) => {
              if (object.isMesh) {
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
            [clickedName]: { ...prev[clickedName], [`rotSpeed${axis}`]: e.value },
          }));
        });
        bindings.push(binding);
      });
      ['X', 'Y', 'Z'].forEach((axis) => {
        const propName = `translate${axis}`;
        const binding = folder.addBinding(params, propName, { min: -10, max: 10, step: 0.01 }).on('change', (e) => {
          if (e.value === 0) {
            referee.current.children.forEach((object) => {
              if (object.isMesh) {
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
            [clickedName]: { ...prev[clickedName], [`movSpeed${axis}`]: e.value },
          }));
        });
        bindings.push(binding);
      });

      setPanes((prevPanes) => ({
        ...prevPanes,
        [selectedObjectName]: pane,
      }));

      return () => {
        // bindings.forEach((binding) => binding.dispose());
        pane.dispose();
      };
    }

  }
  }, [toggleAnimation, clickedName, submittedPreset, fanBladesArray])

  useFrame(() => {
    // Object.entries(fanAnimControls).forEach(([index, controls])=> {
    //   if (submittedPreset === "fan") {
    //     ['X', 'Y', 'Z'].forEach((axis) => {
    //       fanBladesArray.forEach(bladesArray => {
    //         if (bladesArray.includes(clickedObject)) {
    //           bladesArray.forEach(blade => {
    //             blade.rotation[axis.toLowerCase()] += controls[`speed${axis}`] || 0;
    //           })
    //         }
              
    //         })
    //       });
    //   }
    // })
    
    fanBladesArray.forEach((bladesArray, index) => {
      // Access the animation controls for the current fan blades array
      const controls = fanAnimControls[index];

      if (controls) {
          ['X', 'Y', 'Z'].forEach((axis) => {
              bladesArray.forEach((blade) => {
                blade.rotation[axis.toLowerCase()] += controls[`speed${axis}`] || 0;
            });
            // }
              
          });
      }
    });

    Object.entries(animationControls).forEach(([objectName, controls]) => {
      if(submittedPreset === "none") {
        referee.current.traverse((child) => {
          if (child.name === objectName) {
            ['X', 'Y', 'Z'].forEach((axis) => {
              child.rotation[axis.toLowerCase()] += controls[`rotSpeed${axis}`] || 0;
              child.position[axis.toLowerCase()] += controls[`movSpeed${axis}`] || 0;
            });
          }
        });
      }
      
    });
  });
 

  


  // useEffect(() => {
  //   boundingBoxHelper.current = new THREE.Box3Helper(new THREE.Box3(), 0xffff00);
  //   boundingBoxHelper.current.geometry.computeBoundingBox();
  //   boundingBoxHelper.current.box.setFromObject(referee.current);
  //   scene.add(boundingBoxHelper.current);
  // }, [scene]);
  
  
  



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

