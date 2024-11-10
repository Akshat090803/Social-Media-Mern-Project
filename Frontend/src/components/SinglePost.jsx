import { useDispatch, useSelector } from "react-redux"
import Post from "./Post"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { setSelectedPost } from "@/redux/userPostSlice"
import { CiFaceFrown } from "react-icons/ci"
import NotAvailable from "./NotAvailable"


function ShowSinglePost({index}){
  const params=useParams()
  const dispatch=useDispatch()
 const {selectedPost,post}=useSelector((store)=>store.Posts)
 const select=post.find((obj)=>obj._id===params.id)


useEffect(()=>{
  dispatch(setSelectedPost(select))
  return ()=>{
    setSelectedPost(null)
  }
},[select])

const findIndex= index || post.findIndex((obj)=>obj._id===select?._id)

  return (
    <>
    {  select ?
    ( <div className="flex-1 flex flex-col items-center">
      <div className="md:m-14 my-14 ">
         
              <Post post={select} index={findIndex}/>
            

      </div>
                  
     </div>):(

      <NotAvailable css={' h-fit ml-64'} heading={'Uh-oh!'} message={'That post took a spontaneous vacation or went undercover!'} height={'screen'}/>

     )

}
    </>
  )
}

export default ShowSinglePost