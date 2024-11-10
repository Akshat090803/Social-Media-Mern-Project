import { useState, useEffect } from "react"
import LoadingPage from "./loadingPage"
import { useLocation } from "react-router-dom"

function ShowLoadbaronUrlChange(){
  const {pathname}=useLocation()
  const [showLoadBar,setLoadBar]=useState(false)


  const handleLoadBar=()=>{
    
    
    setLoadBar(true)
    setTimeout(()=>{
      setLoadBar(false)
    },200)
  }

  useEffect(()=>{
       handleLoadBar()
  },[pathname])
  return(
    <>
     {
      showLoadBar  && <LoadingPage/>
    }
    </>
  )
}

export default ShowLoadbaronUrlChange