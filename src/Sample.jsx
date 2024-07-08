import { useFrame, useLoader, useThree } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three';
import { useControls } from 'leva';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useGLTF } from '@react-three/drei'
import { Pane } from 'tweakpane';
import { DoubleSide } from 'three';
import { color } from 'three/examples/jsm/nodes/Nodes.js';




const Sample = ({toggleResize, toggleAnimation, planeEditor, selectedPreset, handlePresetChange, submittedPreset, handleSelectionModal, hasProceeded, updateInfoText, confirmed, refd, refdResize, refdPlane,selectedModel}) => {
  const {gl, camera, size, scene}= useThree();
  const rayCaster= new THREE.Raycaster();
  const referee =useRef()
  const boundingBoxHelper = useRef(); 


  const [clicked, setClicked] = useState(false)
  const [clickedObject, setClickedObject] = useState(null);
  const [clickedName, setClickedName] = useState(null);

  const [originalRotation, setOriginalRotation] = useState([])
  const [originalPosition, setOriginalPosition] = useState([])
  const [originalMaterial, setOriginalMaterial] = useState([])

  const [animationControls, setAnimationControls] = useState([])
  const [fanAnimControls, setFanAnimControls] = useState([])
  const [panes, setPanes] = useState({});
  const [fanPanes, setFanPanes] = useState({});
  const [selectedObjectName, setSelectedObjectName] = useState(null);

  const[state, setState] = useState([])  //should be properly renamed paneState. Helps save our controls, especially those of the presets. 

  const [handleBladeSelection, setHandleBladeSelection] = useState(false)
  const [bladeParent, setBladeParent] = useState([]) //to store all the fan blades for rotation
  const [fanBladesArray, setFanBladesArray] = useState([])

  const [planeIsVisible, setPlaneVisibility] = useState(false)
  const [planeColor, setPlaneColor] = useState('#ffffff')
  const [planeRotation, setPlaneRotation] = useState([Math.PI/2, 0, 0])
  const planeRef = useRef()

 
  
  
  const handleClick = (e) => {  
    e.stopPropagation();
    if (toggleAnimation && !handleBladeSelection) {
      e.stopPropagation();
      const clickedObj = e.object;
      setClickedObject(clickedObj)
      // e.object.material.color.set(5,5,5);

      const objectName = e.object.name;

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

      if (existingBlade === -1){ //used to check if clicked item isn't part of any fan blade array
        handleSelectionModal(e);
      }else {
        handlePresetChange() // sets preset to fan so that other functions that depend on the fan preset can work
      }
      
    }else {
      return;
    }
    
  }

  useEffect(()=> {  //leads us the the handleSecondClick function. For fan blades, it helps automatically select all the child elements assumed to be blades, which can be later deselected based off the user's discretion.
    const handleItemSelection = ()=> {
      if(hasProceeded){
        if (selectedPreset === "fan") {
          
          referee.current.traverse((child) => {
            if (child.name === clickedName) {
              if (child.parent.name === referee.current.name) {
                console.log("this blade is standalone")
                setBladeParent(prevBlade=> [...prevBlade, child])
                child.material = new THREE.MeshStandardMaterial({ color:0x0000ff, emissive:0x0000ff });
              }else if (child.parent.name !== referee.current.name) {
                if (child.parent.children.length > 1) {
                  child.parent.children.forEach(child => {
                    setBladeParent(prevBlade=> [...prevBlade, child])
                    child.material = new THREE.MeshStandardMaterial({ color:0x0000ff, emissive:0x0000ff });
                  })
                } else {
                  console.log("this blade is still standalone")
                  setBladeParent(prevBlade=> [...prevBlade, child])
                  child.material = new THREE.MeshStandardMaterial({ color:0x0000ff, emissive:0x0000ff });
                }
                
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
  

  useEffect(()=> {  //saving the original rotations and positions for each mesh. This helps us keep things back in order after objects are displaced or moved from their original positions. For Example, if the user rotates his fan in a wrong axes, setting the value back to zero will in turn set the rotated blades to their default position, helping the user try another axes to get the correct rotation.
    const positions = {};
    const rotations = {};
    const materials = {};

    const findMeshes = (object) => {
      if (object instanceof THREE.Mesh) {
        // If the object is a mesh, add it to the array
        positions[object.name] = {x:object.position.x, y:object.position.y, z:object.position.z};
        rotations[object.name] = {x:object.rotation.x, y:object.rotation.y, z:object.rotation.z};
        materials[object.name] = object.material
      } else if (object.children && object.children.length > 0) {
        // If the object has children, recursively call this function for each child
        object.children.forEach(child => findMeshes(child));
      }
    };

    if (referee.current) {
      findMeshes(referee.current);
    }

    setOriginalMaterial(materials);
    setOriginalPosition(positions);
    setOriginalRotation(rotations)

  },[referee.current])
 

 const handleSecondClick = (e)=> {  //here is where you can add or remove blades from the fan arrays. Other presets where you'd need to add or remove objects can and will also be added here.
  if(toggleAnimation && handleBladeSelection) {
    let obj = e.object;
    const existingBladeParentIndex = fanBladesArray.findIndex(bladesArray => Array.isArray(bladesArray) && bladesArray.some(blade => blade.name === obj.name));
   
    if(selectedPreset=== "fan") {
      if (existingBladeParentIndex === -1){
        setBladeParent((prevBlades=> {
          if (prevBlades.includes(obj)) {
            console.log("removed",prevBlades)
            // obj.material.color.set( 0xffffff )
            obj.material = originalMaterial[obj.name]
            // obj.material = new THREE.MeshStandardMaterial({ color:'transparent' });
            return prevBlades.filter(blade => blade != obj)
          }else {
            console.log("added",prevBlades)
            // obj.material.color.set( 0xff0000 )
            obj.material = new THREE.MeshStandardMaterial({ color:0x0000ff, emissive:0x0000ff });
            return [...prevBlades, e.object]
          }
        }))
      } else {
        alert("item already selected as a fanblade");
      }     
    }
    }
    
 }
  

 useEffect(()=>{  //check to reset the emissiveness and add the fan blades to the array of arrays
  if(confirmed) {
    bladeParent.forEach(blade => {
      blade.material = originalMaterial[blade.name]
    })
    setFanBladesArray(prevFans => [...prevFans, bladeParent])
    setTimeout(()=> {
      setBladeParent([])
    }, 500)
    setHandleBladeSelection(false)
  }
 }, [confirmed])

 useEffect(()=>{  //check to ensure the emit and selection property is disabled when the animation mode is deselected
  if(!toggleAnimation) {
    bladeParent.forEach(blade => {
      blade.material = originalMaterial[blade.name]
    })
    setTimeout(()=> {
      setBladeParent([])
    }, 500)
    setHandleBladeSelection(false)
  }
 }, [toggleAnimation])


  useEffect(() => {

  if (toggleAnimation && submittedPreset) {
   
    const existingBladeIndex = fanBladesArray.findIndex(bladesArray => Array.isArray(bladesArray) && bladesArray.some(blade => blade.name === clickedName));

    if(selectedPreset === "fan") {
      
      fanBladesArray.forEach((bladesArray, index) => {
        
        const pane = new Pane({
          container: refd.current
        }); 
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
              }
              if (e.value !== 0) {  // check to ensure that only one axis can be rotated at every given time for fan blades. 
                ['X', 'Y', 'Z'].forEach((otherAxis) => {
                  if (otherAxis !== axis) {
                    bindings.find(b=> b.label === `rotate${otherAxis}`).disabled = true;
                    bindings.find(b => b.label === `rotate${otherAxis}`).value = 0;
                    bindings.find(b => b.label === `rotate${otherAxis}`).controller.value.rawValue = 0
                  }
                });
              } else {
                ['X', 'Y', 'Z'].forEach((otherAxis) => {
                  bindings.find(b=> b.label === `rotate${otherAxis}`).disabled = false;
                  
                });
              }
  
              if (e.value === 0) {
                const restoreInits = (object) => {
                  if (object instanceof THREE.Mesh) {
                    object.position.set(originalPosition[object.name].x, originalPosition[object.name].y, originalPosition[object.name].z);
                    object.rotation.set(originalRotation[object.name].x, originalRotation[object.name].y, originalRotation[object.name].z);
                  } else if (object.children && object.children.length > 0) {
                    // If the object has children, recursively call this function for each child
                    object.children.forEach(child => restoreInits(child));
                  }
                };
            
                if (referee.current) {
                  restoreInits(referee.current);
                }
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

      const pane = new Pane({
        container: refd.current
      });

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
            const restoreInits = (object) => {
              if (object instanceof THREE.Mesh) {
                // If the object is a mesh, add it to the array
                object.position.set(originalPosition[object.name].x, originalPosition[object.name].y, originalPosition[object.name].z);
                object.rotation.set(originalRotation[object.name].x, originalRotation[object.name].y, originalRotation[object.name].z);
              } else if (object.children && object.children.length > 0) {
                // If the object has children, recursively call this function for each child
                object.children.forEach(child => restoreInits(child));
              }
            };
        
            if (referee.current) {
              restoreInits(referee.current);
            }
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
            const restoreInits = (object) => {
              if (object instanceof THREE.Mesh) {
                // If the object is a mesh, add it to the array
                object.position.set(originalPosition[object.name].x, originalPosition[object.name].y, originalPosition[object.name].z);
                object.rotation.set(originalRotation[object.name].x, originalRotation[object.name].y, originalRotation[object.name].z);
              } else if (object.children && object.children.length > 0) {
                // If the object has children, recursively call this function for each child
                object.children.forEach(child => restoreInits(child));
              }
            };
        
            if (referee.current) {
              restoreInits(referee.current);
            }
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
        bindings.forEach((binding) => binding.dispose());
        pane.dispose();
      };
    }

  }

  }, [toggleAnimation, clickedName, submittedPreset, fanBladesArray])



  useEffect(()=> {
    if(toggleResize) {
      const pane = new Pane({
        container: refdResize.current
      }); 
      const params = {
        scale: referee.current.scale.x,
        x: referee.current.position.x,
        y: referee.current.position.y,
        z:  referee.current.position.z
      };

      const folder = pane.addFolder({ title: `model`, expanded: true });
      const folderTwo = pane.addFolder({ title: `position`, expanded: true });
      folder.addBinding(params, `scale`, { min: (referee.current.scale.x)/150, max: (referee.current.scale.x)*15 }).on('change', (e)=> {
        referee.current.scale.set(e.value, e.value, e.value)
      })

      const axes = ['x', 'y', 'z'];

      axes.forEach((axis) => {
        folderTwo.addBinding(params, axis, {min: -20, max: 20, step: 0.01}).on('change', (e) => {
          referee.current.position[axis] = e.value;
        });
      });
    }
  }, [toggleResize])

  useEffect(()=> {
    if(planeEditor) {
      const pane = new Pane({
        container: refdPlane.current
      });
      const params = {
        visible: false,
        scale: 0,
        orient: 'x',
        x: 0, 
        y: 0,
        z: 0,
        color: '#ffffff',
      };

      const folderOne = pane.addFolder({ title: `plane`, expanded: true });
      folderOne.addBinding(params, 'visible').on('change', (e)=> {
        setPlaneVisibility(e.value)
      })
      folderOne.addBinding(params, 'color').on('change', (e)=> {
        setPlaneColor(e.value)
      })
      folderOne.addBinding(params, 'scale', {min:0, max:20}).on('change', (e)=> {
        planeRef.current.scale.set(e.value, e.value, e.value)
        console.log(planeRef.current.rotation)
      })

      const folderTwo = pane.addFolder({title: 'orientation', expanded: true})
      folderTwo.addBinding(params, 'orient', {options: {
        X: 'x', 
        Y: 'y', 
        Z: 'z'
      }
      }).on('change', (e)=> {
        e.value=== 'x'?
        setPlaneRotation([Math.PI/2, 0, 0])
        :
        e.value === 'y'?
        setPlaneRotation([0, Math.PI/2, 0])
        :
        e.value === 'z'?
        setPlaneRotation([0, 0, Math.PI/2])
        :
        console.log(planeRef.current.rotation)
      })
      
      const folderThree = pane.addFolder({title: 'position', expanded: true})

      const axes = ['x', 'y', 'z'];
      axes.forEach((axis) => {
        folderThree.addBinding(params, axis, {min: -20, max: 20, step: 0.01}).on('change', (e) => {
          planeRef.current.position[axis] = e.value;
        });
      });
     

    }
  }, [planeEditor])




  useEffect(()=> {  //check to ensure only the last selected pane control is visible at any given time.
    if (refd.current.children.length > 1) {
      const lastChildIndex = refd.current.children.length-1

      for (let i = 0; i < lastChildIndex; i++) {
        refd.current.removeChild(refd.current.children[0]);
      }
    }
    if (refdResize.current.children.length > 1) {
      const lastChildIndex = refdResize.current.children.length-1

      for (let i = 0; i < lastChildIndex; i++) {
        refdResize.current.removeChild(refdResize.current.children[0]);
      }
    }
    if (refdPlane.current.children.length > 1) {
      const lastChildIndex = refdPlane.current.children.length-1

      for (let i = 0; i < lastChildIndex; i++) {
        refdPlane.current.removeChild(refdPlane.current.children[0]);
      }
    }
    
  })


  useFrame(() => {   
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
 
 
  

 



    const loadedThreeD = useGLTF(`/${selectedModel}`)
    const loadedThreeD2 = useGLTF('/fox.glb')
  return (
    <>
    <primitive ref={referee} object={loadedThreeD.scene} position={[0, 0, 0]} rotation={[0, 0, 0]} onPointerDown={(e)=>{handleClick(e), handleSecondClick(e)}}/>
    {/* <primitive object={loadedThreeD2.scene} scale={0.5} position={[-2, 1.6, 1]} onPointerEnter={(e) => console.log( e.object)}/> */}
    {
      planeIsVisible?
      <mesh rotation={planeRotation} ref={planeRef} receiveShadow={true}>
              <planeGeometry args={[10,10]}/>
              <meshStandardMaterial color = {planeColor} side = {DoubleSide}/>
            </mesh>

      :
      null
      }
    </>
    
  )
}

export default Sample;

