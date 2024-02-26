import { useFrame, useLoader, useThree } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three';
import { useControls } from 'leva';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useGLTF } from '@react-three/drei'
import { Pane } from 'tweakpane';




const Sample = () => {
  const {gl, camera, size, scene}= useThree();
  const rayCaster= new THREE.Raycaster();
  const referee =useRef()
  const boundingBoxHelper = useRef(); 


  const [clicked, setClicked] = useState(false)
  const [clickedObject, setClickedObject] = useState(null);
  const [clickedName, setClickedName] = useState(null);
  const [originalRotatePosition, setOriginalRotatePosition] = useState({x: 0, y: 0, z: 0})
  const [animationControls, setAnimationControls] = useState([])
  const [panes, setPanes] = useState({});
  const [selectedObjectName, setSelectedObjectName] = useState(null);

 

 

  
 

  
  const handleClick = (e) => {
    // setClicked(clicked => !clicked);
    e.stopPropagation();
    const clickedObj = e.object;
    setClickedObject(clickedObj)

    const objectName = e.object.name;
    // setClickedName(objectName);

    const {rotation} = clickedObj.parent;
    setOriginalRotatePosition({x:rotation.x, y:rotation.y, z: rotation.z});

    function updateIt(newSt) {
      setClickedName(prv=> {
        console.log("previous", prv)
        console.log("new", newSt)
        return newSt
      })
    }

    updateIt(objectName);  
    setSelectedObjectName(objectName);

   if (!clickedObject) {
    console.error("e didn't dey")
   }
  }


  useEffect(() => {
  //   const pane = new Pane();

  //   const params = {
  //    rotationSpeedX : 0,
  //    rotationSpeedY : 0,
  //    rotationSpeedZ : 0,
  //  }

  //  const folder =  pane.addFolder({ title: clickedName? clickedName: 'any', expanded: true});
  //  folder.addBinding( params, 'rotationSpeedX', { min: 0, max: 0.5, step: 0.01 }).on('change', (e)=>{
  //  if (e.value == 0) {
  //    referee.current.traverse((child) => {
  //        if(child.name === clickedName) {
  //          child.parent.rotation.x = originalRotatePosition.x
  //          child.parent.rotation.y = originalRotatePosition.y
  //          child.parent.rotation.z = originalRotatePosition.z
  //        }
  //    })
  //  }
  //  if (e.last){
  //   console.log(e)
  //  }
  //  setAnimationControlsX({ speed: e.value });
  //  })
  //  folder.addBinding( params, 'rotationSpeedY', { min: 0, max: 0.5, step: 0.01 }).on('change', (e)=>{
  //  if (e.value == 0) {
  //    referee.current.traverse((child) => {
  //        if(child.name === clickedName) {
  //          child.parent.rotation.x = originalRotatePosition.x
  //          child.parent.rotation.y = originalRotatePosition.y
  //          child.parent.rotation.z = originalRotatePosition.z
  //        }
  //    })
  //  }
  //  // console.log('exported',pane.exportState());
  //  setAnimationControlsY({ speed: e.value })
  //  })
  //  folder.addBinding( params, 'rotationSpeedZ', { min: 0, max: 0.5, step: 0.01 }).on('change', (e)=>{
  //  if (e.value == 0) {
  //    referee.current.traverse((child) => {
  //        if(child.name === clickedName) {
  //          child.parent.rotation.x = originalRotatePosition.x
  //          child.parent.rotation.y = originalRotatePosition.y
  //          child.parent.rotation.z = originalRotatePosition.z
  //        }
  //    })
  //  }
  //  setAnimationControlsZ({ speed: e.value })
  // })

  // return () => {
  //   pane.dispose()
  // }

  if (clickedName) {
    const pane = new Pane();

  const params = {
    rotationSpeedX: 0,
    rotationSpeedY: 0,
    rotationSpeedZ: 0,
  };

  const folder = pane.addFolder({ title: clickedName || 'any', expanded: true });
  const bindings = [];

  ['X', 'Y', 'Z'].forEach((axis) => {
    const propName = `rotationSpeed${axis}`;
    const binding = folder.addBinding(params, propName, { min: 0, max: 0.3, step: 0.01 }).on('change', (e) => {
      if (e.value === 0) {
        referee.current.traverse((child) => {
          if (child.name === clickedName) {
            child.parent.rotation[axis.toLowerCase()] = originalRotatePosition[axis.toLowerCase()];
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

  setPanes((prevPanes) => ({
    ...prevPanes,
    [selectedObjectName]: pane,
  }));

  return () => {
    // bindings.forEach((binding) => binding.dispose());
    pane.dispose();
  };
  }
  }, [clickedName])

  useFrame(() => {
    Object.entries(animationControls).forEach(([objectName, controls]) => {
      referee.current.traverse((child) => {
        if (child.name === objectName) {
          ['X', 'Y', 'Z'].forEach((axis) => {
            child.parent.rotation[axis.toLowerCase()] += controls[`speed${axis}`] || 0;
          });
        }
      });
    });
  });

  // useFrame(()=>{
    
  //     // if (clickedName) {
  //     //   referee.current.traverse(child =>{
  //     //     if (child.name === clickedName) {
  //     //       child.parent.rotation.x += animationControlsX.speed;
  //     //       child.parent.rotation.y += animationControlsY.speed;
  //     //       child.parent.rotation.z += animationControlsZ.speed;        
  //     //   }})
  //     // }else{
  //     //   return;
  //     // }

  //     if (clickedName) {
  //       referee.current.traverse((child) => {
  //         if (child.name === clickedName) {
  //           ['X', 'Y', 'Z'].forEach((axis) => {
  //             child.parent.rotation[axis.toLowerCase()] += animationControls[clickedName]?.[`speed${axis}`] || 0;
  //           });
  //         }
  //       });
  //     }
  // })
 


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
    <primitive ref={referee} object={loadedThreeD.scene} scale={3.5}  position={[1, 0, 1]} rotation={[0, -Math.PI/3, 0]} onPointerDown={handleClick}/>
    <primitive object={loadedThreeD2.scene} scale={0.5} position={[-2, 1.6, 1]} onPointerEnter={(e) => console.log( e.object)}/>
    </>
  )
}

export default Sample;

