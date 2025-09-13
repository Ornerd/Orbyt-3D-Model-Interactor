import React from 'react'
import Button from './components/Button'
import { Link } from 'react-router-dom'

const Homepage = () => {
  return (
    <main className='w-screen, h-screen flex justify-center items-center p-4 relative'>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:34px_44px]"></div>
      <h1 className="text-3xl font-bold underline text-black absolute top-0 left-0 p-4">
         Orbyt-3D
        </h1>
        <section className='bg-white border-dashed border-gray-500 border-[1px] flex flex-col p-6 supported'>
            <h3 className='mb-2'>Drag and drop your models here – in the future.</h3>
            <h3 className='mb-8 text-center'>(supported formats: .glb)</h3>
            <div>
                <h4>Sample models:</h4>
                <div>
                    <Link to='App/windmill_low-poly.glb'><Button buttonText={'Windmill'} buttonStyle={'mr-4'}/></Link>
                    <Link to='App/UntitledAirplane.glb'><Button buttonText={'Metallic Airplane'}/></Link>
                </div>
                
            </div>
        </section>
    </main>
  )
}

export default Homepage