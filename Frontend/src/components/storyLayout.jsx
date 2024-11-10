import { useState } from "react"
import { useSelector } from "react-redux"
import unavailable from '../assets/unavailable.png'
import { IoIosAddCircle } from "react-icons/io"

function StoryLayout({setOpenHandler}){

  const {suggestedUser,user}=useSelector((store)=>store.auth)
  

  return (
    <>
    <section className="bg-lightTheme-priBack dark:bg-darkTheme-priBack py-3  md:mt-5  -mb-[4.5rem]  ">
      <div className="flex  overflow-x-scroll scrollbar-x-none overflow-hidden gap-4 items-center px-3  ">
         
      <div className=" text-center flex-shrink-0 cursor-pointer relative" onClick={()=>setOpenHandler(user)}>
                 <div className="rounded-full  py-[2px] px-[2px] relative ">
            <img className="h-14 w-14 rounded-full " src={ user?.profilePicture ||unavailable} alt="user create story" loading="lazy"/>
         
           </div>
           <p className="dark:text-darkTheme-mainText text-[10px] w-14 mt-1 overflow-hidden text-ellipsis  ">Your story</p>
            <IoIosAddCircle className="h-4 w-4 bg-white rounded-full text-darkTheme-btnBlue absolute top-11 left-10"/>
            </div>
              
           
           <div className="flex gap-3">
           {
            suggestedUser.map((item,index)=>{
              return(
               <div key={index} className=" text-center flex-shrink-0 cursor-pointer" onClick={()=>setOpenHandler(item)}>
                 <div className="rounded-full border-color-gradient-custom-class py-[2px] px-[2px]  ">
            <img className="h-14 w-14 rounded-full " src={ item?.profilePicture || unavailable} alt="user create story" loading="lazy" />
         
           </div>
           <p className="dark:text-darkTheme-mainText text-[10px] w-14 mt-1 overflow-hidden text-ellipsis ">{item?.username}</p>
               </div>
              )
            })
           }
           </div>
      
         
          
          
      </div>
    </section>
    </>
  )
}
export default StoryLayout