
import { lazy, Suspense, useState } from "react"
import Posts from "./Posts"
import StoryLayout from "./storyLayout"

// import StoryPage from "./storyPage"
const StoryPage=lazy(()=>import('./storyPage'))

function Feed(){
  const [open,setOpen]=useState(false)
 

  const setOpenHandler=(item)=>{
    setOpen(item)
    
  }
  return(
    <>
    {
      open && <Suspense><StoryPage setOpen={setOpen} open={open}/></Suspense>
    }
    <div className="sm:pl-20  md:pl-[15%] lg:pl-64    md:w-full "><StoryLayout setOpenHandler={setOpenHandler}/></div>
    <div className=" flex-1 flex flex-col sm:pl-20  md:pl-[15%] lg:pl-[25%]   items-center ">
   
      
      <Posts/>
      
    </div>
    </>
  )
}

export default Feed