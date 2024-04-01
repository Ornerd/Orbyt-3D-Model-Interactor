import React from 'react'

const ReadMeModal = ({readMe}) => {
  return (
    <div className='absolute bottom-0 z-10 w-2/5'>
      <h3>{readMe}</h3>
    </div>
  )
}

export default ReadMeModal
