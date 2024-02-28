import React from 'react'
import "./style.scss"
import Img from '../../components/lazyLoadImage/Img'
import notFound from '../../assets/no-results.png'
export const NotFound = () => {
  return (
    <div className='notFoundContainer'><Img src={notFound} className={notFound} /></div>
  )
}
