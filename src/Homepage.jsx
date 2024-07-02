import React from 'react'
import Button from './components/Button'
import { Link } from 'react-router-dom'

const Homepage = () => {
  return (
    <main className='w-full, h-screen flex p-4'>
      <h1 className="text-3xl font-bold underline text-black">
         Orbyt-3D
        </h1>
        <section className='border-dashed my-auto mx-auto border-gray-500 border-[1px] flex flex-col p-6'>
            <h3 className='mb-2'>Drag and drop your models here – in the future.</h3>
            <h3 className='mb-8 text-center'>(supported formats: .glb)</h3>
            <div>
                <h4>Sample models:</h4>
                <div>
                    <Link to='App/windmill_low-poly.glb'><Button buttonText={'Windmill'} buttonStyle={'mr-4'}/></Link>
                    <Link to='App/untitled.glb'><Button buttonText={'Metallic Windmill'}/></Link>
                </div>
                
            </div>
        </section>
    </main>
  )
}

export default Homepage