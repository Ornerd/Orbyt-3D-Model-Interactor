import React from 'react'

const Button = ({buttonStyle, buttonText, clickACtion}) => {
  return (
    <button className={`hover:bg-blue-950 hover:text-white border-[1px] shadow-card px-2 py-1 text-bold ${buttonStyle}`} onClick={clickACtion}>{buttonText}</button>
  )
}

export default Button