import {  MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DialogContent, Dialog, DialogTrigger, DialogTitle } from "./ui/dialog";
import { Link } from "react-router-dom";

import { Button } from "./ui/button";
import {  MdDeleteOutline,  MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useEffect, useState } from "react";
import { Description } from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setFollowing } from "@/redux/userAuthSlice";




function CommentDialogBox({ open, setOpenComment ,addCommentHandler,deleteCommentHandler,bookmarkHandler,isLegal}) {
  axios.defaults.baseURL = "https://social-media-mern-project.onrender.com/api/v1"; // Set your default base URL here
  const dispatch = useDispatch();

  const {user}=useSelector((store)=>store.auth)
  const {selectedPost}=useSelector((store)=>store.Posts)
  const [text,setText]=useState('')
 

  


   const changeHandler=(e)=>{
    if(e.target.value.trim()){
                setText(e.target.value)
    }
    else{
      setText('')
    }
  }

  const [isFollowing, setIsFollowing] = useState();
  useEffect(() => {
    setIsFollowing(user?.following.includes(selectedPost?.author._id));
  }, [selectedPost,user?.following]);
  
   const clickToFollow = async () => {
    try {
   
 
    const response=await axios.post(`/user/followorunfollow/${selectedPost?.author._id}`,{},{
      headers:{
         'Content-Type':'application/json'
      },
      withCredentials:true
     })
 
     if(response.data.success){
      
      dispatch(setFollowing({
        type:'rightSidebar',
        id:selectedPost?.author._id,
        action:response.data.action
      }))
      // setOpenThreeDot(false)
      toast.success(response.data.message)

     }
     } catch (error) {
               toast.error(error?.response?.data?.message)
               
     }
     
  };

  return (
    <>
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpenComment(false)}
          className={`bg-lightTheme-priBack dark:sm:bg-darkTheme-priBack max-w-5xl p-0 flex flex-col  dark:bg-[#1A1A1A]   }`}
        >
          <DialogTitle className="hidden"> Your Dialog Title </DialogTitle>
          <Description className="hidden">Create comment </Description>
          <div className="flex   ">
            <div className="w-1/2 hidden lg:block  sm:max-h-[27.1rem] sm:min-h-80  ">
              <img
                className="h-full   w-full object-fill rounded-l-sm"
                src={selectedPost?.image}
                alt="post"
                loading="lazy"
              />
            </div>

            <div className=" flex flex-col  mx-3 w-full  sm:w-1/2 rounded-t-md  ">
              {/* top user detail */}

              <div className="flex sm:justify-between justify-center items-center py-3 ">
               
               {/* this div only visible at mobile view */}
                 
                <div className="dark:text-darkTheme-mainText font-semibold  text-center sm:hidden transition-all "> <span onClick={()=>{setOpenComment(false)}} className="dark:text-darkTheme-mainText font-semibold absolute left-0 top-3 px-3 cursor-pointer "><MdOutlineKeyboardArrowLeft size={'24px'}/></span> Comments</div>
              
              {/* for responsoveness */}
               <div className="hidden sm:block transition-all ">
               <div className="flex gap-2 items-center">
                  <Link  to={`/profile/${selectedPost?.author._id}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedPost?.author.profilePicture || "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <Link  to={`/profile/${selectedPost?.author._id}`} className="dark:text-darkTheme-mainText font-medium text-sm">
                   { selectedPost?.author.username}
                  </Link>
                  {/* <Dot className="dark:text-darkTheme-mainText mr-0 "/> */}
                  <p className="dark:text-darkTheme-mainText my-auto font-extrabold pb-2">
                    .
                  </p>
                 {
               
                !isLegal ? (
                  isFollowing  ? (
                    <p className="text-sm font-medium dark:text-darkTheme-placeholder cursor-pointer dark:hover:text-darkTheme-mainText" onClick={clickToFollow}>
                    Following
                  </p>
                  ):(
                    <p className="dark:text-darkTheme-btnBlue font-medium cursor-pointer dark:hover:text-darkTheme-mainText text-sm" onClick={clickToFollow}>
                    {user?.followers.includes(selectedPost?.author._id)?'Follow back':'Follow'}
                  </p>
                  )
                ): <span className="text-sm dark:text-darkTheme-btnBlue text-lightTheme-btnBlue font-semibold">author</span>
                 }
                </div>
               </div>
               {/* for responsivenness */}
                <div className="hidden sm:block ">
                <Dialog>
                  <DialogTrigger asChild >
                    <MoreHorizontal className="dark:text-darkTheme-mainText cursor-pointer"/>
                  </DialogTrigger>
                  <DialogContent className="p-0 m-0 border-none ">
                  <div className=" bg-white dark:bg-darkTheme-dialog py-4 px-2 rounded-md"  >
                 <div className="flex flex-col items-center text-center">
              {/* <Button
                variant="ghost"
                className=" mb-2 text-[#ED4956]  dark:bg-darkTheme-dialog cursor-pointer w-full font-bold bg-transparent hover:text-[#ED4956] hover:bg-transparent dark:hover:text-[#ED4956] dark:hover:bg-transparent active:bg-gray-200 dark:active:bg-darkTheme-btnHover"
              >
                Unfollow
              </Button> */}
              {
                 !isLegal && (
                  isFollowing ? (
                    <Button
                variant="ghost"
                className=" mb-2 text-[#ED4956]  dark:bg-darkTheme-dialog cursor-pointer w-full font-bold bg-transparent hover:text-[#ED4956] hover:bg-transparent dark:hover:text-[#ED4956] dark:hover:bg-transparent active:bg-gray-200 dark:active:bg-darkTheme-btnHover"
                onClick={clickToFollow}
              >
                Unfollow
              </Button>
                  
                  ):(
                    <Button
                    variant="ghost"
                    className="  text-lightTheme-btnBlue  dark:bg-darkTheme-dialog cursor-pointer w-full font-bold bg-transparent  hover:bg-transparent hover:text-lightTheme-placeholder dark:text-darkTheme-btnBlue dark:hover:bg-transparent active:bg-gray-200 dark:active:bg-darkTheme-btnHover"
                    onClick={clickToFollow}
                  >
                     {user?.followers.includes(selectedPost?.author._id)?'Follow back':'Follow'}
                  </Button>
                  )
                 )
                 }

              <Button
                variant="ghost"
                className=" font-medium dark:bg-darkTheme-dialog cursor-pointer w-full dark:text-darkTheme-mainText bg-transparent  hover:bg-transparent dark:hover:text-darkTheme-mainText dark:hover:bg-transparent active:bg-gray-200 dark:active:bg-darkTheme-btnHover"
                onClick={bookmarkHandler}
              >
                 {
                  user?.bookmarks.includes(selectedPost?._id)?'Remove from favourites':'Add to favourites'
                }
              </Button>
            </div>
            </div>
                  </DialogContent>
                </Dialog>
                </div>
              </div>
              <hr className="dark:text-darkTheme-placeholder text-lightTheme-placeholder text-xs " />

              <div className="flex-1 overflow-y-auto scrollbar-none  scroll-smooth py-4  sm:min-h-80 min-h-[20rem]  max-h-[20rem] dark:text-darkTheme-mainText ">
             {/* first caption section than comments */}
               {
                selectedPost?.caption &&  <div className="flex gap-3 items-start mb-5">
                <Link  to={`/profile/${selectedPost?.author._id}`}>
                <Avatar className="h-7 w-7 cursor-pointer ">
                <AvatarImage
                  src={selectedPost?.author.profilePicture || "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"}
                  alt="profile_picture"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
                </Link>
                  <div className="w-72 sm:w-96">
                    <p className="dark:text-darkTheme-mainText font-semibold text-sm cursor-pointer">
                      <Link  to={`/profile/${selectedPost?.author._id}`}>{selectedPost?.author.username}</Link> <span className="dark:text-darkTheme-mainText cursor-text font-normal text-sm ml-[2px]">
                      {selectedPost?.caption}
                    </span>
                    </p>
                    
                  </div>
                </div>
               }
                     {/* comments ayenge */}
              {     
                selectedPost?.comments.map((comment,index)=>(
                  <div key={index} className="flex justify-between ">
                    <div className="flex gap-3 items-start mb-5">
                 <Link  to={`/profile/${comment?.commentor?._id}`}>
                 <Avatar className="h-7 w-7 cursor-pointer ">
                  <AvatarImage
                    src={comment?.commentor?.profilePicture || "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"}
                    alt="profile_picture"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                 </Link>
                    <div className='w-[16rem] sm:w-96 '>
                      <p className="dark:text-darkTheme-mainText font-semibold text-sm cursor-pointer">
                        <Link to={`/profile/${comment?.commentor?._id}`}>{comment?.commentor?.username}</Link> <span className="dark:text-darkTheme-mainText cursor-text font-normal text-sm ml-[2px] break-words">
                        {comment?.text}
                      </span>
                      </p>
                      
                    </div>
                  </div>
                 {
                  user._id === comment?.commentor?._id && <MdDeleteOutline size={'18px'} className="mr-7 cursor-pointer hover:text-red-500 mb-5 " onClick={()=>{deleteCommentHandler(comment?._id)}}/>
                 
                 }
                  
                  
                  </div>
                ))
              }
              </div>

              <hr />
              <div className="flex items-center py-2  sm:w-[29.8rem]">
                <input value={text} type="text" className=" w-full  outline-none border-none placeholder-lightTheme-placeholder dark:placeholder-darkTheme-placeholder dark:text-darkTheme-mainText  sm:text-[16px] bg-inherit p-2 rounded-sm " placeholder="Add a comment..."  onChange={changeHandler}/>
                <button disabled={!text} className={`${text?"text-lightTheme-btnBlue":"text-lightTheme-placeholder dark:text-lightTheme-placeholder"} font-semibold  sm:text-[16px] pr-3 `} onClick={()=>addCommentHandler(text,setText)}>
              Post
            </button>
              </div>
              
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CommentDialogBox;
