import { OrbitControls, Plane } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import Sample from './Sample'
import { DoubleSide } from 'three'
import Toggler from './components/Toggler'


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

  return (
    <div className='w-full h-screen'>
      Apparation
      <h1 className="text-3xl font-bold underline text-red-500">
        Animations with Three JS
      </h1>
      <Toggler/>
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
        <Sample/> 
        <axesHelper scale={3}/>
        <OrbitControls target={[0, 1, 0]}/>
      </Canvas>

    </div>
  )
}

export default App
