import { useSelector } from "react-redux"
import Post from "./Post"

function Posts(){
  const {post}=useSelector((store)=>store.Posts)
      
  



  // const {username}=post
  // const {posts}=post
  // console.log(username)
  // console.log(posts)

  return(
    <>
    
      <div className="md:m-14 my-14 ">
        {
          post.map((item,index)=><Post key={item._id} post={item} index={index}/>)
         
        }
      </div>
      
  
    </>
  )
}

export default Posts